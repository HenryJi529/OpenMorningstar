from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from blog.models import Post


class BlogSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.5

    def items(self):
        return Post.objects.all()

    def lastmod(self, obj):
        return obj.updated

    # 默认情况下，location() 调用每个对象的 get_absolute_url() 并返回结果。
    # def location(self, obj):
    #     return obj.get_absolute_url()


class LoverSitemap(Sitemap):
    priority = 1
    changefreq = "monthly"

    def items(self):
        return ["lover:index"]

    def location(self, item):
        return reverse(item)


class NavSitemap(Sitemap):
    priority = 1
    changefreq = "daily"

    def items(self):
        return ["nav:index"]

    def location(self, item):
        return reverse(item)


class RssSitemap(Sitemap):
    priority = 1
    changefreq = "daily"

    def items(self):
        return ["rss:index"]

    def location(self, item):
        return reverse(item)


Sitemaps = {
    "blog": BlogSitemap,
    "lover": LoverSitemap,
    "nav": NavSitemap,
    "rss": RssSitemap,
}
