import os
import io

from django.shortcuts import render, HttpResponse, redirect
from django.urls import reverse
from django_redis import get_redis_connection

from Morningstar.lib import qrcoder
from Morningstar.settings.common import BASE_DIR

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


def get_qrcode(request):
    session_key = request.session._session_key
    conn = get_redis_connection("default")
    link = conn.get(f'{session_key}-share-qrcode')
    back_color=(255, 255, 255)
    center_color=(250, 200, 100)
    edge_color=(75, 150, 60)
    icon_path=os.path.join(BASE_DIR, "Morningstar", "static", "base", "img", "logo.png")
    qrcode_image = qrcoder.make_qrcode(data=link, image_size=(400, 400), box_radius_ratio=0.5, icon_path=icon_path, back_color=back_color, center_color=center_color, edge_color=edge_color)
    stream = io.BytesIO()
    qrcode_image.save(stream, 'png')
    return HttpResponse(stream.getvalue(),"image/png")


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
            session_key = request.session._session_key
            conn = get_redis_connection("default")
            conn.set(f'{session_key}-share-qrcode', link, ex=60*10)
            image_url = reverse('share:qrcode')
        else:
            success = False
        return render(request, "share/result.html", locals())
