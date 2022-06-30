from django.urls import path

from . import views

app_name = 'v2ray'
urlpatterns = [
    path('', views.index, name='index'),
]
