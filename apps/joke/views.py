import random

from rest_framework.decorators import api_view
from rest_framework.response import Response

from Morningstar.lib.cors import add_cors_header
from .models import Photo, Text


@add_cors_header
@api_view(["GET"])
def getRandomJokes(request):
    if request.method == "GET":
        try:
            numRandomAll = int(request.GET.get("n", 20))
            if numRandomAll > 100:
                raise Exception("{n} is too large")
        except ValueError:
            return Response({"status": "error", "message": "{n} should be an integer"})
        except Exception as e:
            return Response({"status": "error", "message": str(e)})
        numPhoto = Photo.objects.count()
        numText = Text.objects.count()
        numRandomPhoto = int(numPhoto / (numPhoto + numText) * numRandomAll)
        numRandomText = numRandomAll - numRandomPhoto
        protocol = "https://" if request.is_secure() else "http://"
        photos = Photo.objects.order_by("?")[:numRandomPhoto]
        texts = Text.objects.order_by("?")[:numRandomText]
        objects = [
            {
                "type": "photo",
                "id": photo.pk,
                "title": photo.title,
                "link": protocol + request.META["HTTP_HOST"] + photo.uri,
            }
            for photo in photos
        ] + [
            {
                "type": "text",
                "id": text.pk,
                "title": text.title,
                "body": text.body,
            }
            for text in texts
        ]
        random.shuffle(objects)
        return Response({"status": "ok", "objects": objects})


@add_cors_header
@api_view(["GET"])
def getRandomImages(request):
    if request.method == "GET":
        try:
            num = int(request.GET.get("n", 1))
            if num > Photo.objects.count():
                raise Exception("{n} is to large")
        except ValueError:
            return Response({"status": "error", "message": "{n} should be an integer"})
        except Exception as e:
            return Response({"status": "error", "message": str(e)})
        photos = Photo.objects.order_by("?")[:num]
        protocol = "https://" if request.is_secure() else "http://"
        objects = [
            {
                "id": photo.pk,
                "link": protocol + request.META["HTTP_HOST"] + photo.uri,
            }
            for photo in photos
        ]
        return Response({"status": "ok", "objects": objects})


@add_cors_header
@api_view(["GET"])
def getRandomTexts(request):
    if request.method == "GET":
        try:
            num = int(request.GET.get("n", 1))
            if num > Text.objects.count():
                raise Exception("{n} is to large")
        except ValueError:
            return Response({"status": "error", "message": "{n} should be an integer"})
        except Exception as e:
            return Response({"status": "error", "message": str(e)})
        objects = [
            {"id": text.pk, "body": text.body}
            for text in Text.objects.order_by("?")[:num]
        ]
        return Response({"status": "ok", "objects": objects})
