from django.urls import path

from . import views


app_name = 'lover'
urlpatterns = [
    path('', views.index, name='index'),
    path('show/', views.show, name='show'),
    path('api/',views.api, name='api'),
    path('origin/', views.origin, name="origin")
]
