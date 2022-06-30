from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from blog.models import Post


class BlogSitemap(Sitemap):
    changefreq = "never"
    priority = 0.5

    def items(self):
        return Post.objects.all()

    def lastmod(self, obj):
        return obj.updated


class NavSitemap(Sitemap):
    priority = 1
    changefreq = 'daily'

    def items(self):
        return ['nav:index']

    def location(self, item):
        return reverse(item)
