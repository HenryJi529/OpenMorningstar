from django.urls import path

from . import views


app_name = 'sanguosha'
urlpatterns = [
    path('', views.index, name='index'),
]