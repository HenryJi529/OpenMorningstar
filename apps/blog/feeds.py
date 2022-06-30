from django.contrib.syndication.views import Feed

from .models import Post


class AllPostsRssFeed(Feed):
    # 显示在聚合阅读器上的标题
    title = "Morningstar Blog"

    # 通过聚合阅读器跳转到网站的地址
    link = "/blog/"

    # 显示在聚合阅读器上的描述信息
    description = "Morningstar Blog全部文章"

    # 需要显示的内容条目
    def items(self):
        return Post.objects.all()

    # 聚合器中显示的内容条目的标题
    def item_title(self, item):
        return "[%s] %s" % (item.category, item.title)

    # 聚合器中显示的内容条目的链接
    def item_link(self, item):
        return item.get_absolute_url()

    # 聚合器中显示的内容条目的访问数
    def item_views(self, item):
        return item.views

    # 聚合器中显示的内容条目的更新时间
    def item_pubdate(self, item):
        return item.updated

    # 聚合器中显示的内容条目的分类
    def item_category(self, item):
        return item.category.name

    # 聚合器中显示的内容条目的描述
    def item_description(self, item):
        return item.body_html
