def add_cors_header(func):
    def wrapper(request, *args, **kwargs):
        response = func(request, *args, **kwargs)
        response['Access-Control-Allow-Origin'] = '*'
        return response

    return wrapper