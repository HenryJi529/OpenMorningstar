from django.contrib import admin
# https://django-import-export.readthedocs.io/en/latest/getting_started.html
from import_export import resources
from import_export.formats import base_formats
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin, ImportMixin, ExportMixin, ImportExportActionModelAdmin
from .models import Photo


class PhotoResource(resources.ModelResource):
    image = Field(attribute='image', column_name='本站托管图片')
    foreignUrl = Field(attribute='foreignUrl', column_name='外部图片链接')

    class Meta:
        model = Photo
        fields = ('id', 'image', 'foreignUrl')
        export_order = ('id', 'image', 'foreignUrl')


@admin.register(Photo)
class PhotoAdmin(ImportExportModelAdmin):
    formats = (base_formats.CSV, base_formats.XLS)
    resource_class = PhotoResource
    list_display = ['pk', 'image', 'foreignUrl']
    search_fields = ['foreignUrl']
