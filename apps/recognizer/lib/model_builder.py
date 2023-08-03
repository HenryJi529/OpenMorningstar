from typing import Tuple, Dict, List

import torch
from torch import nn

from torchvision import datasets, transforms, models

# IMAGE_LENGTH = 224  # NOTE: Table 3 in the ViT paper
IMAGE_LENGTH = 64  # NOTE: TinyVGG default


def create_transforms(
    image_length: int = IMAGE_LENGTH,
) -> Tuple[transforms.Compose, transforms.Compose]:
    transform = transforms.Compose(
        [
            transforms.Grayscale(num_output_channels=3),
            transforms.Resize((image_length, image_length)),
            transforms.TrivialAugmentWide(31),
            transforms.ToTensor(),
        ]
    )
    test_transform = transforms.Compose(
        [
            transforms.Grayscale(num_output_channels=3),
            transforms.Resize((image_length, image_length)),
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


class TinyVGG(nn.Module):
    """Creates the TinyVGG architecture.

    Replicates the TinyVGG architecture from the CNN explainer website in PyTorch.
    See the original architecture here: https://poloclub.github.io/cnn-explainer/

    Args:
    hidden_units: An integer indicating number of hidden units between layers.
    output_shape: An integer indicating number of output units.
    """

    def __init__(
        self,
        hidden_units_num: int,
        output_shape: int,
        image_length: int,
    ) -> None:
        super().__init__()
        self.image_length = image_length
        rows, cols = image_length, image_length
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
        x = self.conv_block_1(x)
        x = self.conv_block_2(x)
        x = self.classifier(x)
        return x
        # return self.classifier(self.block_2(self.block_1(x))) # <- leverage the benefits of operator fusion

    @property
    def transforms(self):
        return create_transforms(
            image_length=self.image_length,
        )


class NiceViTB16(nn.Module):
    WEIGHTS = models.ViT_B_16_Weights.IMAGENET1K_V1

    def __init__(self, hidden_units_num: int, output_shape: int):
        super().__init__()
        origin_model = models.vit_b_16(weights=self.WEIGHTS)

        for param in origin_model.conv_proj.parameters():
            param.requires_grad = False
        for param in origin_model.encoder.parameters():
            param.requires_grad = False

        origin_model.heads = nn.Sequential(
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
        )
        self.origin_model = origin_model

    def forward(self, x: torch.Tensor):
        return self.origin_model.forward(x)

    @property
    def transforms(self):
        origin_transform = self.WEIGHTS.transforms()
        transform = transforms.Compose(
            [transforms.Grayscale(num_output_channels=3), origin_transform]
        )

        return transform, transform  # NOTE: 分别看作train_transform和test_transform
