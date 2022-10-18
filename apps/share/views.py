import os

from django.shortcuts import render, HttpResponse, redirect
from django.urls import reverse

from .models import Item
from .forms import ItemForm

def index(request):
    return render(request, "share/index.html", locals())


def route(request, id):
    try:
        url = Item.objects.get(id=id).url
        return redirect(url)
    except Item.DoesNotExist:
        return HttpResponse("此短链接不存在...")


def submit(request):
    if request.method == 'POST':
        item_form = ItemForm(request.POST)
        if item_form.is_valid():
            item_form.save()
            success = True
            url = item_form.cleaned_data['url']
            items = Item.objects.filter(url=url)
            id = items.first().id
            protocol = "https://" if os.environ.get('DJANGO_SETTINGS_MODULE', 'Morningstar.settings.dev') == 'Morningstar.settings.production' else "http://"
            link = protocol + request.META["HTTP_HOST"] + reverse('share:route', args=[id])
        else:
            success = False
        return render(request, "share/result.html", locals())
