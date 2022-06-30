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
import os
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve
from django.views.generic.base import TemplateView
from Morningstar import settings
from django.views.decorators.cache import cache_page
from .views import registry, shortcut, views
from django.contrib.sitemaps.views import sitemap
from .sitemaps import NavSitemap, BlogSitemap
sitemaps = {
    "blog": BlogSitemap,
    "nav": NavSitemap,
}


urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login, name="login"),
    path('logout/', views.logout, name="logout"),
    path('activate/', views.activate, name="activate"),
    path('send-sms/', views.send_sms, name="send_sms"),
    path('get-image-captcha/',views.get_image_captcha, name="get_image_captcha"),
    path('change-password/',views.change_password,name='change_password'),
    path('registry/', registry.registry, name="registry"),
    path('shortcut/<slug:name>/', shortcut.shortcut, name="shortcut"),
    path("credits/", views.credits, name="credits"),
    path("favicon.ico", views.get_favicon, name="favicon"),
    path("qrcode/", views.get_qrcode, name="qrcode"),
    path("robots.txt", TemplateView.as_view(template_name="base/robots.txt", content_type="text/plain"),
    ),
    
    # app   
    path('blog/', include('blog.urls')),
    path('book/', include('book.urls')),
    path('joke/', include('joke.urls')),
    path('lover/', include('lover.urls')),
    path('nav/', include('nav.urls')),
    path('poll/', include('poll.urls')),
    path('sanguosha/', include('sanguosha.urls')),
    path('tool/', include('tool.urls')),
    path('v2ray/', include('v2ray.urls')),

    # 其他
    re_path(r"media/(?P<path>.*)$", serve,
            {"document_root": settings.common.MEDIA_ROOT}),
    path('api-auth/', include('rest_framework.urls')),  # restful api
    path('__debug__/', include('debug_toolbar.urls')),
    path('sitemap.xml', cache_page(60*5)(sitemap), {'sitemaps': sitemaps},
        name='django.contrib.sitemaps.views.sitemap'),
    path('admin/', admin.site.urls, name="admin"),

]
