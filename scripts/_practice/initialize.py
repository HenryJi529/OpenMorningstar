import argparse

from generators import Parser


argParser = argparse.ArgumentParser(description="Parser Configuration")
argParser.add_argument("--category", type=str, help="Exercise Category")
args = argParser.parse_args()

parser = Parser(args.category)
QHA = parser.contentDict


def question(n):
    print(f"{n}. " + QHA[f"q{n}"])


def hint(n):
    print(QHA[f"h{n}"])


def answer(n):
    print(QHA[f"a{n}"])
