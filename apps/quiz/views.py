from django.shortcuts import render
from django.http import JsonResponse


def api(request):
    return JsonResponse({"status": "200"})
