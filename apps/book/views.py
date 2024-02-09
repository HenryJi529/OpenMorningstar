import json
import os

from django.http import HttpResponseRedirect, HttpResponse, JsonResponse, HttpRequest
from django.urls import reverse
from django.shortcuts import render
from django.views import View

from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from Morningstar.views.base import fix_fetched_post
from .models import Book
from .serializers import BookSerializer


class IndexView(View):
    def get(self, request):
        def get_endpoint(request):
            protocol = (
                "https://"
                if os.environ.get("DJANGO_SETTINGS_MODULE", "Morningstar.settings.dev")
                == "Morningstar.settings.production"
                else "http://"
            )
            endpoint = protocol + request.get_host() + reverse("book:api")
            return endpoint

        books = Book.objects.all()
        endpoint = get_endpoint(request)
        return render(request, "book/index.html", locals())

    def post(self, request: HttpRequest):
        request = fix_fetched_post(request)
        book = Book.objects.get(id=int(request.POST["bookId"]))
        return JsonResponse(
            {
                "status": "success",
                "book_name": book.book_name,
                "author": book.author.name,
                "uri": book.uri,
            }
        )


class BookListView(APIView):
    def get(self, request):
        book_serializers = BookSerializer(Book.objects.all(), many=True)
        return Response(book_serializers.data)
