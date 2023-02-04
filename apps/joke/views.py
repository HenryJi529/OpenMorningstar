import random

from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from .models import Photo, Text


def index(request):
    photo_list = [ {"type": "photo", "content" : content} for content in list(Photo.objects.all())]
    text_list = [ {"type": "text", "content" : content} for content in list(Text.objects.all())]
    try:
        joke_list = random.sample(photo_list+text_list, 20)
    except ValueError:
        joke_list = photo_list + text_list
        random.shuffle(joke_list)
    context = {'joke_list': joke_list}
    return render(request, 'joke/index.html', context=context)


def api(request):
    if request.method == 'GET':
        num = request.GET.get('n', 1)
        try:
            photos = Photo.objects.order_by('?')[:int(num)]
            protocol = "https://" if request.is_secure() else "http://"
            links = [ protocol + request.META["HTTP_HOST"] + photo.uri for photo in photos ]
            return JsonResponse({"status": "ok", "links": links})
        except:
            return JsonResponse({"status": "error", "links": [], "message": "{n} should be an integer"})
