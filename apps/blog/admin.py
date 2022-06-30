from django.contrib import admin
# https://django-import-export.readthedocs.io/en/latest/getting_started.html
from import_export import resources
from import_export.formats import base_formats
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin
from .models import Post, Category, Tag, Comment


@admin.register(Post)
class PostAdmin(ImportExportModelAdmin):
    list_display = ['title', 'category', 'created', 'updated', 'readtime']
    fields = ['title', 'body', 'category', 'tags', 'readtime']
    search_fields = ('title', 'category',)

    def save_model(self, request, obj, form, change):
        try:
            category = obj.category
        except:
            try:
                obj.category = Category.objects.get(name="draft")
            except:
                c = Category(name='draft')
                c.save()
                obj.category = Category.objects.get(name="draft")
        super().save_model(request, obj, form, change)


@admin.register(Comment)
class CommentAdmin(ImportExportModelAdmin):
    list_display = ['user', '摘要', 'thumbs_up', 'thumbs_down', 'created', 'updated']
    fields = ['user', 'body', 'post']

    def 摘要(self, obj):
        return obj.body[:20]


@admin.register(Category)
class CategoryAdmin(ImportExportModelAdmin):
    pass


@admin.register(Tag)
class TagAdmin(ImportExportModelAdmin):
    pass
