from django.urls import path
from . import views

app_name = "recognizer"
urlpatterns = [
    path("", views.index, name="index"),
]
