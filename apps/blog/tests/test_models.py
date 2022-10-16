from django.test import TestCase
from django.apps import apps
from django.urls import reverse

from Morningstar.models import User

from ..models import Category, Post, Tag, Comment


class PostModelTestCase(TestCase):
    def setUp(self):
        # 断开 haystack 的 signal，测试生成的文章无需生成索引
        apps.get_app_config('haystack').signal_processor.teardown()
        user = User.objects.create_superuser(username='admin', email='admin@hellogithub.com', password='admin')
        cate = Category.objects.create(name='测试')
        self.post = Post.objects.create(title='测试标题', body='测试内容', category=cate)

    def test_str_representation(self):
        self.assertEqual(self.post.__str__(), self.post.title)

    def test_auto_populate_modified_time(self):
        self.assertIsNotNone(self.post.updated)

        old_post_updated = self.post.updated
        self.post.body = "新的测试内容"*30
        self.post.save()
        self.post.refresh_from_db()
        self.assertTrue(self.post.updated > old_post_updated)

    def test_auto_populate_excerpt(self):
        self.assertIsNotNone(self.post.excerpt)
        self.assertTrue(0 < len(self.post.excerpt) <= 120)

    def test_get_absolute_url(self):
        expected_url = reverse('blog:detail', kwargs={'pk': self.post.pk})
        self.assertEqual(self.post.get_absolute_url(), expected_url)

    def test_increase_views(self):
        self.post.increase_views()
        self.post.refresh_from_db()
        self.assertEqual(self.post.views, 1)

        self.post.increase_views()
        self.post.refresh_from_db()
        self.assertEqual(self.post.views, 2)


class TagModelTestCase(TestCase):
    def setUp(self):
        self.tag = Tag.objects.create(name='测试')

    def test_str_representation(self):
        self.assertEqual(self.tag.__str__(), self.tag.name)


class CommentDataTestCase(TestCase):
    def setUp(self):
        apps.get_app_config('haystack').signal_processor.teardown()
        self.user = User.objects.create_superuser(username='admin', email='admin@morningstar529.com', password='admin')
        self.cate = Category.objects.create(name='测试')
        self.post = Post.objects.create(title='测试标题',body='测试内容',category=self.cate)


class CommentModelTestCase(CommentDataTestCase):
    def setUp(self):
        super().setUp()
        self.comment = Comment.objects.create(user=self.user, body='评论内容', post=self.post)

    def test_str_representation(self):
        self.assertEqual(self.comment.__str__(), f'{self.user.username}: {self.comment.body}')
