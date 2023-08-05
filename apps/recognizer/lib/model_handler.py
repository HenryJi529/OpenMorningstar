import json
from typing import List
from functools import cached_property
import requests
from pathlib import Path
from ftplib import FTP

import numpy as np
from PIL import Image

from torch.nn import Module
from torch import inference_mode, load, Tensor
from torchinfo import summary
import torchvision


try:
    from .utils import DEVICE
except ImportError:
    from utils import DEVICE

try:
    from .model_builder import TinyVGG, NiceViTB16
except ImportError:
    from model_builder import TinyVGG, NiceViTB16


def download_file_from_ftp(filename: str):
    ftp = FTP("ftp.morningstar369.com")
    ftp.login(user="ftp", passwd="1234asdw")

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


class ModelhandlerLoader:
    _modelHandlerDict = dict()

    @classmethod
    def loadModelHandler(cls, modelHandlerClass):
        if cls._modelHandlerDict.get(modelHandlerClass.__name__) is None:
            cls._modelHandlerDict[modelHandlerClass.__name__] = modelHandlerClass()

    @classmethod
    def getModelHandler(cls, modelHandlerClass) -> "ModelHandler":
        if cls._modelHandlerDict.get(modelHandlerClass.__name__) is None:
            cls.loadModelHandler(modelHandlerClass)
        return cls._modelHandlerDict[modelHandlerClass.__name__]


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
            input_size=[10, 3, self.image_length, self.image_length],
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
            verbose=1,
        )

    @cached_property
    def image_length(self):
        raise NotImplementedError

    @cached_property
    def model(self) -> Module:
        model = self.blank_model.to(self._device)
        model.load_state_dict(self.params)
        return model

    def predict(self, image: Image.Image):
        self.model.eval()
        transformed_image = self.transform(image)
        batch = transformed_image.unsqueeze(0).to(self._device)
        with inference_mode():
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
    def params(self):
        params_path = Path(__file__).parent / "models" / self.WEIGHTS.url.split("/")[-1]
        if not params_path.is_file():
            request = requests.get(self.WEIGHTS.url)
            with open(params_path, "wb") as f:
                f.write(request.content)
        return load(f=params_path)

    @cached_property
    def image_length(self):
        image = create_random_image()
        return self.transform(image).shape[-1]

    @cached_property
    def categories(self):
        return self.WEIGHTS.meta["categories"]


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


class CustomModelHandler(ModelHandler):
    MODEL_FILENAME = None

    @cached_property
    def info(self):
        info_path = Path(__file__).parent / "models" / self.MODEL_FILENAME
        if not (info_path).is_file():
            download_file_from_ftp(self.WEIGHTS_FILENAME)
        return load(f=info_path, map_location=self._device)

    @cached_property
    def params(self):
        return self.info["model_state_dict"]

    @cached_property
    def hyperparameters(self):
        return self.info["hyperparameters"]

    def evaluate(self):
        print(self.info["evaluation_results"])

    @cached_property
    def image_length(self):
        return self.hyperparameters["image_length"]

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


class TinyVGGHandler(CustomModelHandler):
    MODEL_FILENAME = "TinyVGG_latest.pth"

    @cached_property
    def blank_model(self) -> Module:
        return TinyVGG(
            hidden_units_num=self.hidden_units_num,
            output_shape=len(self.categories),
            image_length=self.image_length,
        )


class NiceViTB16Handler(CustomModelHandler):
    MODEL_FILENAME = "NiceViTB16_latest.pth"

    @cached_property
    def blank_model(self) -> Module:
        return NiceViTB16(
            hidden_units_num=self.hidden_units_num,
            output_shape=len(self.categories),
        )


if __name__ == "__main__":
    modelHandlerList: List[ModelHandler] = [
        EfficientNetB2Handler,
        GoogLeNetHandler,
        TinyVGGHandler,
        NiceViTB16Handler,
    ]

    print("加载参数: ")
    for modelHandler in modelHandlerList:
        print(f"- 加载{modelHandler.__name__}参数...")
        modelHandler().summary()
        _ = modelHandler().params

    print("=============================")

    img = Image.open(Path(__file__).parent / "data/test.jpeg")
    print("预测测试: ")
    for modelHandler in modelHandlerList:
        print(f"- 使用{modelHandler.__name__}预测...")
        result = modelHandler().predict(img)
        print(f"    {result['category']}: {100 * result['score']:.1f}%")
