from django.urls import path
from Morningstar.settings.common import CACHE_TIMEOUT
from django.views.decorators.cache import cache_page
from . import views

app_name = "rss"
urlpatterns = [
    path("", cache_page(CACHE_TIMEOUT)(views.index), name="index"),
    path("<int:pk>/", cache_page(CACHE_TIMEOUT)(views.get_xml), name="get_xml"),
]
