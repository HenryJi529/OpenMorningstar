import json
import re
import requests
import os
import zipfile
import math
from pathlib import Path
from typing import TypeVar, Tuple, Dict, List, Union

from PIL import Image

from torch import Tensor
from torch.utils.data import Dataset
from torchvision import datasets, transforms
from torchvision.datasets.vision import VisionDataset
from torch.utils.data import DataLoader
from torch.utils.data import random_split


BATCH_SIZE = 32


# Make function to find classes in target directory
def find_classes(directory: str) -> Tuple[List[str], Dict[str, int]]:
    """Finds the class folder names in a target directory.

    Assumes target directory is in standard image classification format.

    Args:
        directory (str): target directory to load classnames from.

    Returns:
        Tuple[List[str], Dict[str, int]]: (list_of_class_names, dict(class_name: idx...))

    Example:
        find_classes("food_images/train")
        >>> (["class_1", "class_2"], {"class_1": 0, ...})
    """
    # 1. Get the class names by scanning the target directory
    classes = sorted(entry.name for entry in os.scandir(directory) if entry.is_dir())

    # 2. Raise an error if class names not found
    if not classes:
        raise FileNotFoundError(f"Couldn't find any classes in {directory}.")

    # 3. Crearte a dictionary of index labels (computers prefer numerical rather than string labels)
    class_to_idx = {cls_name: i for i, cls_name in enumerate(classes)}
    return classes, class_to_idx


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


def download_image_dataset(
    source: str, destination: str, remove_source: bool = True
) -> Path:
    """Downloads a zipped dataset from source and unzips to destination.

    Args:
        source (str): A link to a zipped file containing data.
        destination (str): A target directory to unzip data to.
        remove_source (bool): Whether to remove the source after downloading and extracting.

    Returns:
        pathlib.Path to downloaded data.

    Example usage:
        download_data(
                        source="https://github.com/mrdbourke/pytorch-deep-learning/raw/main/data/pizza_steak_sushi.zip",
                        destination="pizza_steak_sushi"
                    )
    """
    # Setup path to data folder
    data_path = Path("data/")
    image_path = data_path / destination

    # If the image folder doesn't exist, download it and prepare it...
    if image_path.is_dir():
        print(f"[INFO] {image_path} directory exists, skipping download.")
    else:
        print(f"[INFO] Did not find {image_path} directory, creating one...")
        image_path.mkdir(parents=True, exist_ok=True)

        # Download pizza, steak, sushi data
        target_file = Path(source).name
        with open(data_path / target_file, "wb") as f:
            request = requests.get(source)
            print(f"[INFO] Downloading {target_file} from {source}...")
            f.write(request.content)

        # Unzip pizza, steak, sushi data
        with zipfile.ZipFile(data_path / target_file, "r") as zip_ref:
            print(f"[INFO] Unzipping {target_file} data...")
            zip_ref.extractall(image_path)

        # Remove .zip file
        if remove_source:
            os.remove(data_path / target_file)

    return image_path


class CustomImageFolder(Dataset):
    def __init__(self, root, transforms=None, target_transforms=None):
        super().__init__()
        self.paths = list(Path(root).glob("*/*.jpg"))
        self.classes, self.class_to_idx = find_classes(root)

        self.transforms = transforms
        self.target_transforms = target_transforms

    def load_image(self, index: int) -> Image.Image:
        "Open an image via a path and returns it."
        image_path = self.paths[index]
        image = Image.open(image_path)
        return image

    def __len__(self) -> int:
        return len(self.paths)

    def __getitem__(self, index: int) -> Tuple[Tensor, int]:
        """Return one sample of data, data and label(X,y)"""
        image = self.load_image(index)
        class_name = self.paths[index].parent.name
        class_idx = self.class_to_idx[class_name]
        if self.transforms:
            image = self.transforms(image)
        if self.target_transforms:
            class_idx = self.target_transforms(class_idx)
        return image, class_idx


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
