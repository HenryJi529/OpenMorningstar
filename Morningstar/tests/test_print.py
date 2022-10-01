from django.test import TestCase

from Morningstar.lib.print import better_print


class PrintTest(TestCase):
    def test_better_print(self):
        self.assertTrue('test' in better_print('test'))