from django.urls import path
from . import views


app_name = "share"
urlpatterns = [
    path("route/<int:id>/", views.route, name="route"),
    path("csrf-token/", views.get_csrf_token, name="get_csrf_token"),
    path("submit/", views.submit, name="submit"),
    path("qrcode/", views.get_qrcode, name="get_qrcode"),
]
