import argparse
import json
from typing import List
from functools import cached_property
import requests
from pathlib import Path
from ftplib import FTP

import numpy as np
from PIL import Image
from mlxtend.plotting import plot_confusion_matrix
from matplotlib import pyplot as plt
from torch.nn import Module
from torch import inference_mode, load, Tensor, autocast
from torchinfo import summary
import torchvision


try:
    from .utils import DEVICE, time
except ImportError:
    from utils import DEVICE, time

try:
    from .model_builder import TinyVGG, NiceViTB16
except ImportError:
    from model_builder import TinyVGG, NiceViTB16


def download_file_from_ftp(filename: str):
    ftp = FTP("ftp.morningstar369.com")
    ftp.login(user="ftp", passwd="1234asdw")
    ftp.cwd("Morningstar")

    with open(Path(__file__).parent / "models" / filename, "wb") as file:
        ftp.retrbinary("RETR " + filename, file.write)

    ftp.quit()


def create_random_image() -> Image.Image:
    # 图像尺寸和像素值范围
    width = 256
    height = 256
    min_value = 0
    max_value = 255

    # 生成随机像素值
    random_pixels = np.random.randint(
        min_value, max_value, size=(height, width, 3), dtype=np.uint8
    )

    # 创建 PIL 图像对象
    image = Image.fromarray(random_pixels)

    return image


class ModelHandler:
    def __init__(self, device=DEVICE):
        self._device = device

    @cached_property
    def transform(self):
        raise NotImplementedError

    @cached_property
    def params(self):
        raise NotImplementedError

    @cached_property
    def categories(self):
        raise NotImplementedError

    @cached_property
    def blank_model(self) -> Module:
        raise NotImplementedError

    def summary(self):
        return summary(
            self.model,
            input_size=[10, 3, self.image_size, self.image_size],
            col_names=[
                "input_size",
                "output_size",
                "num_params",
                "params_percent",
                "trainable",
            ],
            depth=3,
            col_width=18,
            row_settings=["var_names"],
        )

    @cached_property
    def image_size(self):
        raise NotImplementedError

    @cached_property
    def model_path(self):
        raise NotImplementedError

    @cached_property
    def model_size(self):
        return round(self.model_path.stat().st_size / 1024 / 1024, 1)

    @cached_property
    def model(self) -> Module:
        model = self.blank_model.to(self._device)
        model.load_state_dict(self.params)
        return model

    @time
    def predict(self, image: Image.Image, enable_autocast: bool = True):
        self.model.eval()
        transformed_image = self.transform(image)
        batch = transformed_image.unsqueeze(0).to(self._device)
        with inference_mode():
            with autocast(
                device_type=self._device if self._device in ["cuda", "cpu"] else "cpu",
                enabled=enable_autocast,
            ):  # 混合精度计算(mixed precision computation)
                pred: Tensor = self.model(batch)
            pred_logits = pred.squeeze().cpu()
            pred_probs: Tensor = pred_logits.softmax(dim=0)
            label = pred_probs.argmax().item()
            score = pred_probs[label].item()
            category = self.categories[label]
            return {"category": category, "score": score}


class PretrainedModelHandler(ModelHandler):
    """Torch Vision官方提供的预训练模型及其参数"""

    WEIGHTS = None

    @cached_property
    def transform(self):
        return self.WEIGHTS.transforms()

    @cached_property
    def model_path(self):
        return Path(__file__).parent / "models" / self.WEIGHTS.url.split("/")[-1]

    @cached_property
    def params(self):
        params_path = self.model_path
        if not params_path.is_file():
            request = requests.get(self.WEIGHTS.url)
            with open(params_path, "wb") as f:
                f.write(request.content)
        return load(f=params_path)

    @cached_property
    def image_size(self):
        image = create_random_image()
        return self.transform(image).shape[-1]

    @cached_property
    def categories(self):
        return self.WEIGHTS.meta["categories"]

    def evaluate(self):
        print("    该模型未提供性能评估结果...")


class CustomModelHandler(ModelHandler):
    MODEL_FILENAME = None

    @cached_property
    def model_path(self):
        return Path(__file__).parent / "models" / self.MODEL_FILENAME

    @cached_property
    def info(self):
        info_path = self.model_path
        if not (info_path).is_file():
            download_file_from_ftp(self.MODEL_FILENAME)
        return load(f=info_path, map_location=self._device)

    @cached_property
    def params(self):
        return self.info["model_state_dict"]

    @cached_property
    def hyperparameters(self):
        return self.info["hyperparameters"]

    @cached_property
    def image_size(self):
        return self.hyperparameters["image_size"]

    @cached_property
    def hidden_units_num(self):
        return self.hyperparameters["hidden_units_num"]

    @cached_property
    def transform(self):
        _, test_transform = self.blank_model.transforms
        return test_transform

    @cached_property
    def categories(self):
        with open(
            Path(__file__).parent
            / f"data/categories_{self.hyperparameters['dataset_name']}.json",
            "r",
        ) as json_file:
            loaded_data = json.load(json_file)
        return loaded_data

    def evaluate(self):
        print(f'    accuracy: {self.info["evaluation_results"]["accuracy"]*100:.2f}%')
        print(f'    recall: {self.info["evaluation_results"]["recall"]*100:.2f}%')
        print(f'    precision: {self.info["evaluation_results"]["precision"]*100:.2f}%')
        print(f'    f1_score: {self.info["evaluation_results"]["f1_score"]*100:.2f}%')
        if len(self.categories) <= 20:
            plot_confusion_matrix(
                conf_mat=self.info["evaluation_results"]["confusion_matrix"],
                class_names=self.categories,
                figsize=(20, 20),
            )
            plt.title(f"{type(self.model).__name__} Confusion Matrix")
            plt.show()
        else:
            print("    类别数大于20，不显示混淆矩阵。")


class EfficientNetB2Handler(PretrainedModelHandler):
    """EfficientNet_B2"""

    WEIGHTS = torchvision.models.EfficientNet_B2_Weights.IMAGENET1K_V1

    @cached_property
    def blank_model(self) -> Module:
        return torchvision.models.efficientnet_b2()


class GoogLeNetHandler(PretrainedModelHandler):
    """GoogLeNet"""

    WEIGHTS = torchvision.models.GoogLeNet_Weights.IMAGENET1K_V1

    @cached_property
    def blank_model(self) -> Module:
        return torchvision.models.googlenet(init_weights=True)


class AlexNetHandler(PretrainedModelHandler):
    """AlexNet"""

    WEIGHTS = torchvision.models.AlexNet_Weights.IMAGENET1K_V1

    @cached_property
    def blank_model(self) -> Module:
        return torchvision.models.alexnet()


class TinyVGGHandler(CustomModelHandler):
    MODEL_FILENAME = "TinyVGG_latest.pth"

    @cached_property
    def blank_model(self) -> Module:
        return TinyVGG(
            hidden_units_num=self.hidden_units_num,
            output_shape=len(self.categories),
            image_size=self.image_size,
        )


class NiceViTB16Handler(CustomModelHandler):
    MODEL_FILENAME = "NiceViTB16_latest.pth"

    @cached_property
    def blank_model(self) -> Module:
        return NiceViTB16(
            hidden_units_num=self.hidden_units_num,
            output_shape=len(self.categories),
        )

    def predict(self, image: Image.Image):
        return super().predict(image, enable_autocast=False)


class ModelhandlerLoader:
    _modelHandlerDict = dict()

    SUPPORTED_MODEL_HANDLER = {
        "EfficientNetB2": EfficientNetB2Handler,
        "GoogLeNet": GoogLeNetHandler,
        # "AlexNet": AlexNetHandler,
        "TinyVGG": TinyVGGHandler,
        "NiceViTB16": NiceViTB16Handler,
    }

    @classmethod
    def __loadModelHandler(cls, modelHandlerClass):
        if cls._modelHandlerDict.get(modelHandlerClass.__name__) is None:
            cls._modelHandlerDict[modelHandlerClass.__name__] = modelHandlerClass()

    @classmethod
    def getModelHandler(cls, modelHandlerName: str) -> ModelHandler:
        try:
            modelHandlerClass = ModelhandlerLoader.SUPPORTED_MODEL_HANDLER[
                modelHandlerName
            ]
        except KeyError:
            raise Exception("不存在这样的modelHandler")
        if cls._modelHandlerDict.get(modelHandlerClass.__name__) is None:
            cls.__loadModelHandler(modelHandlerClass)
        return cls._modelHandlerDict[modelHandlerClass.__name__]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Handle model")
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        required=False,
        default=False,
        help="是否显示模型摘要和评估结果",
    )
    args = parser.parse_args()

    print("加载参数: ")
    for modelHandlerName in ModelhandlerLoader.SUPPORTED_MODEL_HANDLER:
        modelHandler: ModelHandler = ModelhandlerLoader.getModelHandler(
            modelHandlerName
        )
        modelHandlerName = modelHandler.__class__.__name__
        print(f"- 加载{modelHandlerName}参数...")
        _ = modelHandler.params
        print(f"\t{modelHandlerName}模型大小为: {modelHandler.model_size}MB")
        if args.verbose:
            print(f"- 显示{modelHandlerName}摘要...")
            modelHandler.summary()
            print("=============================")
            print(f"评估模型: {modelHandlerName}")
            modelHandler.evaluate()
            print("=============================")
            img = Image.open(Path(__file__).parent / "data/test.jpeg")
            print(f"- 使用{modelHandlerName}预测...")
            result = modelHandler.predict(img)
            print(f"单图测试: {result['category']}: {100 * result['score']:.1f}%")
