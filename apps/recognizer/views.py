import io
import base64

from translate import Translator

from django.http import HttpRequest
from django.middleware.csrf import get_token

from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.request import Request

from PIL import Image

from .lib.model_handler import ModelhandlerLoader


@api_view(["post"])
def index(request: Request):
    imageDataURL = request.data["imageDataURL"]
    modelName = request.data["modelName"]
    imageDataBase64 = imageDataURL.split(",")[1]  # 获取逗号后的Base64编码数据
    imageDataBinuary = base64.b64decode(imageDataBase64)
    image = Image.open(io.BytesIO(imageDataBinuary))
    handler = ModelhandlerLoader.getModelHandler(modelName)
    result = handler.predict(image)
    return Response(
        {
            "category": Translator(to_lang="zh").translate(result["category"]),
            "score": round(result["score"], 3),
        },
        status=status.HTTP_200_OK,
    )


@api_view(["get"])
def get_csrf_token(request: Request):
    response = Response()
    response.set_cookie("csrftoken", get_token(request))
    return response
