from typing import Tuple, Dict, List

import torch
from torch import nn

from torchvision import datasets, transforms, models

# IMAGE_SIZE = 224  # NOTE: Table 3 in the ViT paper
IMAGE_SIZE = 64  # NOTE: TinyVGG default


def create_transforms(
    image_size: int = IMAGE_SIZE,
) -> Tuple[transforms.Compose, transforms.Compose]:
    transform = transforms.Compose(
        [
            transforms.Lambda(lambda x: x.convert("RGB") if x.mode == "L" else x),
            # transforms.Grayscale(num_output_channels=3),
            transforms.Resize((image_size, image_size)),
            transforms.TrivialAugmentWide(31),
            transforms.ToTensor(),
        ]
    )
    test_transform = transforms.Compose(
        [
            transforms.Lambda(lambda x: x.convert("RGB") if x.mode == "L" else x),
            # transforms.Grayscale(num_output_channels=3),
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
        ]
    )
    return transform, test_transform


class LinearRegressionModel(nn.Module):
    """linear regression formula (y = m*x + b)"""

    def __init__(self):
        super().__init__()
        self.weights = nn.Parameter(
            torch.randn(
                1,
                requires_grad=True,
                dtype=torch.float,
            )
        )
        self.bias = nn.Parameter(
            torch.randn(
                1,
                requires_grad=True,
                dtype=torch.float,
            )
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.weights * x + self.bias


class LinearRegressionModelV2(nn.Module):
    def __init__(self):
        super().__init__()
        self.linear_layer = nn.Linear(in_features=1, out_features=1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.linear_layer(x)


class LinearReLURegressor(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.layer1 = torch.nn.Linear(2, 8)
        self.layer2 = torch.nn.Linear(8, 4)
        self.layer3 = nn.LazyLinear(out_features=1)
        # self.layer3 = torch.nn.Linear(4, 1)
        self.relu = torch.nn.ReLU()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.layer3(self.relu(self.layer2(self.relu(self.layer1(x)))))


class TinyVGG(nn.Module):
    """Creates the TinyVGG architecture.

    Replicates the TinyVGG architecture from the CNN explainer website in PyTorch.
    See the original architecture here: https://poloclub.github.io/cnn-explainer/

    Args:
    hidden_units_num: An integer indicating number of hidden units between layers.
    output_shape: An integer indicating number of output units.
    """

    def __init__(
        self,
        hidden_units_num: int,
        output_shape: int,
        image_size: int,
    ) -> None:
        super().__init__()
        self.image_size = image_size
        rows, cols = image_size, image_size
        self.conv_block_1 = nn.Sequential(
            nn.Conv2d(
                in_channels=3,
                out_channels=hidden_units_num,
                kernel_size=3,
                stride=1,
                padding=1,
            ),
            nn.ReLU(),
            nn.Conv2d(
                in_channels=hidden_units_num,
                out_channels=hidden_units_num,
                kernel_size=3,
                stride=1,
                padding=1,
            ),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        self.conv_block_2 = nn.Sequential(
            nn.Conv2d(
                hidden_units_num, hidden_units_num, kernel_size=3, stride=1, padding=1
            ),
            nn.ReLU(),
            nn.Conv2d(
                hidden_units_num, hidden_units_num, kernel_size=3, stride=1, padding=1
            ),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            # Where did this in_features shape come from?
            # It's because each layer of our network compresses and changes the shape of our inputs data.
            nn.Linear(
                in_features=hidden_units_num * int(rows * cols / 4 / 4),
                out_features=output_shape,
            ),
        )

    def forward(self, x: torch.Tensor):
        # x = self.conv_block_1(x)
        # x = self.conv_block_2(x)
        # x = self.classifier(x)
        # return x
        return self.classifier(
            self.conv_block_2(self.conv_block_1(x))
        )  # <- leverage the benefits of operator fusion

    @property
    def transforms(self):
        return create_transforms(
            image_size=self.image_size,
        )


class NiceViTB16(nn.Module):
    WEIGHTS = models.ViT_B_16_Weights.IMAGENET1K_V1

    def __init__(self, hidden_units_num: int, output_shape: int):
        super().__init__()

        origin_model = models.vit_b_16(weights=self.WEIGHTS)

        # origin_model.conv_proj.requires_grad_(False)
        # origin_model.encoder.requires_grad_(False)

        # NOTE: 其实也可以考虑全都设置requires_grad = False，然后替换掉heads
        for param in origin_model.parameters():
            param.requires_grad = False

        heads = [
            nn.Linear(
                in_features=768,
                out_features=hidden_units_num,
            ),
            torch.nn.Dropout(p=0.2, inplace=True),
            torch.nn.Linear(
                in_features=hidden_units_num,
                out_features=output_shape,
                bias=True,
            ),
        ]
        origin_model.heads = nn.Sequential(*heads)
        self.origin_model = origin_model

    def forward(self, x: torch.Tensor):
        return self.origin_model(x)

    @property
    def transforms(self):
        origin_transform = self.WEIGHTS.transforms()
        transform = transforms.Compose(
            [transforms.Grayscale(num_output_channels=3), origin_transform]
        )

        return transform, transform  # NOTE: 分别看作train_transform和test_transform


if __name__ == "__main__":
    model1 = LinearReLURegressor()
    tensor1 = torch.rand(10, 2)
    print(model1(tensor1))
