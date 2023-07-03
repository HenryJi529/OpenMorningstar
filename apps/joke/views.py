import random

from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from Morningstar.lib.cors import add_cors_header
from .models import Photo, Text


def index(request):
    photo_list = [
        {"type": "photo", "content": content} for content in list(Photo.objects.all())
    ]
    text_list = [
        {"type": "text", "content": content} for content in list(Text.objects.all())
    ]
    try:
        joke_list = random.sample(photo_list + text_list, 20)
    except ValueError:
        joke_list = photo_list + text_list
        random.shuffle(joke_list)
    context = {"joke_list": joke_list}
    return render(request, "joke/index.html", context=context)


@api_view(["GET"])
def images(request):
    if request.method == "GET":
        num = request.GET.get("n", 1)
        try:
            photos = Photo.objects.order_by("?")[: int(num)]
            protocol = "https://" if request.is_secure() else "http://"
            objects = [
                {
                    "id": photo.pk,
                    "link": protocol + request.META["HTTP_HOST"] + photo.uri,
                }
                for photo in photos
            ]
            return Response({"status": "ok", "objects": objects})
        except:
            return Response({"status": "error", "message": "{n} should be an integer"})


@api_view(["GET"])
@add_cors_header
def texts(request):
    if request.method == "GET":
        num = request.GET.get("n", 1)
        try:
            objects = [
                {"id": text.pk, "body": text.body}
                for text in Text.objects.order_by("?")[: int(num)]
            ]
            return Response({"status": "ok", "objects": objects})
        except:
            return Response({"status": "error", "message": "{n} should be an integer"})
