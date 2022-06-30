import requests

from django.test import TestCase
from django.urls import reverse
from django.test import Client
from django.core.files.base import ContentFile, File

from ..models import Book, Category, Author, Translator


class ViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        Category.objects.create(name="category1")
        Author.objects.create(name="author1")
        Book.objects.create(
            book_name="book1",
            category=Category.objects.get(name="category1"), 
            author=Author.objects.get(name="author1"),
            file=ContentFile("It is a file",name="file1")
        )

    def test_get(self):
        response = self.client.get(reverse('book:index'))
        self.assertContains(response, "author1")

    def test_post(self):
        response = self.client.post(reverse('book:index'), {
            "bookId": 1,
        })
        self.assertNotContains(response, "author1")

    def test_api(self):
        response = self.client.get(reverse('book:api'))
        self.assertContains(response, "author1")

