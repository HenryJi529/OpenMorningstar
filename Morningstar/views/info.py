import os
import io
from PIL import Image

from django.http import HttpResponse, HttpResponseRedirect, HttpRequest
from django.shortcuts import render

from Morningstar.settings.common import BASIC_STATICFILES_DIR

from ..lib import qrcoder


def me(request: HttpRequest):
    return HttpResponseRedirect("https://linktr.ee/Henry529")


def get_favicon(request: HttpRequest):
    image = Image.open(BASIC_STATICFILES_DIR / "base/img/favicon.ico")
    stream = io.BytesIO()
    image.save(stream, "ico")
    return HttpResponse(stream.getvalue(), "image/ico")


def get_qrcode(request: HttpRequest):
    url = "https://morningstar369.com/"
    back_color = (255, 255, 255)
    center_color = (255, 0, 255)
    edge_color = (75, 20, 147)
    icon_path = BASIC_STATICFILES_DIR / "base/img/logo.png"

    qrcode_image = qrcoder.make_qrcode(
        data=url,
        image_size=(400, 400),
        box_radius_ratio=0.5,
        icon_path=icon_path,
        back_color=back_color,
        center_color=center_color,
        edge_color=edge_color,
    )
    stream = io.BytesIO()
    qrcode_image.save(stream, "png")
    return HttpResponse(stream.getvalue(), "image/png")


def credits(request: HttpRequest):
    items = [
        {
            "name": "django",
            "license_url": "https://cdn.jsdelivr.net/gh/django/django/LICENSE",
            "homepage_url": "https://www.djangoproject.com/",
        },
        {
            "name": "django-jazzmin",
            "license_url": "https://cdn.jsdelivr.net/gh/farridav/django-jazzmin/LICENSE",
            "homepage_url": "https://github.com/farridav/django-jazzmin",
        },
        {
            "name": "multipass",
            "license_url": "https://cdn.jsdelivr.net/gh/canonical/multipass/COPYING.GPL.txt",
            "homepage_url": "https://multipass.run/",
        },
        {
            "name": "python-markdown",
            "license_url": "https://cdn.jsdelivr.net/gh/Python-Markdown/markdown/LICENSE.md",
            "homepage_url": "https://github.com/Python-Markdown/markdown",
        },
        {
            "name": "tailwindcss",
            "license_url": "https://cdn.jsdelivr.net/gh/tailwindlabs/tailwindcss/LICENSE",
            "homepage_url": "https://tailwindcss.com/",
        },
        {
            "name": "vercel",
            "license_url": "https://cdn.jsdelivr.net/gh/vercel/vercel/LICENSE",
            "homepage_url": "https://github.com/vercel/vercel",
        },
    ]
    return render(request, "base/credits.html", context={"items": items})
