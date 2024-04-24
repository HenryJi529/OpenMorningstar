from django.shortcuts import render
from django.http import JsonResponse, HttpRequest


def api(request: HttpRequest):
    return JsonResponse({"status": "200"})
