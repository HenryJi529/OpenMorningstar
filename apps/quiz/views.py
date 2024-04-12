import os
import json

from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from Morningstar.settings.common import MEDIA_ROOT

JSON_FILE = MEDIA_ROOT / "quiz/data.json"


def __get_data(json_file):
    with open(json_file) as f:
        data = dict(json.load(f))
    return data


@api_view(["GET"])
def quiz_list(request):
    data = __get_data(JSON_FILE)
    quizzes = data["quizzes"]
    limit = request.GET.get("limit", len(quizzes))

    try:
        limit = int(limit)
        return Response(quizzes[:limit])
    except ValueError:
        return Response(status=status.HTTP_404_NOT_FOUND)
