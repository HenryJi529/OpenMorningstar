import random

from django.shortcuts import render, HttpResponse, redirect
from .models import Photo, Text


def index(request):
    photo_list = [ {"type": "photo", "content" : content} for content in list(Photo.objects.all())]
    text_list = [ {"type": "text", "content" : content} for content in list(Text.objects.all())]
    try:
        joke_list = random.sample(photo_list+text_list, 50)
    except ValueError:
        joke_list = photo_list + text_list
        random.shuffle(joke_list)
    context = {'joke_list': joke_list}
    return render(request, 'joke/index.html', context=context)

