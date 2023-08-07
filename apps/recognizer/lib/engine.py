from typing import Dict, List, Tuple
from tqdm.auto import tqdm

from sklearn.metrics import (
    accuracy_score,
    recall_score,
    precision_score,
    f1_score,
)
from torchmetrics import (
    Accuracy,
    Precision,
    Recall,
    F1Score,
    ConfusionMatrix,
)

import torch
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter

from utils import DEVICE


def train_step(
    model: torch.nn.Module,
    dataloader: DataLoader,
    loss_fn: torch.nn.Module,
    optimizer: torch.optim.Optimizer,
    epoch: int,
    device: torch.device = DEVICE,
) -> Tuple[float, Dict[str, float]]:
    """Trains a PyTorch model for a single epoch.

    Turns a target PyTorch model to training mode and then
    runs through all of the required training steps (forward
    pass, loss calculation, optimizer step).

    Args:
        model: A PyTorch model to be trained.
        dataloader: A DataLoader instance for the model to be trained on.
        loss_fn: A PyTorch loss function to minimize.
        optimizer: A PyTorch optimizer to help minimize the loss function.
        epoch: A number indicating which epoch is being trained.
        device: A target device to compute on (e.g. "cuda", "mps", "cpu").

    Returns:
        A tuple of training loss and training metrics.
        In the form (train_loss, train_metrics).
    """
    # Put model in train mode
    model.train()

    # Setup train loss and train metrics values
    train_loss, train_accuracy, train_recall, train_precision, train_f1_score = (
        0,
        0,
        0,
        0,
        0,
    )

    # Loop through data loader data batches
    for batch in tqdm(
        dataloader, total=len(dataloader), desc=f"Training(Epoch{epoch})", leave=False
    ):
        # Send data to target device
        X, y = batch
        X, y = X.to(device), y.to(device)

        # 1. Forward pass
        train_pred_logits = model(X)
        # 2. Calculate  and accumulate loss
        loss = loss_fn(train_pred_logits, y)
        train_loss += loss.item()
        # 3. Optimizer zero grad
        optimizer.zero_grad()
        # 4. Loss backward
        loss.backward()
        # 5. Optimizer step
        optimizer.step()

        # Calculate and accumulate accuracy metric across all batches
        train_pred_labels = torch.argmax(torch.softmax(train_pred_logits, dim=1), dim=1)
        # train_accuracy += (train_pred_label == y).sum().item() / len(train_pred_logits)
        train_accuracy += accuracy_score(y.cpu(), train_pred_labels.detach().cpu())
        train_recall += recall_score(
            y.cpu(), train_pred_labels.detach().cpu(), average="macro", zero_division=1
        )
        train_precision += precision_score(
            y.cpu(), train_pred_labels.detach().cpu(), average="macro", zero_division=1
        )
        train_f1_score += f1_score(
            y.cpu(), train_pred_labels.detach().cpu(), average="macro", zero_division=1
        )

    train_loss = train_loss / len(dataloader)
    train_accuracy = train_accuracy / len(dataloader)
    train_recall = train_recall / len(dataloader)
    train_precision = train_precision / len(dataloader)
    train_f1_score = train_f1_score / len(dataloader)

    return train_loss, {
        "train_accuracy": train_accuracy,
        "train_recall": train_recall,
        "train_precision": train_precision,
        "train_f1_score": train_f1_score,
    }


def val_step(
    model: torch.nn.Module,
    dataloader: DataLoader,
    loss_fn: torch.nn.Module,
    epoch: int,
    device: torch.device = DEVICE,
) -> Tuple[float, float]:
    """Validates a PyTorch model for a single epoch.

    Turns a target PyTorch model to "eval" mode and then performs
    a forward pass on a validation dataset.

    Args:
        model: A PyTorch model to be validated.
        dataloader: A DataLoader instance for the model to be validated on.
        loss_fn: A PyTorch loss function to calculate loss on the validation data.
        epoch: A number indicating which epoch is being trained.
        device: A target device to compute on (e.g. "cuda", "mps", "cpu").

    Returns:
        A tuple of validation loss and validation metrics.
        In the form (val_loss, val_metrics).
    """
    # Put model in eval mode
    model.eval()

    # Setup val loss and val metrics values
    val_loss, val_accuracy, val_recall, val_precision, val_f1_score = 0, 0, 0, 0, 0

    # Turn on inference context manager
    with torch.inference_mode():
        # Loop through DataLoader batches
        for batch in tqdm(
            dataloader,
            total=len(dataloader),
            desc=f"Validating(Epoch{epoch})",
            leave=False,
        ):
            X, y = batch
            # Send data to target device
            X, y = X.to(device), y.to(device)

            # 1. Forward pass
            val_pred_logits = model(X)
            # 2. Calculate and accumulate loss
            loss = loss_fn(val_pred_logits, y)
            val_loss += loss.item()

            # Calculate and accumulate accuracy
            val_pred_labels = val_pred_logits.argmax(dim=1)
            # val_accuracy += (val_pred_labels == y).sum().item() / len(val_pred_labels)
            val_accuracy += accuracy_score(y.cpu(), val_pred_labels.detach().cpu())
            val_recall += recall_score(
                y.cpu(),
                val_pred_labels.detach().cpu(),
                average="macro",
                zero_division=1,
            )
            val_precision += precision_score(
                y.cpu(),
                val_pred_labels.detach().cpu(),
                average="macro",
                zero_division=1,
            )
            val_f1_score += f1_score(
                y.cpu(),
                val_pred_labels.detach().cpu(),
                average="macro",
                zero_division=1,
            )

    val_loss = val_loss / len(dataloader)
    val_accuracy = val_accuracy / len(dataloader)
    val_recall = val_recall / len(dataloader)
    val_precision = val_precision / len(dataloader)
    val_f1_score = val_f1_score / len(dataloader)
    return val_loss, {
        "val_accuracy": val_accuracy,
        "val_recall": val_recall,
        "val_precision": val_precision,
        "val_f1_score": val_f1_score,
    }


def train(
    model: torch.nn.Module,
    train_dataloader: DataLoader,
    val_dataloader: DataLoader,
    optimizer: torch.optim.Optimizer,
    loss_fn: torch.nn.Module,
    epochs: int,
    writer: SummaryWriter = None,
    device: torch.device = DEVICE,
    verbose: bool = False,
) -> Dict[str, List]:
    """Trains and Validates a PyTorch model.

    Passes a target PyTorch models through train_step() and val_step()
    functions for a number of epochs, training and validating the model
    in the same epoch loop.

    Calculates, prints and stores evaluation metrics throughout.

    Args:
        model: A PyTorch model to be trained and validated.
        train_dataloader: A DataLoader instance for the model to be trained on.
        val_dataloader: A DataLoader instance for the model to be validated on.
        optimizer: A PyTorch optimizer to help minimize the loss function.
        loss_fn: A PyTorch loss function to calculate loss on both datasets.
        epochs: An integer indicating how many epochs to train for.
        writer: A SummaryWriter instance to write training and validation metrics to.
        device: A target device to compute on (e.g. "cuda", "mps", "cpu").
        verbose: A boolean indicating whether to print training and validation metrics.

    Returns:
        A dictionary of training and validating loss as well as training and
        validating metrics. Each metric has a value in a list for
        each epoch.
        In the form:
                    {
                        train_loss: [...],
                        train_metrics: [...],
                        val_loss: [...],
                        val_metrics: [...]
                    }
    """
    # Create empty results dictionary
    results = {"train_loss": [], "train_metrics": [], "val_loss": [], "val_metrics": []}

    # Make sure model on target device
    model.to(device)

    # Loop through training and validating steps for a number of epochs
    for epoch in tqdm(range(epochs), desc=f"Total Epochs", leave=True):
        train_loss, train_metrics = train_step(
            model=model,
            dataloader=train_dataloader,
            loss_fn=loss_fn,
            optimizer=optimizer,
            epoch=epoch,
            device=device,  # NOTE: 实际上这个device是用来迁移数据的
        )
        val_loss, val_metrics = val_step(
            model=model,
            dataloader=val_dataloader,
            loss_fn=loss_fn,
            epoch=epoch,
            device=device,  # NOTE: 实际上这个device是用来迁移数据的
        )

        if verbose:
            print(f"Epoch {epoch+1}: ")
            print(
                f"    loss => train_loss: {train_loss:.4f} | val_loss: {val_loss:.4f}"
            )
            for metric in train_metrics:
                print(
                    f"    {metric} => train_{metric}: {train_metrics[metric]:.4f} | val_{metric}: {val_metrics[metric]:.4f}"
                )

        # Update results dictionary
        results["train_loss"].append(train_loss)
        results["train_metrics"].append(train_metrics)
        results["val_loss"].append(val_loss)
        results["val_metrics"].append(val_metrics)

        ### Experiment tracking ###
        if writer:
            # See SummaryWriter documentation
            writer.add_graph(
                model=model,
                input_to_model=torch.randn(
                    train_dataloader.batch_size,
                    3,
                    next(iter(train_dataloader))[0].shape[2],
                    next(iter(train_dataloader))[0].shape[3],
                ).to(device),
            )
            writer.add_scalars(
                main_tag="Loss",
                tag_scalar_dict={"train_loss": train_loss, "val_loss": val_loss},
                global_step=epoch,
            )
            writer.add_scalars(
                main_tag="Accuracy",
                tag_scalar_dict={
                    "train_accuracy": train_metrics["train_accuracy"],
                    "val_accuracy": val_metrics["val_accuracy"],
                },
                global_step=epoch,
            )
            writer.add_scalars(
                main_tag="Recall",
                tag_scalar_dict={
                    "train_recall": train_metrics["train_recall"],
                    "val_recall": val_metrics["val_recall"],
                },
                global_step=epoch,
            )
            writer.add_scalars(
                main_tag="Precision",
                tag_scalar_dict={
                    "train_precision": train_metrics["train_precision"],
                    "val_precision": val_metrics["val_precision"],
                },
                global_step=epoch,
            )
            writer.add_scalars(
                main_tag="F1Score",
                tag_scalar_dict={
                    "train_f1_score": train_metrics["train_f1_score"],
                    "val_f1_score": val_metrics["val_f1_score"],
                },
                global_step=epoch,
            )
            # Close the writer
            writer.close()

    # Return the filled results at the end of the epochs
    return results


def evaluate(
    model: torch.nn.Module,
    test_dataloader: DataLoader,
    categoriesNum: int,
    device: torch.device = DEVICE,
) -> Dict:
    """给出模型的最终评价(accuracy, recall, precision, f1_score, confusion_matrix)"""

    # Make sure model on target device
    model.to(device)

    # Put model in eval mode
    model.eval()

    with torch.device(device):
        # Setup Metrics
        metrics = [
            Accuracy(task="multiclass", num_classes=categoriesNum, average="macro"),
            Recall(task="multiclass", num_classes=categoriesNum, average="macro"),
            Precision(task="multiclass", num_classes=categoriesNum, average="macro"),
            F1Score(task="multiclass", num_classes=categoriesNum, average="macro"),
            ConfusionMatrix(task="multiclass", num_classes=categoriesNum),
        ]

    # Turn on inference context manager
    with torch.inference_mode():
        # Loop through DataLoader batches
        for batch in test_dataloader:
            X, y = batch
            # Send data to target device
            X, y = X.to(device), y.to(device)

            # Forward pass
            pred_logits = model(X)

            # Calculate and accumulate accuracy
            pred_labels = pred_logits.argmax(dim=1)
            for metric in metrics:
                metric(pred_labels, y)

    # Get accumulated metrics
    accuracy = metrics[0].compute().item()
    recall = metrics[1].compute().item()
    precision = metrics[2].compute().item()
    f1_score = metrics[3].compute().item()
    confusion_matrix = metrics[4].compute().cpu().numpy()

    # Reset metrics
    for metric in metrics:
        metric.reset()

    return {
        "accuracy": accuracy,
        "recall": recall,
        "precision": precision,
        "f1_score": f1_score,
        "confusion_matrix": confusion_matrix,
    }
