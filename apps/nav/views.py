from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import os
import json
from Morningstar.settings.common import MEDIA_ROOT
JSON_FILE = os.path.join(MEDIA_ROOT, "nav/data.json")


def me(request):
    return HttpResponseRedirect("https://linktr.ee/Henry529")


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


def resource(request, name):
    data = __get_data(JSON_FILE)
    resource_pages = data["resource_pages"]
    for resource_page in resource_pages:
        if name == resource_page["name"]:
            title = resource_page["title"]
            items = resource_page["items"]
            return render(request, "nav/resource.html", context={
                "title": title,
                "items": items,
                })

    return HttpResponse("？？？没这个资源")
