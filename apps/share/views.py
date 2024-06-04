import os
import io

from django.shortcuts import render
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.urls import reverse
from django_redis import get_redis_connection

from django.middleware.csrf import get_token

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status

from Morningstar.lib import qrcoder
from Morningstar.settings.common import BASIC_STATICFILES_DIR

from .models import Item


@api_view(["GET"])
def get_csrf_token(request: HttpRequest):
    response = Response()
    response.set_cookie("csrftoken", get_token(request))
    return response


@api_view(["GET"])
def route(request: HttpRequest, id):
    try:
        url = Item.objects.get(id=id).url
        return Response({"url": url}, status=status.HTTP_200_OK)
    except Item.DoesNotExist:
        return Response(
            {"message": "此链接不存在"},
            status=status.HTTP_404_NOT_FOUND,
        )


def get_qrcode(request: HttpRequest):
    link = request.session.get("share-qrcode")
    back_color = (255, 255, 255)
    center_color = (250, 200, 100)
    edge_color = (75, 150, 60)
    icon_path = BASIC_STATICFILES_DIR / "base/img/logo.png"

    qrcode_image = qrcoder.make_qrcode(
        data=link,
        image_size=(400, 400),
        box_radius_ratio=0.5,
        icon_path=icon_path,
        back_color=back_color,
        center_color=center_color,
        edge_color=edge_color,
    )
    stream = io.BytesIO()
    qrcode_image.save(stream, "png")
    return HttpResponse(stream.getvalue(), "image/png")


@api_view(["POST"])
def submit(request: HttpRequest):
    if request.method == "POST":
        item = Item(url=request.data["url"])
        item.save()
        id = item.id
        link = f"redirect/{id}/"
        request.session["share-qrcode"] = "https://morningstar369.com/share/" + link
        return Response({"link": link})
