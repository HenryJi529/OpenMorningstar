import ast

from django.test import TestCase
from django.urls import reverse
from django.test import Client


class ViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_index(self):
        response = self.client.get(reverse('lover:index'))
        self.assertContains(response, "谨以此页献给我的爱人FQL~")

    def test_show(self):
        response = self.client.get(reverse('lover:show'))
        self.assertTrue(response.status_code, 200)

    def test_api(self):
        response = self.client.get(reverse('lover:api'))
        self.assertEqual(ast.literal_eval(response.content.decode())["status"], "success")

    def test_origin(self):
        response = self.client.get(reverse('lover:origin'))
        self.assertTrue(response.status_code, 302)
