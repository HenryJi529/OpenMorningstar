from django.shortcuts import render


def info(request):
    return render(request, "base/dev/info.html")

def map(request):
    return render(request, "base/dev/map.html")