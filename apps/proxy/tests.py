import base64

from django.test import TestCase
from django.urls import reverse
from django.test import Client


class ViewTestCase(TestCase):
    def test_config(self):
        response = self.client.get(reverse("proxy:config"))
        self.assertEqual(response.status_code, 302)
