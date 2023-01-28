import base64

from django.http import HttpResponse
from django.shortcuts import render, redirect

from .lib import Ghelper
from .models import Node

GHELPER_API = "https://ghelper.me/rss/"

URLs = [
    GHELPER_API + "9714f7c1e4741f547c37d4b0e13d580b", # JP
    GHELPER_API + "2b1e0f931b6e95ef7314e3c756360e0e", # CMH
]

def index(request):
    links = [node.link for node in Node.objects.all()]
    for url in URLs:
        id = URLs.index(url)
        links.extend(Ghelper(url=url,id=id).links)
    links_bytes = "\n".join(links).encode('utf-8')
    data_bytes = base64.b64encode(links_bytes)
    data = data_bytes.decode('utf-8')
    return HttpResponse(data)


def config(request):
    return redirect("https://cdn.jsdelivr.net/gh/HenryJi529/Shadowrocket-ADBlock-Rules@master/sr_banlist.conf")
