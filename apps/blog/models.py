from django.db import models
from Morningstar.models import User
from django.utils import timezone
from django.urls import reverse
from django.utils.html import strip_tags
from django.utils.functional import cached_property
import markdown


def generate_rich_content(value):
    import re
    import markdown
    from django.utils.text import slugify
    from markdown.extensions.toc import TocExtension
    md = markdown.Markdown(
        extensions=[
            "markdown.extensions.extra",
            "markdown.extensions.codehilite",
            # 记得在顶部引入 TocExtension 和 slugify
            TocExtension(slugify=slugify),
        ]
    )
    content = md.convert(value)
    m = re.search(r'<div class="toc">\s*<ul>(.*)</ul>\s*</div>', md.toc, re.S)
    toc = m.group(1) if m is not None else ""
    return {"content": content, "toc": toc}


class Category(models.Model):
    """
    分类
    """
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = '分类'
        verbose_name_plural = verbose_name
        app_label = 'blog'

    def __str__(self):
        return self.name


class Tag(models.Model):
    """
    标签
    """
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = '标签'
        verbose_name_plural = verbose_name
        app_label = 'blog'

    def __str__(self):
        return self.name


class Post(models.Model):
    """
    文章
    """
    title = models.CharField('标题', max_length=50)
    body = models.TextField('正文')
    created = models.DateTimeField(
        '创建时间', auto_now_add=True)  # 比datetime增加时区处理
    updated = models.DateTimeField('修改时间', auto_now=True)
    excerpt = models.CharField('摘要', max_length=54, blank=True)
    category = models.ForeignKey(
        Category, verbose_name='分类', on_delete=models.CASCADE, blank=True)
    tags = models.ManyToManyField(Tag, verbose_name='标签', blank=True)
    views = models.PositiveIntegerField(default=0, editable=False)  # 不可修改！

    @property
    def toc(self):
        return self.rich_content.get("toc", "")

    @property
    def body_html(self):
        return self.rich_content.get("content", "")

    @cached_property
    def rich_content(self):
        return generate_rich_content(self.body)

    def increase_views(self):
        self.views += 1
        self.save(update_fields=['views'])

    def save(self, *args, **kwargs):
        md = markdown.Markdown(extensions=[
            'markdown.extensions.extra',
            'markdown.extensions.codehilite',
        ])
        self.excerpt = strip_tags(md.convert(self.body))[:54]  # 获取摘要
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = '文章'
        verbose_name_plural = verbose_name
        ordering = ['-updated', '-created', 'title']
        app_label = 'blog'

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('blog:detail', kwargs={'pk': self.pk})


class Comment(models.Model):
    name = models.CharField('昵称', max_length=50)
    email = models.EmailField('邮箱', blank=True)
    body = models.TextField('内容')
    created = models.DateTimeField('创建时间', auto_now_add=True)
    updated = models.DateTimeField('修改时间', auto_now=True)
    post = models.ForeignKey(
        Post, verbose_name='文章', on_delete=models.CASCADE)

    class Meta:
        verbose_name = '评论'
        verbose_name_plural = verbose_name
        ordering = ['-updated', '-created']
        app_label = 'blog'

    def __str__(self):
        return '{}: {}'.format(self.name, self.body[:20])

    @cached_property
    def rich_content(self):
        return generate_rich_content(self.body)

    @property
    def body_html(self):
        return self.rich_content.get("content", "")
