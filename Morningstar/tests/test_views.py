import requests

from django.urls import reverse
from django.test import TestCase
from django.test import Client


class ShortCutViewTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_redirect(self):
        SLUGS = [
            "issue",
            "auto",
            "src",
            "host",
            "vercel",
            "domain",
            "namecheap",
            "license",
            "task",
            "wechatpp",
            "qiniu",
            "lanzou",
            "gist",
            "sgs",
            "cook",
            "news",
        ]
        for slug in SLUGS:
            response = self.client.get(reverse("shortcut", args=[slug]))
            self.assertEqual(response.status_code, 302)

        response = self.client.get(reverse("shortcut", args=["foobar"]))
        self.assertContains(response, "404")
