from django.shortcuts import render
from django.urls import reverse
from django.http import HttpRequest

from .lib import get_data, get_sources_num, get_title_from_index, get_link_from_index


def index(request: HttpRequest):
    items = [
        {
            "title": get_title_from_index(index),
            "link": get_link_from_index(index),
            "rss": reverse("rss:get_xml", kwargs={"pk": index + 1}),
        }
        for index in range(get_sources_num())
    ]
    return render(request, "rss/index.html", {"items": items})


def get_xml(request, pk):
    (title, link, description, language, items, lastBuildDate) = get_data(pk - 1)
    return render(
        request,
        "rss/base.xml",
        {
            "title": title,
            "link": link,
            "description": description,
            "language": language,
            "items": items,
            "lastBuildDate": lastBuildDate,
        },
        content_type="text/xml",
    )
