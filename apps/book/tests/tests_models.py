import re

from django.test import TestCase
from django.core.files.base import ContentFile, File

from ..models import Book, Category, Author, Translator


class CategoryModelTestCase(TestCase):
    def setUp(self):
        Category.objects.create(name="category1")
        Category.objects.create(name="category2")

    def test_category_can_add(self):
        test1 = Category.objects.get(name="category1")
        test2 = Category.objects.get(name="category2")
        self.assertEqual(test1.name, "category1")
        self.assertEqual(test2.name, "category2")
        self.assertEqual(str(test1), "category1")
        self.assertEqual(str(test2), "category2")


class AuthorModelTestCase(TestCase):
    def setUp(self):
        Author.objects.create(name="author1")
        Author.objects.create(name="author2")

    def test_author_can_add(self):
        author1 = Author.objects.get(name="author1")
        author2 = Author.objects.get(name="author2")
        self.assertEqual(author1.name, "author1")
        self.assertEqual(author2.name, "author2")
        self.assertEqual(str(author1), "author1")
        self.assertEqual(str(author2), "author2")


class TranslatorModelTestCase(TestCase):
    def setUp(self):
        Translator.objects.create(name="translator1")
        Translator.objects.create(name="translator2")

    def test_translator_can_add(self):
        translator1 = Translator.objects.get(name="translator1")
        translator2 = Translator.objects.get(name="translator2")
        self.assertEqual(translator1.name, "translator1")
        self.assertEqual(translator2.name, "translator2")
        self.assertEqual(str(translator1), "translator1")
        self.assertEqual(str(translator2), "translator2")


class BookModelTestCase(TestCase):
    def setUp(self):
        Category.objects.create(name="category1")
        Author.objects.create(name="author1")
        Book.objects.create(
            book_name="book1",
            category=Category.objects.get(name="category1"),
            author=Author.objects.get(name="author1"),
            file=ContentFile("It is a file", name="file1"),
        )

    def test_book_can_add(self):
        book1 = Book.objects.get(book_name="book1")
        self.assertEqual(book1.book_name, "book1")
        self.assertEqual(str(book1), "book1")
        self.assertEqual(book1.category.name, "category1")
        self.assertEqual(book1.author.name, "author1")
        self.assertTrue("file1" in str(book1.file))
        self.assertTrue(re.match(r"\/media\/book\/[0-9]{14}\/file1", book1.uri))
