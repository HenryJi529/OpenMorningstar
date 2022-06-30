from django.urls import path
from Morningstar.settings.common import CACHE_TIMEOUT
from django.views.decorators.cache import cache_page
from . import views


app_name = 'lover'
urlpatterns = [
    path('', views.index, name='index'),
    path('show/', views.show, name='show'),
    path('api/',views.api, name='api'),
    path('origin/', views.origin, name="origin")
]
