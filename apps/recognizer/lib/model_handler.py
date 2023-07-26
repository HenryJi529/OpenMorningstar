from functools import cached_property
import requests
from pathlib import Path

from torch.nn import Module
from torch import inference_mode, load

from PIL.Image import Image
import torchvision


class ModelHandler:
    def __init__(self, device="cpu"):
        self._device = device

    @cached_property
    def transform(self):
        raise NotImplementedError

    @cached_property
    def params(self):
        return NotImplementedError

    @cached_property
    def categories(self):
        return NotImplementedError

    @cached_property
    def blank_model(self) -> Module:
        raise NotImplementedError

    @cached_property
    def model(self) -> Module:
        model = self.blank_model.to(self._device)
        model.load_state_dict(self.params)
        return model

    def predict(self, image: Image):
        self.model.eval()
        batch = self.transform(image).unsqueeze(0).to(self._device)
        with inference_mode():
            prediction = self.model(batch).squeeze(0).softmax(0)
            class_id = prediction.argmax().item()
            score = prediction[class_id].item()
            category_name = self.categories[class_id]
            return {"category_name": category_name, "score": score}


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