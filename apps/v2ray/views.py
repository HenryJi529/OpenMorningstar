from django.http import HttpResponse
from django.shortcuts import render, redirect
from Morningstar.settings.common import MEDIA_ROOT
import os
from . import main


def index(request):
    node_file = os.path.join(MEDIA_ROOT, "v2ray/data.json")
    secret = main.run(node_file)
    return HttpResponse(secret)


def config(request):
    return redirect("https://cdn.jsdelivr.net/gh/HenryJi529/Shadowrocket-ADBlock-Rules@master/sr_banlist.conf")
