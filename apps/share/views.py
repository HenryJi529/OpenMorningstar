import os
import io

from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.urls import reverse
from django_redis import get_redis_connection

from django.middleware.csrf import get_token

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status

from Morningstar.lib import qrcoder
from Morningstar.settings.common import BASE_DIR

from .models import Item


def get_csrf_token(request):
    if request.method == "GET":
        csrf_token = get_token(request)
        return JsonResponse({"csrfToken": csrf_token})


@api_view(["GET"])
def route(request, id):
    try:
        url = Item.objects.get(id=id).url
        return Response({"status": "ok", "url": url})
    except Item.DoesNotExist:
        return Response({"status": "error", "message": "此链接不存在"})


def get_qrcode(request):
    session_key = request.session._session_key
    conn = get_redis_connection("default")
    link = conn.get(f"{session_key}-share-qrcode")
    back_color = (255, 255, 255)
    center_color = (250, 200, 100)
    edge_color = (75, 150, 60)
    icon_path = os.path.join(
        BASE_DIR, "Morningstar", "static", "base", "img", "logo.png"
    )
    qrcode_image = qrcoder.make_qrcode(
        data=link,
        image_size=(200, 200),
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
def submit(request):
    if request.method == "POST":
        item = Item(url=request.data["url"])
        item.save()
        id = item.id
        link = f"redirect/{id}/"
        session_key = request.session._session_key
        conn = get_redis_connection("default")
        conn.set(
            f"{session_key}-share-qrcode",
            "https://morningstar369.com/share/" + link,
            ex=60 * 10,
        )
        return Response({"link": link})
