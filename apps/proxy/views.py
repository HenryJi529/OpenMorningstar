import base64

from django.http import HttpResponse
from django.shortcuts import render, redirect

from .lib import Ghelper
from .models import Node


def index(request):
    links = [node.link for node in Node.objects.all()]
    links.extend(Ghelper().links)

    links_bytes = "\n".join(links).encode('utf-8')
    data_bytes = base64.b64encode(links_bytes)
    data = data_bytes.decode('utf-8')
    return HttpResponse(data)


def config(request):
    return redirect("https://cdn.jsdelivr.net/gh/HenryJi529/Shadowrocket-ADBlock-Rules@master/sr_banlist.conf")
