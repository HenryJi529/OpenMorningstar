import base64

from django.test import TestCase
from django.urls import reverse
from django.test import Client


class ViewTestCase(TestCase):
    def test_index(self):
        response = self.client.get(reverse('v2ray:index'))
        node_config = base64.b64decode(response.content).decode()
        self.assertTrue("vmess://" in node_config)

    def test_config(self):
        response = self.client.get(reverse('v2ray:config'))
        self.assertEqual(response.status_code, 302)  
    