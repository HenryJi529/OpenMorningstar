from django.urls import path
from Morningstar.settings.common import CACHE_TIMEOUT
from django.views.decorators.cache import cache_page
from django.views.generic.base import TemplateView

from . import views

app_name = "notes"
urlpatterns = [path("", views.api, name="api")]
