import base64

from django.http import HttpResponse, HttpRequest
from django.shortcuts import render, redirect

from .lib import Ghelper
from .models import Node, SubscribeUrl, Account


def index(request: HttpRequest):
    if request.GET.get("token") not in [
        account.token for account in Account.objects.all()
    ]:
        return HttpResponse("You Need A Token...")
    links = [node.link for node in Node.objects.all()]
    for ind, subscribeUrl in enumerate(SubscribeUrl.objects.all()):
        url = subscribeUrl.link
        links.extend(Ghelper(url=url, id=ind).links)
    links_bytes = "\n".join(links).encode("utf-8")
    data_bytes = base64.b64encode(links_bytes)
    data = data_bytes.decode("utf-8")
    return HttpResponse(data)


def config(request):
    return redirect(
        "https://cdn.jsdelivr.net/gh/HenryJi529/Shadowrocket-ADBlock-Rules@master/sr_banlist.conf"
    )
