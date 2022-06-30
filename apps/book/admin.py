from django.contrib import admin
# https://django-import-export.readthedocs.io/en/latest/getting_started.html
from import_export import resources
from import_export.formats import base_formats
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin

from requests.utils import unquote

from .models import Book, Category, Author, Translator


@admin.register(Book)
class BookAdmin(ImportExportModelAdmin):
    list_display = ['book_name', '链接', 'category', 'author', 'translator']
    fields = ['book_name', 'category', 'author', 'translator', 'file', 'foreign_url']

    def 链接(self, obj):
        return unquote(obj.foreign_url if obj.foreign_url else obj.file.url)


@admin.register(Category)
class CategoryAdmin(ImportExportModelAdmin):
    pass


@admin.register(Author)
class AuthorAdmin(ImportExportModelAdmin):
    pass


@admin.register(Translator)
class TranslatorAdmin(ImportExportModelAdmin):
    pass
