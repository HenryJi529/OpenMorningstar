import colorama

def better_print(var):
    print(colorama.Fore.YELLOW + colorama.Style.BRIGHT +
        str(var) + colorama.Style.RESET_ALL)