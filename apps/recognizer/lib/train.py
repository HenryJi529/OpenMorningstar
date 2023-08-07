"""
Example running of train.py:
1. python train.py --model_name TinyVGG --image_size 64 --hidden_units_num 128 --epochs_num 5 --batch_size 32 --learning_rate 0.001 --dataset_name CIFAR10 --environment colab
2. python train.py --model_name NiceViTB16 --image_size 224 --hidden_units_num 128 --epochs_num 20 --batch_size 32 --learning_rate 0.001 --dataset_name Caltech256 --environment colab
"""

import argparse
import json
from pathlib import Path

import torch
from torchvision import datasets

import data_processor, engine, model_builder, utils
from utils import DEVICE


@utils.time
def main(args):
    # 设置随机种子
    if args.random_seed:
        print(f"设置随机种子为: {args.random_seed}")
        utils.set_seeds(args.random_seed)

    # 设置保存路径
    if args.environment == "local":
        base_dir = Path(".")
    else:
        base_dir = Path("./drive/MyDrive")

    # 设置数据集
    try:
        datasetClass = getattr(datasets, args.dataset_name)
    except Exception as e:
        raise ValueError("不支持的数据集")

    # 读取分类信息
    categories_path = (
        Path(__file__).parent / f"data/categories_{datasetClass.__name__}.json"
    )
    with open(categories_path, "r") as json_file:
        categories = json.load(json_file)

    # 设置模型
    if args.model_name == "TinyVGG":
        model = model_builder.TinyVGG(
            hidden_units_num=args.hidden_units_num,
            output_shape=len(categories),
            image_size=args.image_size,
        )
    elif args.model_name == "NiceViTB16":
        model = model_builder.NiceViTB16(
            hidden_units_num=args.hidden_units_num,
            output_shape=len(categories),
        )
        # NOTE: 由于原始模型上的设定，需要手动设置image_size
        args.image_size = model.origin_model.image_size  # NOTE: 原始模型上的设定
        print("[INFO] 由于ViT的设定，image_size固定为224...")
    else:
        raise ValueError("不支持的模型")

    # 获取模型对应的transforms
    transform, test_transform = model.transforms

    # 创建Dataloader
    (
        train_dataloader,
        val_dataloader,
        test_dataloader,
        categories,
    ) = data_processor.create_dataloaders(
        transformTuple=(transform, test_transform),
        datasetClass=datasetClass,
        pin_memory=False,
        batch_size=args.batch_size,
    )

    # Set loss and optimizer
    loss_fn = torch.nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=args.learning_rate)

    # Set default experiment name
    experiment_name = f"{type(model).__name__}_image{args.image_size}_hidden{args.hidden_units_num}_epochs{args.epochs_num}_batch{args.batch_size}_lr{args.learning_rate}_dataset{args.dataset_name}"

    # Set up a tensorboard writer
    writer = utils.create_writer(
        args.experiment_name if args.experiment_name else experiment_name,
        target_dir=base_dir / "runs",
    )

    # Start training with help from engine.py
    training_results = engine.train(
        model=model,
        train_dataloader=train_dataloader,
        val_dataloader=val_dataloader,
        loss_fn=loss_fn,
        optimizer=optimizer,
        epochs=args.epochs_num,
        writer=writer,
        device=DEVICE,
    )
    print(training_results)

    # Evaluate model
    evaluation_results = engine.evaluate(
        model,
        test_dataloader,
        len(categories),
    )

    # Hyperparameters to be saved
    hyperparameters = {
        "image_size": args.image_size,
        "hidden_units_num": args.hidden_units_num,
        "epochs_num": args.epochs_num,
        "batch_size": args.batch_size,
        "learning_rate": args.learning_rate,
        "dataset_name": args.dataset_name,
    }

    # Saving model
    utils.save_model(
        model=model,
        hyperparameters=hyperparameters,
        evaluation_results=evaluation_results,
        target_dir=base_dir / "models",
        model_filename=f"{experiment_name}.pth",
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train")
    parser.add_argument(
        "--model_name",
        choices=["TinyVGG", "NiceViTB16"],
        type=str,
        required=False,
        default="TinyVGG",
        help="选择模型(支持TinyVGG和NiceViTB16)",
    )
    parser.add_argument(
        "--image_size", required=False, type=int, default=64, help="设置image_size"
    )
    parser.add_argument(
        "--hidden_units_num",
        required=False,
        type=int,
        default=128,
        help="设置hidden_units_num",
    )
    parser.add_argument(
        "--epochs_num", required=False, type=int, default=5, help="设置epoch数量"
    )
    parser.add_argument(
        "--batch_size", required=False, type=int, default=32, help="设置batch_size"
    )
    parser.add_argument(
        "--learning_rate",
        required=False,
        type=float,
        default=0.001,
        help="设置learning_rate",
    )
    parser.add_argument(
        "--dataset_name",
        required=False,
        type=str,
        default="CIFAR10",
        help="选择dataset",
    )
    parser.add_argument(
        "--environment",
        choices=["local", "colab"],
        required=False,
        default="local",
        help="选择环境(支持local和colab)",
    )
    parser.add_argument(
        "--experiment_name",
        required=False,
        help="设置实验名称(用于tensorboard)",
    )
    parser.add_argument(
        "--random_seed",
        required=False,
        type=int,
        help="设置随机种子",
    )

    args = parser.parse_args()
    main(args)
