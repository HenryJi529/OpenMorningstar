from django.shortcuts import render, HttpResponse, reverse

from .lib import get_data, get_sources_num, get_title_from_index

def index(request):
    items = []
    for index in range(get_sources_num()):
        items.append({
            'title': get_title_from_index(index),
            'link': reverse("rss:get_xml", kwargs={'pk': index})
        })
    return render(request, "rss/index.html", locals())


def get_xml(request, pk):
    (title, link, description, language, items, lastBuildDate) = get_data(pk)
    return render(request, "rss/base.xml",locals(), content_type='text/xml')
