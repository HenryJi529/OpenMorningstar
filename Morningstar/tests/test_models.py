from django.test import TestCase

from ..models import User


class UserTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="test", password="test")

    def test_str_representation(self):
        self.assertEqual(self.user.__str__(), "test")
