from django.test import TestCase
from django.apps import apps
from Morningstar.models import User
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta

from ..models import Category, Post, Tag, Comment
from ..feeds import AllPostsRssFeed

from .test_models import CommentDataTestCase


class BlogDataTestCase(TestCase):
    def setUp(self):
        apps.get_app_config("haystack").signal_processor.teardown()
        # User
        self.user = User.objects.create_superuser(
            username="admin",
            email="admin@morningstar.com",
            password="admin",
        )
        # 分类
        self.cate1 = Category.objects.create(name="测试分类一")
        self.cate2 = Category.objects.create(name="测试分类二")
        # 标签
        self.tag1 = Tag.objects.create(name="测试标签一")
        self.tag2 = Tag.objects.create(name="测试标签二")
        # 文章
        self.post1 = Post.objects.create(
            title="测试标题一",
            body="测试内容一",
            category=self.cate1,
        )
        self.post1.tags.add(self.tag1)
        self.post1.save()

        self.post2 = Post.objects.create(
            title="测试标题二",
            body="测试内容二",
            category=self.cate2,
            created=timezone.now() - timedelta(days=100),
        )


class IndexViewTestCase(BlogDataTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse("blog:index")

    def test_without_any_post(self):
        Post.objects.all().delete()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed("blog/index.html")
        self.assertContains(response, "暂时还没有发布的文章！")

    def test_with_posts(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed("blog/index.html")
        self.assertContains(response, self.post1.title)
        self.assertContains(response, self.post2.title)
        self.assertIn("post_list", response.context)
        self.assertIn("is_paginated", response.context)
        self.assertIn("page_obj", response.context)

        expected_qs = Post.objects.all().order_by("-created")
        self.assertEqual(list(expected_qs), list(response.context["post_list"]))


class ArchiveViewTestCase(BlogDataTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse(
            "blog:archive",
            kwargs={
                "year": self.post1.created.year,
                "month": self.post1.created.month,
            },
        )

    def test_without_any_post(self):
        Post.objects.all().delete()

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed("blog/index.html")
        self.assertContains(response, "暂时还没有发布的文章！")

    def test_with_posts(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed("blog/index.html")
        self.assertContains(response, self.post1.title)
        self.assertIn("post_list", response.context)
        self.assertIn("is_paginated", response.context)
        self.assertIn("page_obj", response.context)
        now = timezone.now()
        expected_qs = Post.objects.filter(
            created__year=now.year, created__month=now.month
        )
        self.assertEqual(list(expected_qs), list(response.context["post_list"]))


class CategoryViewTestCase(BlogDataTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse("blog:category", kwargs={"pk": self.cate1.pk})
        self.url2 = reverse("blog:category", kwargs={"pk": self.cate2.pk})

    def test_visit_a_nonexistent_category(self):
        url = reverse("blog:category", kwargs={"pk": 100})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_without_any_post(self):
        Post.objects.all().delete()
        response = self.client.get(self.url2)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed("blog/index.html")
        self.assertContains(response, "暂时还没有发布的文章！")

    def test_with_posts(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed("blog/index.html")
        self.assertContains(response, self.post1.title)
        self.assertIn("post_list", response.context)
        self.assertIn("is_paginated", response.context)
        self.assertIn("page_obj", response.context)
        self.assertEqual(response.context["post_list"].count(), 1)
        expected_qs = self.cate1.post_set.all()
        self.assertEqual(list(expected_qs), list(response.context["post_list"]))


class TagViewTestCase(BlogDataTestCase):
    def setUp(self):
        super().setUp()
        self.url1 = reverse("blog:tag", kwargs={"pk": self.tag1.pk})
        self.url2 = reverse("blog:tag", kwargs={"pk": self.tag2.pk})

    def test_visit_a_nonexistent_tag(self):
        url = reverse("blog:tag", kwargs={"pk": 100})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_without_any_post(self):
        response = self.client.get(self.url2)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed("blog/index.html")
        self.assertContains(response, "暂时还没有发布的文章！")

    def test_with_posts(self):
        response = self.client.get(self.url1)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed("blog/index.html")
        self.assertContains(response, self.post1.title)
        self.assertIn("post_list", response.context)
        self.assertIn("is_paginated", response.context)
        self.assertIn("page_obj", response.context)

        self.assertEqual(response.context["post_list"].count(), 1)
        expected_qs = self.tag1.post_set.all()
        self.assertEqual(list(expected_qs), list(response.context["post_list"]))


class PostDetailViewTestCase(BlogDataTestCase):
    def setUp(self):
        super().setUp()
        self.md_post = Post.objects.create(
            title="Markdown 测试标题",
            body="# 标题",
            category=self.cate1,
        )
        self.url = reverse("blog:detail", kwargs={"pk": self.md_post.pk})

    def test_good_view(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed("blog/detail.html")
        self.assertContains(response, self.md_post.title)
        self.assertIn("post", response.context)

    def test_visit_a_nonexistent_post(self):
        url = reverse("blog:detail", kwargs={"pk": 100})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_increase_views(self):
        self.client.get(self.url)
        self.md_post.refresh_from_db()
        self.assertEqual(self.md_post.views, 1)

        self.client.get(self.url)
        self.md_post.refresh_from_db()
        self.assertEqual(self.md_post.views, 2)

    def test_markdownify_post_body_and_set_toc(self):
        response = self.client.get(self.url)
        self.assertContains(response, "目录")
        self.assertContains(response, self.md_post.title)

        post_template_var = response.context["post"]
        self.assertHTMLEqual(post_template_var.html, '<h1 id="_1">标题</h1>')
        self.assertTrue('<li><a href="#_1">标题</a></li>' in post_template_var.toc)


class RSSTestCase(BlogDataTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse("blog:feed")

    def test_rss_subscription_content(self):
        response = self.client.get(self.url)
        self.assertContains(response, AllPostsRssFeed.title)
        self.assertContains(response, AllPostsRssFeed.description)
        self.assertContains(response, self.post1.title)
        self.assertContains(response, self.post2.title)
        self.assertContains(
            response, "[%s] %s" % (self.post1.category, self.post1.title)
        )
        self.assertContains(
            response, "[%s] %s" % (self.post2.category, self.post2.title)
        )
        self.assertContains(response, self.post1.body)
        self.assertContains(response, self.post2.body)


class CommentViewTestCase(CommentDataTestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse("blog:comment", kwargs={"post_pk": self.post.pk})

    def test_invalid_comment_data(self):
        invalid_data = {
            "email": "invalid_email",
        }
        response = self.client.post(self.url, invalid_data)
        self.assertTemplateUsed(response, "blog/comment_preview.html")
        self.assertIn("post", response.context)
        self.assertIn("form", response.context)
        form = response.context["form"]
        for field_name, errors in form.errors.items():
            for err in errors:
                self.assertContains(response, err)
        self.assertContains(response, "评论发表失败！")
