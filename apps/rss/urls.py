from django.urls import path
from . import views

app_name = 'rss'
urlpatterns = [
    path('',views.index, name='index'),
    path('<int:pk>/', views.get_xml, name='get_xml'),
]