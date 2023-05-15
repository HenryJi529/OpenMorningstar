import base64

from django.http import HttpResponse
from django.shortcuts import render, redirect

from .lib import Ghelper
from .models import Node

URLs = [
    "https://077f1d06.ghelper.me/rss/c8437795ee07bc13760da36dbebdde29",  # JP@gmail
    "https://c4713355.ghelper.me/rss/a07e635c094dd62df8426eee7bb36c71",  # JP@outlook
]


def index(request):
    links = [node.link for node in Node.objects.all()]
    for url in URLs:
        id = URLs.index(url)
        links.extend(Ghelper(url=url, id=id).links)
    links_bytes = "\n".join(links).encode("utf-8")
    data_bytes = base64.b64encode(links_bytes)
    data = data_bytes.decode("utf-8")
    return HttpResponse(data)


def config(request):
    return redirect(
        "https://cdn.jsdelivr.net/gh/HenryJi529/Shadowrocket-ADBlock-Rules@master/sr_banlist.conf"
    )
