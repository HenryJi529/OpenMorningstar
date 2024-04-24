from django.contrib import admin

# https://django-import-export.readthedocs.io/en/latest/getting_started.html
from import_export import resources
from import_export.formats import base_formats
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin

from .models import Photo, Text


@admin.register(Photo)
class PhotoAdmin(ImportExportModelAdmin):
    formats = (base_formats.CSV, base_formats.XLS)
    list_display = ["id", "title", "链接", "created"]
    search_fields = ["title"]


@admin.register(Text)
class TextAdmin(ImportExportModelAdmin):
    formats = (base_formats.CSV, base_formats.JSON)
    list_display = ["id", "title", "摘要", "created"]
    search_fields = ["title", "body"]

    def 摘要(self, obj: Text):
        return obj.body[:20]
