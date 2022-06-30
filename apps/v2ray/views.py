from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from Morningstar.settings.common import MEDIA_ROOT
import os
from . import main


def index(request):
    node_file = os.path.join(MEDIA_ROOT, "v2ray/data.json")
    secret = main.run(node_file)
    return HttpResponse(secret)
