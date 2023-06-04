from django.contrib import admin

# https://django-import-export.readthedocs.io/en/latest/getting_started.html
from import_export import resources
from import_export.formats import base_formats
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin
from .models import Choice, Question


class ChoiceInline(admin.TabularInline):
    # class ChoiceInline(admin.StackedInline):
    model = Choice
    extra = 3


@admin.register(Question)
class QuestionAdmin(ImportExportModelAdmin):
    fieldsets = [
        (None, {"fields": ["question_text"]}),
        ("Date information", {"fields": ["pub_date"], "classes": ["collapse"]}),
    ]
    inlines = [ChoiceInline]
    list_filter = ["pub_date"]
    search_fields = ["question_text"]
    list_display = (
        "question_text",
        "pub_date",
        "was_published_recently",
    )


@admin.register(Choice)
class ChoiceAdmin(ImportExportModelAdmin):
    pass
