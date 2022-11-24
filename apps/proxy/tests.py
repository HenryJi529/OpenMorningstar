import base64

from django.test import TestCase
from django.urls import reverse
from django.test import Client


class ViewTestCase(TestCase):
    def test_index(self):
        response = self.client.get(reverse('proxy:index'))
        self.assertTrue("vmess://" in base64.b64decode(response.content).decode())

    def test_config(self):
        response = self.client.get(reverse('proxy:config'))
        self.assertEqual(response.status_code, 302)  
    