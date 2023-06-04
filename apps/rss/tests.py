from django.test import TestCase
from django.urls import reverse
from django.test import Client


class ViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_index(self):
        response = self.client.get(reverse("rss:index"))
        self.assertContains(response, "RSS源列表")

    def test_xml(self):
        response = self.client.get(reverse("rss:get_xml", args=[1]))
        self.assertContains(
            response, '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">'
        )
