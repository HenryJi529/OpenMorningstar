from django.urls import path
from Morningstar.settings.common import CACHE_TIMEOUT
from django.views.decorators.cache import cache_page
from . import views


app_name = 'poll'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    #path('', views.index, name='index'),
    path('<int:pk>/', views.DetailView.as_view(), name='detail'),
    #path('<int:question_id>/', views.detail, name='detail'),
    path('<int:pk>/results/', views.ResultsView.as_view(), name='results'),
    #path('<int:question_id>/results/', views.results, name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
]
