from django.urls import path
from Morningstar.settings.common import CACHE_TIMEOUT
from django.views.decorators.cache import cache_page
from . import views

app_name = "quiz"
urlpatterns = [
    path("", cache_page(CACHE_TIMEOUT)(views.api), name="api"),
]
