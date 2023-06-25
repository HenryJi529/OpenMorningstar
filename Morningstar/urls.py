"""Morningstar URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.index, name='index')
Class-based views
    1. Add an import:  from other_app.views import Index
    2. Add a URL to urlpatterns:  path('', Index.as_view(), name='index')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve
from django.views.generic.base import TemplateView
from django.contrib.sitemaps.views import sitemap
from django.views.decorators.cache import cache_page

from Morningstar.settings.common import CACHE_TIMEOUT
from Morningstar.settings.common import MEDIA_ROOT


from .views import dev, info, shortcut, tool

from .sitemaps import Sitemaps


urlpatterns = [
    # 工具
    path("get-image-captcha/", tool.get_image_captcha, name="get_image_captcha"),
    path("activate-by-email/", tool.activate_by_email, name="activate_by_email"),
    path(
        "send-phone-code/<slug:template>/", tool.send_phone_code, name="send_phone_code"
    ),
    path(
        "send-email-code/<slug:template>/", tool.send_email_code, name="send_email_code"
    ),
    path(
        "get-login-token/<slug:identity>/", tool.get_login_token, name="get_login_token"
    ),
    path("login-by-token/<str:token>/", tool.login_by_token, name="login_by_token"),
    # 开发
    path("dev/info/", dev.info, name="dev-info"),
    path("dev/map/", dev.map, name="dev-map"),
    # 信息
    path("me/", cache_page(CACHE_TIMEOUT)(info.me), name="me"),
    path(
        "sitemap.xml",
        cache_page(CACHE_TIMEOUT)(sitemap),
        {"sitemaps": Sitemaps},
        name="sitemap",
    ),
    path("credits/", cache_page(CACHE_TIMEOUT)(info.credits), name="credits"),
    path("favicon.ico", cache_page(CACHE_TIMEOUT)(info.get_favicon), name="favicon"),
    path("qrcode/", cache_page(CACHE_TIMEOUT)(info.get_qrcode), name="qrcode"),
    path(
        "robots.txt",
        cache_page(CACHE_TIMEOUT)(
            TemplateView.as_view(
                template_name="base/robots.txt", content_type="text/plain"
            )
        ),
    ),
    # 应用
    path("", include("blog.urls")),
    path("book/", include("book.urls")),
    path("formula/", include("formula.urls")),
    path("game/", include("game.urls")),
    path("joke/", include("joke.urls")),
    path("lover/", include("lover.urls")),
    path("nav/", include("nav.urls")),
    path("api/notes/", include("notes.urls")),
    path("poll/", include("poll.urls")),
    path("proxy/", include("proxy.urls")),
    path("rss/", include("rss.urls")),
    path("share/", include("share.urls")),
    # 快捷
    path(
        "shortcut/<slug:name>/",
        cache_page(CACHE_TIMEOUT)(shortcut.shortcut),
        name="shortcut",
    ),
    # 调试
    path("debug/", include("debug_toolbar.urls")),
    # 媒体
    re_path(r"media/(?P<path>.*)$", serve, {"document_root": MEDIA_ROOT}),
    # 管理
    path("admin/", admin.site.urls, name="admin"),
    # restful api
    path("api-auth/", include("rest_framework.urls")),
]
