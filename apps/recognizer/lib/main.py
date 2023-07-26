import torch
from PIL.Image import open as open_image

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


if __name__ == "__main__":
    from model_handler import EfficientNetB2Handler

    img = open_image("./test.jpeg")
    result = EfficientNetB2Handler().predict(img)
    print(f"{result['category_name']}: {100 * result['score']:.1f}%")
