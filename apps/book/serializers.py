from rest_framework import serializers

from .models import Book


class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name")
    author_name = serializers.CharField(source="author.name")
    translator_name = serializers.CharField(
        source="translator.name", allow_blank=True, allow_null=True
    )
    uri = serializers.ReadOnlyField()

    class Meta:
        model = Book
        fields = ("book_name", "category_name", "author_name", "translator_name", "uri")
