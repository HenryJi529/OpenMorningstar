from django.contrib import admin
# https://django-import-export.readthedocs.io/en/latest/getting_started.html
from import_export import resources
from import_export.formats import base_formats
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin

from .models import Item

@admin.register(Item)
class ItemAdmin(ImportExportModelAdmin):
    list_display = ('id', 'url',)

