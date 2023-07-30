import io
import base64

from translate import Translator

from django.http import JsonResponse
from django.middleware.csrf import get_token

from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.request import Request

from PIL import Image

from .lib.model_handler import ModelhandlerLoader, EfficientNetB2Handler


@api_view(["post"])
def index(request: Request):
    imageDataURL = request.data["imageDataURL"]
    image_data = imageDataURL.split(",")[1]  # 获取逗号后的Base64编码数据
    decoded_data = base64.b64decode(image_data)

    image = Image.open(io.BytesIO(decoded_data))
    handler = ModelhandlerLoader.getModelHandler(EfficientNetB2Handler)
    result = handler.predict(image)
    return Response(
        {
            "categoryName": Translator(to_lang="zh").translate(result["category_name"]),
            "score": round(result["score"], 3),
        },
        status=status.HTTP_200_OK,
    )


def get_csrf_token(request):
    if request.method == "GET":
        csrf_token = get_token(request)
        return JsonResponse({"csrfToken": csrf_token})
