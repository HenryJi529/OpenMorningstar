from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.request import Request


@api_view(["get"])
def index(request: Request):
    return Response("123")
