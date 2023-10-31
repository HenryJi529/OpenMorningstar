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


class CustomViT(nn.Module):
    class PatchAndPositionEmbeddingBlock(nn.Module):
        """Turns a 2D input image into a 1D sequence learnable embedding vector.

        Args:
            patch_size (int): Size of patches to convert input image into. Defaults to 16.
            embedding_dim (int): Size of embedding to turn image into. Defaults to 768.
        """

        def __init__(
            self,
            patch_size: int = 16,
            image_size: int = 224,
            embedding_dim: int = 768,
            embedding_dropout: float = 0.1,
        ):
            super().__init__()
            if image_size % patch_size == 0:
                pass
            else:
                raise ValueError(
                    f"Input image size must be divisble by patch size, image shape: {image_size}, patch size: {patch_size}"
                )
            self.patch_num = int(image_size**2 / patch_size**2)

            self.patcher = nn.Conv2d(
                in_channels=3,
                out_channels=embedding_dim,
                kernel_size=patch_size,
                stride=patch_size,
                padding=0,
            )

            self.flatten = nn.Flatten(
                start_dim=2,  # only flatten the feature map dimensions into a single vector
                end_dim=3,
            )

            self.class_embedding = nn.Parameter(
                torch.rand(
                    1, embedding_dim
                ),  # [batch_size, number_of_tokens, embedding_dimension]
                requires_grad=True,
            )

            self.position_embedding = nn.Parameter(
                torch.rand(self.patch_num + 1, embedding_dim), requires_grad=True
            )

            self.embedding_dropout = nn.Dropout(p=embedding_dropout)

        def forward(self, x):
            # LinearProjection of FlattenedPatche
            x_patched = self.flatten(self.patcher(x)).permute(0, 2, 1)
            # Prepend class_token for each image
            x_patched_with_class_embedding = torch.cat(
                (self.class_embedding.unsqueeze(0).repeat(x.shape[0], 1, 1), x_patched),
                dim=1,
            )
            # Add position embeddings
            patch_and_position_embedding = (
                x_patched_with_class_embedding
                + self.position_embedding.unsqueeze(0).repeat(x.shape[0], 1, 1)
            )

            return self.embedding_dropout(patch_and_position_embedding)

    class TransformerEncoderBlock(nn.Module):
        class MultiheadSelfAttentionBlock(nn.Module):
            """Creates a multi-head self-attention block ("MSA block" for short)."""

            def __init__(
                self,
                embedding_dim: int = 768,  # Hidden size D from Table 1 for ViT-Base
                heads_num: int = 12,  # Heads from Table 1 for ViT-Base
                attn_dropout: float = 0,
            ):  # doesn't look like the paper uses any dropout in MSABlocks
                super().__init__()

                # Create the Norm layer (LN)
                self.layer_norm = nn.LayerNorm(normalized_shape=embedding_dim)

                # Create the Multi-Head Attention (MSA) layer
                self.multihead_attn = nn.MultiheadAttention(
                    embed_dim=embedding_dim,
                    num_heads=heads_num,
                    dropout=attn_dropout,
                    batch_first=True,
                )  # does our batch dimension come first?(batch, seq, feature)

            def forward(self, x):
                x = self.layer_norm(x)
                attn_output, _ = self.multihead_attn(
                    query=x,  # query embeddings
                    key=x,  # key embeddings
                    value=x,  # value embeddings
                    need_weights=False,
                )  # do we need the weights or just the layer outputs?
                return attn_output

        class MLPBlock(nn.Module):
            def __init__(
                self,
                embedding_dim: int = 768,
                mlp_size: int = 3072,
                mlp_dropout: float = 0.1,
            ):
                super().__init__()

                self.layer_norm = nn.LayerNorm(normalized_shape=embedding_dim)

                self.mlp = nn.Sequential(
                    nn.Linear(in_features=embedding_dim, out_features=mlp_size),
                    nn.GELU(),
                    nn.Dropout(p=mlp_dropout),
                    nn.Linear(in_features=mlp_size, out_features=embedding_dim),
                    nn.Dropout(p=mlp_dropout),
                )

            def forward(self, x):
                return self.mlp(self.layer_norm(x))

        def __init__(
            self,
            embedding_dim: int = 768,
            heads_num: int = 12,
            mlp_size=3072,
            mlp_dropout: float = 0.1,
            attn_dropout: float = 0,
        ):
            super().__init__()

            self.msa_block = self.MultiheadSelfAttentionBlock(
                embedding_dim=embedding_dim,
                heads_num=heads_num,
                attn_dropout=attn_dropout,
            )

            self.mlp_block = self.MLPBlock(
                embedding_dim=embedding_dim, mlp_size=mlp_size, mlp_dropout=mlp_dropout
            )

        def forward(self, x):
            x = self.msa_block(x) + x
            x = self.mlp_block(x) + x
            return x

    def __init__(
        self,
        image_size: int = 224,
        patch_size: int = 16,
        tranformer_encoder_num: int = 12,
        embedding_dim: int = 768,
        mlp_size: int = 3072,
        heads_num: int = 12,
        attn_dropout: float = 0,
        mlp_dropout: float = 0.1,
        embedding_dropout: float = 0.1,
        output_shape: int = 1000,
    ):
        super().__init__()

        self.embed_block = self.PatchAndPositionEmbeddingBlock(
            patch_size=patch_size,
            image_size=image_size,
            embedding_dim=embedding_dim,
            embedding_dropout=embedding_dropout,
        )

        self.transformer_encoder = nn.ModuleList(
            [
                self.TransformerEncoderBlock(
                    embedding_dim=embedding_dim,
                    heads_num=heads_num,
                    mlp_size=mlp_size,
                    mlp_dropout=mlp_dropout,
                    attn_dropout=attn_dropout,
                )
                for _ in range(tranformer_encoder_num)
            ]
        )

        self.classifer = nn.Sequential(
            nn.LayerNorm(normalized_shape=embedding_dim),
            nn.Linear(in_features=embedding_dim, out_features=output_shape),
        )

    def forward(self, x):
        x = self.embed_block(x)
        for transformer_encoder_block in self.transformer_encoder:
            x = transformer_encoder_block(x)

        x = self.classifer(x[:, 0, :])

        return x


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
    vit = CustomViT()
    x = torch.rand(10, 3, 224, 224)
    assert vit(x).shape == (10, 1000), "What??"
