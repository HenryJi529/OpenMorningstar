from rest_framework import serializers

from .models import Photo, Text


class PhotoSerializer(serializers.ModelSerializer):
    type = serializers.CharField(default="photo")

    class Meta:
        model = Photo
        fields = ["type", "title", "link"]


class TextSerializer(serializers.ModelSerializer):
    type = serializers.CharField(default="text")

    class Meta:
        model = Text
        fields = ["type", "title", "body"]
