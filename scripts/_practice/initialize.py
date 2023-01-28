import numpy as np

from generators import NUM, QHA


def question(n):
    print(f'{n}. ' + QHA[f'q{n}'])


def hint(n):
    print(QHA[f'h{n}'])


def answer(n):
    print(QHA[f'a{n}'])


def pick():
    n = np.random.randint(1, NUM+1)
    question(n)
