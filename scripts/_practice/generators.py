import os
import nbformat as nbf
import mdutils


NUM = 0

def ktx_to_dict(input_file, keyStarter='<', count=False):
    """ parsing keyed text to a python dictionary. """
    answer = dict()

    with open(input_file, 'r+', encoding='utf-8') as f:
        lines = f.readlines()

    k, val = '', ''
    for line in lines:
        if line.startswith(keyStarter):
            k = line.replace(keyStarter, '').strip()
            val = ''
        else:
            val += line
        if k:
            answer.update({k: val.strip()})

    if count:
        global NUM
        NUM = int(len(answer.keys())/3)

    return answer


def dict_to_ktx(input_dict, output_file, keyStarter='<'):
    """ Store a python dictionary to a keyed text"""
    with open(output_file, 'w+') as f:
        for k, val in input_dict.items():
            f.write(f'{keyStarter} {k}\n')
            f.write(f'{val}\n\n')


HEADERS = ktx_to_dict(os.path.join('source', 'headers.ktx'))
QHA = ktx_to_dict(os.path.join('source', 'content.ktx'),count=True)


def create_jupyter_notebook(destination_filename='exercises.ipynb'):
    """ Programmatically create jupyter notebook with the questions (and hints and solutions if required)
    saved under source files """

    # Create cells sequence
    nb = nbf.v4.new_notebook()

    nb['cells'] = []

    # - Add header:
    nb['cells'].append(nbf.v4.new_markdown_cell(HEADERS["header"]))
    nb['cells'].append(nbf.v4.new_markdown_cell(HEADERS["sub_header"]))
    nb['cells'].append(nbf.v4.new_markdown_cell(HEADERS["jupyter_instruction"]))

    # - Add initialization
    nb['cells'].append(nbf.v4.new_code_cell('%run initialize.py'))
    nb['cells'].append(nbf.v4.new_markdown_cell(HEADERS["describe_import_all"]))
    nb['cells'].append(nbf.v4.new_code_cell(HEADERS['import_all']))

    # - Add Test Data
    nb['cells'].append(nbf.v4.new_markdown_cell(HEADERS["describe_test_data"]))
    nb['cells'].append(nbf.v4.new_code_cell(HEADERS['add_test_data']))

    # - Add questions and empty spaces for answers
    for n in range(1, NUM+1):
        nb['cells'].append(nbf.v4.new_markdown_cell(f'#### {n}. ' + QHA[f'q{n}']))
        nb['cells'].append(nbf.v4.new_code_cell(""))

    # Delete file if one with the same name is found
    if os.path.exists(destination_filename):
        os.remove(destination_filename)

    # Write sequence to file
    nbf.write(nb, destination_filename)


def create_jupyter_notebook_random_question(destination_filename='exercises_random.ipynb'):
    """ Programmatically create jupyter notebook with the questions (and hints and solutions if required)
    saved under source files """

    # Create cells sequence
    nb = nbf.v4.new_notebook()

    nb['cells'] = []

    # - Add header:
    nb['cells'].append(nbf.v4.new_markdown_cell(HEADERS["header"]))
    nb['cells'].append(nbf.v4.new_markdown_cell(HEADERS["sub_header"]))
    nb['cells'].append(nbf.v4.new_markdown_cell(HEADERS["jupyter_instruction_rand"]))

    # - Add initialization
    nb['cells'].append(nbf.v4.new_code_cell('%run initialize.py'))
    nb['cells'].append(nbf.v4.new_markdown_cell(HEADERS["describe_import_all"]))
    nb['cells'].append(nbf.v4.new_code_cell(HEADERS['import_all']))

    # - Add Test Data
    nb['cells'].append(nbf.v4.new_markdown_cell(HEADERS["describe_test_data"]))
    nb['cells'].append(nbf.v4.new_code_cell(HEADERS['add_test_data']))

    # - Add Random Pick
    nb['cells'].append(nbf.v4.new_code_cell("pick()"))

    # Delete file if one with the same name is found
    if os.path.exists(destination_filename):
        os.remove(destination_filename)

    # Write sequence to file
    nbf.write(nb, destination_filename)


def create_markdown(destination_filename='exercises', with_hints=False, with_solutions=False):
    # Create file name
    if with_hints:
        destination_filename += '_with_hints'
    if with_solutions:
        destination_filename += '_with_solutions'

    # Initialise file
    markdownFile = mdutils.MdUtils(file_name=destination_filename)

    # Add headers
    markdownFile.write(HEADERS["header"] + '\n')
    markdownFile.write(HEADERS["sub_header"] + '\n')

    # Add import
    markdownFile.write(HEADERS["describe_import_all"] + '\n')
    markdownFile.insert_code(HEADERS["import_all"], language='python')
    markdownFile.write("\n\n")

    # Add Test Data
    markdownFile.write(HEADERS["describe_test_data"] + "\n")
    markdownFile.write("```python\n" + HEADERS["add_test_data"] + "\n```\n\n")

    # Add questions (and hint or answers if required)
    for n in range(1, NUM+1):
        markdownFile.new_header(title=f"{n}. {QHA[f'q{n}']}", level=4, add_table_of_contents="n")
        if with_hints:
            markdownFile.write(f"\n**{QHA[f'h{n}']}**")
        if with_solutions:
            markdownFile.insert_code(QHA[f'a{n}'], language='python')

    # Delete file if one with the same name is found
    if os.path.exists(destination_filename):
        os.remove(destination_filename)

    # Write sequence to file
    markdownFile.create_md_file()


if __name__ == '__main__':
    create_jupyter_notebook()
    create_jupyter_notebook_random_question()
    # create_markdown()
    # create_markdown(with_hints=False, with_solutions=True)
    # create_markdown(with_hints=True, with_solutions=False)
    create_markdown(with_hints=True, with_solutions=True)
