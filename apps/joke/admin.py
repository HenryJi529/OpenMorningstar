from django.contrib import admin
# https://django-import-export.readthedocs.io/en/latest/getting_started.html
from import_export import resources
from import_export.formats import base_formats
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin

from requests.utils import unquote

from .models import Photo, Text


@admin.register(Photo)
class PhotoAdmin(ImportExportModelAdmin):
    formats = (base_formats.CSV, base_formats.XLS)
    list_display = ['id', 'title', '链接']
    search_fields = ['foreign_url']

    def 链接(self, obj):
        return unquote(obj.foreign_url if obj.foreign_url else obj.image.url)


@admin.register(Text)
class TextAdmin(ImportExportModelAdmin):
    formats = (base_formats.CSV, base_formats.JSON)
    list_display = ['id', 'title', '摘要', 'created']
    search_fields = ['title', 'body']

    def 摘要(self, obj):
        return obj.body[:20]
