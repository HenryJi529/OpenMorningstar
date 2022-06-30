from django.urls import path
from Morningstar.settings.common import CACHE_TIMEOUT
from django.views.decorators.cache import cache_page
from . import views


app_name = 'share'
urlpatterns = [
    path('', cache_page(CACHE_TIMEOUT)(views.index), name='index'),
    path('route/<int:id>/', cache_page(CACHE_TIMEOUT)(views.route), name='route'),
    path('submit/', cache_page(CACHE_TIMEOUT)(views.submit), name='submit'),
]