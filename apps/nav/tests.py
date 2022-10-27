from django.test import TestCase
from django.urls import reverse
from django.test import Client

from Morningstar.models import User

class ViewTestCase(TestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser(username='admin', email='admin@morningstar.com', password='admin')
        self.client = Client()

    def test_index_normal(self):
        response = self.client.get(reverse('nav:index'))
        self.assertContains(response, "晨星导航")

    def test_index_admin(self):
        self.client._login(self.superuser)
        response = self.client.get(reverse('nav:index'))
        self.assertContains(response, "项目管理")
        self.assertContains(response, "UserName")