import os
import json

from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.core.mail import send_mail
from django.shortcuts import render, reverse
from django.views import View

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Book
from .serializers import BookSerializer

class IndexView(View):
    def get(self, request):
        def get_endpoint(request):
            protocol = "http://" if os.environ['DJANGO_SETTINGS_MODULE'] == 'Morningstar.settings.dev' else "https://"
            endpoint = protocol + request.META["HTTP_HOST"] + reverse("book:api")
            return endpoint
        books = Book.objects.all()
        endpoint = get_endpoint(request)
        return render(request, "book/index.html", locals())


class BookListView(APIView):
    def get(self, request):
        book_serializers = BookSerializer(Book.objects.all(), many=True)
        return Response(book_serializers.data)
