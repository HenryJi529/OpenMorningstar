from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.decorators import login_required
import json
from Morningstar.settings.common import MEDIA_ROOT

JSON_FILE = MEDIA_ROOT / "nav/data.json"


def __get_data(json_file):
    with open(json_file) as f:
        data = dict(json.load(f))
    return data


def index(request: HttpRequest):
    data = __get_data(JSON_FILE)
    categories: list[dict] = data["categories"]
    if not request.user.is_superuser:
        for category in categories:
            if category.get("level") == "admin":
                categories.remove(category)
    return render(request, "nav/index.html", context={"categories": categories})
