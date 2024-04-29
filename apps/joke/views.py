import random

from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from Morningstar.lib.cors import add_cors_header
from .models import Photo, Text
from .serializers import PhotoSerializer, TextSerializer


@add_cors_header
@api_view(["GET"])
def getRandomJokes(request: Request):
    def getRandomNums(num: int):
        photoNum = Photo.objects.count()
        textNum = Text.objects.count()
        randomPhotoNum = int(photoNum / (photoNum + textNum) * num)
        randomTextNum = num - randomPhotoNum
        return randomPhotoNum, randomTextNum

    if request.method == "GET":
        try:
            num = int(request.data.get("n", 20))
            if num > 100:
                return Response(
                    {"message": "{n} is too large"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except ValueError:
            return Response(
                {"message": "{n} should be an integer"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        randomPhotoNum, randomTextNum = getRandomNums(num)
        photos = Photo.objects.order_by("?")[:randomPhotoNum]
        texts = Text.objects.order_by("?")[:randomTextNum]
        data = (
            PhotoSerializer(photos, many=True).data
            + TextSerializer(texts, many=True).data
        )
        random.shuffle(data)
        return Response(data)


@add_cors_header
@api_view(["GET"])
def getRandomPhotos(request: Request):
    if request.method == "GET":
        try:
            num = int(request.data.get("n", 1))
            if num > Photo.objects.count():
                return Response({"message": "{n} is to large"})
        except ValueError:
            return Response(
                {"message": "{n} should be an integer"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        photos = Photo.objects.order_by("?")[:num]
        return Response(PhotoSerializer(photos, many=True).data)


@add_cors_header
@api_view(["GET"])
def getRandomTexts(request: Request):
    if request.method == "GET":
        try:
            num = int(request.data.get("n", 1))
            if num > Text.objects.count():
                return Response({"message": "{n} is to large"})
        except ValueError:
            return Response(
                {"message": "{n} should be an integer"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        texts = Text.objects.order_by("?")[:num]
        return Response(TextSerializer(texts, many=True).data)
