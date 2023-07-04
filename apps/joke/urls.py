from django.urls import path
from Morningstar.settings.common import CACHE_TIMEOUT
from django.views.decorators.cache import cache_page
from . import views


app_name = "joke"
urlpatterns = [
    path("jokes/random", views.getRandomJokes, name="getRandomJokes"),
    path("images/random", views.getRandomImages, name="getRandomImages"),
    path("texts/random", views.getRandomTexts, name="getRandomTexts"),
]
