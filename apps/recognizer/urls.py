from django.urls import path
from . import views

app_name = "recognizer"
urlpatterns = [
    path("", views.index, name="index"),
    path("csrf-token/", views.get_csrf_token, name="get_csrf_token"),
]
