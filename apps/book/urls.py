from django.urls import path
import os
from django.views.decorators.cache import cache_page
from . import views


app_name = 'book'
urlpatterns = [
    path('', cache_page(60*5)(views.index), name="index"),
    path('api/', cache_page(60*5)(views.api), name="api"),
]
