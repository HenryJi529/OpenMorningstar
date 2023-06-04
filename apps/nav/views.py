from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import os
import json
from Morningstar.settings.common import MEDIA_ROOT

JSON_FILE = os.path.join(MEDIA_ROOT, "nav/data.json")


def __get_data(json_file):
    with open(json_file) as f:
        data = dict(json.load(f))
    return data


def index(request):
    data = __get_data(JSON_FILE)
    categories = data["categories"]
    if not request.user.is_superuser:
        for category in categories:
            if category.get("level") == "admin":
                categories.remove(category)
    return render(request, "nav/index.html", context={"categories": categories})
