from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.core.mail import send_mail
from django.shortcuts import render, reverse
from Morningstar.settings.common import MEDIA_ROOT
import os
import json
JSON_FILE =  os.path.join( MEDIA_ROOT, "book/data.json") 


def index(request):
    def get_data(json_file):
        with open(json_file) as f:
            data = dict(json.load(f))
        return data
    data = get_data(JSON_FILE)
    categories = data['categories']
    if os.environ['DJANGO_SETTINGS_MODULE'] == 'Morningstar.settings.dev':
        protocol = "http://"
    else:
        protocol = "https://"
    endpoint = protocol + request.META["HTTP_HOST"] + "/book/api/"
    return render(request, "book/index.html", locals())


def api(request):
    def get_data(json_file):
        with open(json_file) as f:
            data = dict(json.load(f))
        return data
    data = get_data(JSON_FILE)
    return JsonResponse(data)
