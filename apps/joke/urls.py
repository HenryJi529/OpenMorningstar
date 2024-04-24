from django.urls import path
from Morningstar.settings.common import CACHE_TIMEOUT
from django.views.decorators.cache import cache_page
from . import views


app_name = "joke"
urlpatterns = [
    path("jokes/", views.getRandomJokes, name="getRandomJokes"),
    path("photos/", views.getRandomPhotos, name="getRandomPhotos"),
    path("texts/", views.getRandomTexts, name="getRandomTexts"),
]
