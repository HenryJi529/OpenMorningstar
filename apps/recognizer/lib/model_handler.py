import json
from typing import List
from functools import cached_property
import requests
from pathlib import Path
from ftplib import FTP

from torch.nn import Module
from torch import inference_mode, load, Tensor
from torchinfo import summary

from PIL.Image import Image
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

    with open(Path(__file__).parent / "params" / filename, "wb") as file:
        ftp.retrbinary("RETR " + filename, file.write)

    ftp.quit()


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
        return summary(self.model, col_names=["num_params", "trainable"])

    @cached_property
    def model(self) -> Module:
        model = self.blank_model.to(self._device)
        model.load_state_dict(self.params)
        return model

    def predict(self, image: Image):
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
        params_path = Path(__file__).parent / "params" / self.WEIGHTS.url.split("/")[-1]
        if not params_path.is_file():
            request = requests.get(self.WEIGHTS.url)
            with open(params_path, "wb") as f:
                f.write(request.content)
        return load(f=params_path)

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
    WEIGHTS_FILENAME = None

    @cached_property
    def hyperparameters(self):
        def get_key_length(item: str):
            for each in item:
                if each.isdigit():
                    return item.index(each)

        hyperparameters = dict()
        filename_without_ext = ".".join(self.WEIGHTS_FILENAME.split(".")[:-1])
        hyperparameters["model"] = filename_without_ext.split("_")[0]
        for item in filename_without_ext.split("_")[1:]:
            key = item[: get_key_length(item)]
            value = item[get_key_length(item) :]
            hyperparameters[key] = value

        return hyperparameters

    @cached_property
    def transform(self):
        _, test_transform = self.blank_model.transforms
        return test_transform

    @cached_property
    def params(self):
        params_path = Path(__file__).parent / "params" / self.WEIGHTS_FILENAME
        if not (params_path).is_file():
            download_file_from_ftp(self.WEIGHTS_FILENAME)
        return load(f=params_path, map_location=self._device)

    @cached_property
    def categories(self):
        if int(self.hyperparameters["dataset"]) == 0:
            dataset = "CIFAR10"
        else:
            dataset = "Caltech256"
        with open(
            Path(__file__).parent / "data" / f"categories_{dataset}.json", "r"
        ) as json_file:
            loaded_data = json.load(json_file)
        return loaded_data


class TinyVGGHandler(CustomModelHandler):
    WEIGHTS_FILENAME = "TinyVGG_image64_hidden128_epochs20_batch32_lr0.001_dataset1.pth"

    @cached_property
    def blank_model(self) -> Module:
        return TinyVGG(
            hidden_units_num=int(self.hyperparameters["hidden"]),
            output_shape=len(self.categories),
            image_length=int(self.hyperparameters["image"]),
        )


class NiceViTB16Handler(CustomModelHandler):
    WEIGHTS_FILENAME = (
        "NiceViTB16_image224_hidden128_epochs20_batch32_lr0.001_dataset1.pth"
    )

    @cached_property
    def blank_model(self) -> Module:
        return NiceViTB16(
            hidden_units_num=int(self.hyperparameters["hidden"]),
            output_shape=len(self.categories),
        )


if __name__ == "__main__":
    import torch
    from PIL.Image import open as open_image

    modelHandlerList: List[ModelHandler] = [
        EfficientNetB2Handler,
        GoogLeNetHandler,
        TinyVGGHandler,
        NiceViTB16Handler,
    ]

    print("加载参数: ")
    for modelHandler in modelHandlerList:
        print(f"- 加载{modelHandler.__name__}参数...")
        _ = modelHandler().params

    print("=============================")

    img = open_image("./data/test.jpeg")
    print("预测测试: ")
    for modelHandler in modelHandlerList:
        print(f"- 使用{modelHandler.__name__}预测...")
        result = modelHandler().predict(img)
        print(f"    {result['category']}: {100 * result['score']:.1f}%")
