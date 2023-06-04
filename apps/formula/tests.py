from django.test import TestCase
from django.urls import reverse
from django.test import Client


class ViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_index(self):
        response = self.client.get(reverse("formula:index"))
        self.assertContains(response, "LaTex公式转换")
