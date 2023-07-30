"""
Example running of train.py:
    python train.py --image_length 64 --hidden_units_num 128 --epochs_num 5 --batch_size 32 --learning_rate 0.001 --dataset_id 0
"""

import argparse

import torch
import torchvision

import data_processor, engine, model_builder, utils
from utils import time, set_seeds, DEVICE

set_seeds(42)


@time
def main(args):
    # Setup hyperparameters
    HIDDEN_UNITS_NUM = args.hidden_units_num
    IMAGE_LENGTH = args.image_length
    EPOCHS_NUM = args.epochs_num
    BATCH_SIZE = args.batch_size
    LEARNING_RATE = args.learning_rate
    DATASET_ID = args.dataset_id

    if DATASET_ID == 0:
        datasetClass = torchvision.datasets.CIFAR10
    else:
        datasetClass = torchvision.datasets.Caltech256

    transform, test_transform = data_processor.create_transforms(IMAGE_LENGTH)

    (
        train_dataloader,
        val_dataloader,
        _,
        categories,
    ) = data_processor.create_dataloaders(
        transformTuple=(transform, test_transform),
        datasetClass=datasetClass,
        pin_memory=False,
        batch_size=BATCH_SIZE,
    )

    model = model_builder.TinyVGG(
        input_shape=3,
        hidden_units_num=HIDDEN_UNITS_NUM,
        output_shape=len(categories),
        image_length=next(iter(train_dataloader))[0][0].shape[1],
    )

    # Set loss and optimizer
    loss_fn = torch.nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE)

    # Start training with help from engine.py
    results = engine.train(
        model=model,
        train_dataloader=train_dataloader,
        val_dataloader=val_dataloader,
        loss_fn=loss_fn,
        optimizer=optimizer,
        epochs=EPOCHS_NUM,
        device=DEVICE,
    )

    print(results["train_loss"])
    print(results["train_acc"])
    print(results["val_loss"])
    print(results["val_acc"])

    utils.save_model(
        model=model,
        target_dir="params",
        model_name=f"{type(model).__name__}_image{IMAGE_LENGTH}_hidden{HIDDEN_UNITS_NUM}_epochs{EPOCHS_NUM}_batch{BATCH_SIZE}_lr{LEARNING_RATE}_dataset{DATASET_ID}.pth",
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train")
    parser.add_argument(
        "--image_length", required=False, type=int, default=64, help="设置image_length"
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
        "--dataset_id",
        required=False,
        type=int,
        default=0,
        help="选择dataset",
    )
    args = parser.parse_args()
    main(args)
