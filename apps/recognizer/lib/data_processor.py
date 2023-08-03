import json
import re
import math
from pathlib import Path
from typing import TypeVar, Tuple, Dict, List, Union

from torchvision import datasets, transforms
from torchvision.datasets.vision import VisionDataset
from torch.utils.data import DataLoader
from torch.utils.data import random_split

BATCH_SIZE = 32


def create_dataloaders(
    transformTuple: Union[
        Tuple[transforms.Compose],
        Tuple[transforms.Compose, transforms.Compose],
    ],
    datasetClass: VisionDataset = None,
    datadirTuple: Tuple[str, str, str] = None,
    split_ratio: Tuple[float, float, float] = (0.7, 0.2, 0.1),
    batch_size: int = BATCH_SIZE,
    num_workers: int = 0,
    pin_memory: bool = True,
) -> Tuple[DataLoader, DataLoader, DataLoader, List]:
    """Creates training, validation and testing DataLoaders.

    Args:
        transformTuple: torchvision transforms to perform on dataset.
        dataset: A PyTorch dataset object.
        datadirTuple: A list of paths to directories containing data.
        split_ratio: A tuple of floats indicating the ratio of train, test, and validation data.
        batch_size: Number of samples per batch in each of the DataLoaders.
        num_workers: An integer for number of workers per DataLoader.

    Returns:
        A tuple of (train_dataloader, val_dataloader, test_dataloader, categories).
        Where categories is a list of the target category.
    """
    if not datasetClass and not datadirTuple:
        raise ValueError("必须提供数据集或数据集目录")

    if len(transformTuple) == 1:
        transform = transformTuple[0]
    elif len(transformTuple) == 2:
        transform = transformTuple[0]
        test_transform = transformTuple[1]

    if datasetClass:
        dataset = datasetClass(
            root=Path(__file__).parent / f"data/{datasetClass.__name__}/",
            transform=transform,
            download=True,
        )
        # 定义划分比例
        train_ratio, val_ratio, test_ratio = split_ratio
        if not math.isclose(train_ratio + val_ratio + test_ratio, 1):
            raise ValueError("划分比例之和必须为1")

        # 计算划分数量
        train_size = int(train_ratio * len(dataset))
        val_size = int(val_ratio * len(dataset))
        test_size = len(dataset) - train_size - val_size

        # 划分数据集
        train_dataset, val_dataset, test_dataset = random_split(
            dataset, [train_size, val_size, test_size]
        )

        # 获取分类名
        if hasattr(dataset, "classes"):
            categories = dataset.classes
        elif hasattr(dataset, "categories"):
            categories = dataset.categories
        else:
            raise ValueError("无法获取分类名列表")

        # 清理分类名
        if re.match(r"^\d", categories[0]):
            categories = [".".join(category.split(".")[1:]) for category in categories]

        # 保存分类名
        with open(
            Path(__file__).parent / f"data/categories_{datasetClass.__name__}.json", "w"
        ) as json_file:
            json.dump(categories, json_file)
    else:
        # 划分目录
        train_dir, val_dir, test_dir = datadirTuple[0], datadirTuple[1], datadirTuple[2]

        if len(transformTuple) == 2:
            # Use ImageFolder to create dataset(s)
            train_dataset = datasets.ImageFolder(train_dir, transform=transform)
            val_dataset = datasets.ImageFolder(val_dir, transform=test_transform)
            test_dataset = datasets.ImageFolder(test_dir, transform=test_transform)
        else:
            # Use ImageFolder to create dataset(s)
            train_dataset = datasets.ImageFolder(train_dir, transform=transform)
            val_dataset = datasets.ImageFolder(val_dir, transform=transform)
            test_dataset = datasets.ImageFolder(test_dir, transform=transform)

        # 获取分类名
        categories = train_dataset.classes

        # 清理分类名
        if re.match(r"^\d", categories[0]):
            categories = [".".join(category.split(".")[1:]) for category in categories]

        # 保存分类名(根据train_dir的上一层名称)
        with open(
            Path(__file__).parent
            / f"data/categories_{Path(train_dir).parent.name}.json",
            "w",
        ) as json_file:
            json.dump(categories, json_file)

    # 创建数据加载器
    train_dataloader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=pin_memory,
    )
    val_dataloader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=pin_memory,
    )
    test_dataloader = DataLoader(
        test_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=pin_memory,
    )

    return train_dataloader, val_dataloader, test_dataloader, categories


if __name__ == "__main__":
    from torchvision.datasets import Caltech256

    transform = transforms.Compose(
        [
            transforms.Grayscale(num_output_channels=3),
            transforms.Resize((16, 16)),
            transforms.ToTensor(),
        ]
    )
    create_dataloaders(
        transformTuple=(transform,),
        datasetClass=Caltech256,
        # datadirTuple: Tuple[str, str, str] = None,
    )
