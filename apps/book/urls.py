from django.urls import path
from Morningstar.settings.common import CACHE_TIMEOUT
from django.views.decorators.cache import cache_page

from . import views


app_name = 'book'
urlpatterns = [
    path('', cache_page(CACHE_TIMEOUT)(views.IndexView.as_view()), name="index"),
    path('api/', cache_page(CACHE_TIMEOUT)(views.BookListView.as_view()), name="api"),
]
