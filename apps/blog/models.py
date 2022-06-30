from django.db import models
from Morningstar.models import User
from django.utils import timezone
from django.urls import reverse
from django.utils.html import strip_tags
from django.utils.functional import cached_property
import markdown
import readtime

from Morningstar.models import User


MARKDOWN_EXTENSIONS = [
    'markdown.extensions.toc',  # 目录
    'pymdownx.betterem',  # 处理强调
    'pymdownx.caret',  # 提供<ins>和<sup>标签
    'pymdownx.highlight',  # 高亮代码(标记语言)
    "pymdownx.superfences",  # 处理代码块
    'pymdownx.arithmatex',  # 数学公式
]

MARKDOWN_EXTENSION_CONFIGS = {
    'pymdownx.highlight':{
        'guess_lang': True,
        'css_class': 'highlight',
        'use_pygments': False,
    },
    'pymdownx.arithmatex':{
        'generic': True,
    }
}

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
    created = models.DateTimeField('创建时间', auto_now_add=True)  # 比datetime增加时区处理
    updated = models.DateTimeField('修改时间', auto_now=True)
    excerpt = models.CharField('摘要', max_length=120, blank=True)
    category = models.ForeignKey(Category, verbose_name='分类', on_delete=models.CASCADE, blank=True)
    tags = models.ManyToManyField(Tag, verbose_name='标签', blank=True)
    readtime = models.IntegerField('阅读时间', default=0, null=True)
    views = models.PositiveIntegerField(default=0, editable=False)  # 不可修改！

    @property
    def toc(self):
        return self.rich_content.get("toc", "")

    @property
    def html(self):
        return self.rich_content.get("content", "")

    @cached_property
    def rich_content(self):
        md = markdown.Markdown(
            extensions=MARKDOWN_EXTENSIONS,
            extension_configs=MARKDOWN_EXTENSION_CONFIGS,
        )
        content = md.convert(self.body)
        toc = md.toc
        return {"content": content, "toc": toc}

    def increase_views(self):
        self.views += 1
        self.save(update_fields=['views'])

    def save(self, *args, **kwargs):
        md = markdown.Markdown(
            extensions=MARKDOWN_EXTENSIONS,
            extension_configs=MARKDOWN_EXTENSION_CONFIGS,
        )
        self.excerpt = strip_tags(md.convert(self.body))[:120]  # 获取摘要
        self.readtime = self.readtime if self.readtime else int(readtime.of_markdown(self.body, wpm=200).seconds/60)  # 设置默认值
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
    user = models.ForeignKey(User, verbose_name="用户", on_delete=models.SET_NULL, null=True)
    body = models.TextField('内容')
    created = models.DateTimeField('创建时间', auto_now_add=True)
    updated = models.DateTimeField('修改时间', auto_now=True)
    post = models.ForeignKey(Post, verbose_name='文章', on_delete=models.CASCADE)
    thumbs_up = models.ManyToManyField(User, related_name='thumbsUp_user', verbose_name="点赞")
    thumbs_down = models.ManyToManyField(User, related_name='thumbsDown_user', verbose_name="点踩")

    class Meta:
        verbose_name = '评论'
        verbose_name_plural = verbose_name
        ordering = ['-updated', '-created']
        app_label = 'blog'

    @property
    def html(self):
        md = markdown.Markdown(
            extensions=MARKDOWN_EXTENSIONS,
            extension_configs=MARKDOWN_EXTENSION_CONFIGS,
        )
        return md.convert(self.body)

    def __str__(self):
        return '{}: {}'.format(self.user.username, self.body[:20])
