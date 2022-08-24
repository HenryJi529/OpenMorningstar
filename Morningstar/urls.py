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


from .views import info, registry, shortcut, tool, views

from .sitemaps import Sitemaps


urlpatterns = [
    # 样板
    path('spa/', cache_page(CACHE_TIMEOUT)(views.spa), name='spa'),
    # 工具
    path('get-image-captcha/',tool.get_image_captcha, name="get_image_captcha"),
    path('dev/', tool.dev, name="dev"),
    # 账号
    path('account/activate/', views.activate, name="activate"),
    path('account/send-sms/', views.send_sms, name="send_sms"),
    path('account/change-password/', views.change_password,name='change_password'),
    # 信息
    path('me/', cache_page(CACHE_TIMEOUT)(info.me), name="me"),
    path('sitemap.xml', cache_page(CACHE_TIMEOUT)(sitemap), {'sitemaps': Sitemaps},name='django.contrib.sitemaps.views.sitemap'),
    path("credits/", cache_page(CACHE_TIMEOUT)(info.credits), name="credits"),
    path("favicon.ico", cache_page(CACHE_TIMEOUT)(info.get_favicon), name="favicon"),
    path("qrcode/", cache_page(CACHE_TIMEOUT)(info.get_qrcode), name="qrcode"),
    path("robots.txt", cache_page(CACHE_TIMEOUT)(TemplateView.as_view(template_name="base/robots.txt", content_type="text/plain"))),
    # 应用
    path('', include('blog.urls')),
    path('book/', include('book.urls')),
    path('joke/', include('joke.urls')),
    path('lover/', include('lover.urls')),
    path('nav/', include('nav.urls')),
    path('poll/', include('poll.urls')),
    path('rss/', include('rss.urls')),
    path('v2ray/', include('v2ray.urls')),
    path('registry/', cache_page(CACHE_TIMEOUT)(registry.registry), name="registry"),
    # 快捷
    path('shortcut/<slug:name>/', cache_page(CACHE_TIMEOUT)(shortcut.shortcut), name="shortcut"),
    # 调试
    path('debug/', include('debug_toolbar.urls')),
    # 媒体
    re_path(r"media/(?P<path>.*)$", serve, {"document_root": MEDIA_ROOT}),
    # 管理
    path('admin/', admin.site.urls, name="admin"),
]
