import colorama


def colored_format(var):
    formatted_output = (
        colorama.Fore.YELLOW
        + colorama.Style.BRIGHT
        + str(var)
        + colorama.Style.RESET_ALL
    )
    return formatted_output
