"""
通用函数: 
create_jupyter_notebook()
create_markdown()
"""

import os
from functools import cached_property
from pathlib import Path

import nbformat as nbf
import mdutils


def ktx_to_dict(input_file, keyStarter="<"):
    """parsing keyed text to a python dictionary."""
    result = dict()

    with open(input_file, "r+", encoding="utf-8") as f:
        lines = f.readlines()

    k, val = "", ""
    for line in lines:
        if line.startswith(keyStarter):
            k = line.replace(keyStarter, "").strip()
            val = ""
        else:
            val += line
        if k:
            result.update({k: val.strip()})

    return result


class Parser:
    def __init__(self, category="python") -> None:
        self.category = category
        self.headerPath = os.path.join("source", f"{category}_headers.ktx")
        self.contentPath = Path("source") / f"{category}_content.ktx"

    @cached_property
    def headerDict(self):
        result = ktx_to_dict(self.headerPath)
        return result

    @cached_property
    def contentDict(self):
        result = ktx_to_dict(self.contentPath)
        return result

    @cached_property
    def itemNum(self):
        return len(self.contentDict) // 3


def create_jupyter_notebook(parser: Parser):
    """Programmatically create jupyter notebook with the questions (and hints and solutions if required)
    saved under source files"""
    HEADERS = parser.headerDict
    QHA = parser.contentDict
    NUM = parser.itemNum
    PATH = f"{parser.category}_exercises.ipynb"

    # Create cells sequence
    nb = nbf.v4.new_notebook()

    nb["cells"] = []

    # - Add header:
    nb["cells"].append(nbf.v4.new_markdown_cell(HEADERS["header"]))
    nb["cells"].append(nbf.v4.new_markdown_cell(HEADERS["sub_header"]))
    nb["cells"].append(nbf.v4.new_markdown_cell(HEADERS["jupyter_instruction"]))

    # - Add initialization
    nb["cells"].append(nbf.v4.new_code_cell("%run initialize.py --category python"))
    nb["cells"].append(nbf.v4.new_markdown_cell(HEADERS["describe_import_all"]))
    nb["cells"].append(nbf.v4.new_code_cell(HEADERS["import_all"]))

    # - Add Test Data
    nb["cells"].append(nbf.v4.new_markdown_cell(HEADERS["describe_test_data"]))
    nb["cells"].append(nbf.v4.new_code_cell(HEADERS["add_test_data"]))

    # - Add questions and empty spaces for answers
    for n in range(1, NUM + 1):
        nb["cells"].append(nbf.v4.new_markdown_cell(f"#### {n}. " + QHA[f"q{n}"]))
        nb["cells"].append(nbf.v4.new_code_cell(""))

    # Delete file if one with the same name is found
    if os.path.exists(PATH):
        os.remove(PATH)

    # Write sequence to file
    nbf.write(nb, PATH)


def create_markdown(
    parser: Parser,
    with_hints=False,
    with_solutions=False,
):
    HEADERS = parser.headerDict
    QHA = parser.contentDict
    NUM = parser.itemNum
    FILENAME = f"{parser.category}_exercises"

    # Create file name
    if with_hints:
        FILENAME += "_with_hints"
    if with_solutions:
        FILENAME += "_with_solutions"

    # Initialise file
    markdownFile = mdutils.MdUtils(file_name=FILENAME)

    # Add headers
    markdownFile.write(HEADERS["header"] + "\n")
    markdownFile.write(HEADERS["sub_header"] + "\n")

    # Add import
    markdownFile.write(HEADERS["describe_import_all"] + "\n")
    markdownFile.insert_code(HEADERS["import_all"], language="python")
    markdownFile.write("\n\n")

    # Add Test Data
    markdownFile.write(HEADERS["describe_test_data"] + "\n")
    markdownFile.write("```python\n" + HEADERS["add_test_data"] + "\n```\n\n")

    # Add questions (and hint or answers if required)
    for n in range(1, NUM + 1):
        markdownFile.new_header(
            title=f"{n}. {QHA[f'q{n}']}", level=4, add_table_of_contents="n"
        )
        if with_hints:
            markdownFile.write(f"\n**{QHA[f'h{n}']}**")
        if with_solutions:
            markdownFile.insert_code(QHA[f"a{n}"], language="python")

    # Delete file if one with the same name is found
    if os.path.exists(FILENAME):
        os.remove(FILENAME)

    # Write sequence to file
    markdownFile.create_md_file()


if __name__ == "__main__":
    parser = Parser("python")
    create_jupyter_notebook(parser=parser)
    create_markdown(parser=parser, with_hints=True, with_solutions=True)
