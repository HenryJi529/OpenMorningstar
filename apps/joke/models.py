import markdown

from django.db import models
from django.utils.timezone import now


class Photo(models.Model):
    image = models.ImageField("本站托管图片", upload_to='joke/photo/%Y%m%d%H%M%S/', blank=True)
    foreign_url = models.URLField("外部图片链接", blank=True)
    title = models.CharField("标题", max_length=50, blank=True)
    description = models.CharField("描述", max_length=120, blank=True)
    created = models.DateTimeField("添加时间", auto_now_add=True)

    @property
    def uri(self):
        return self.foreign_url if self.foreign_url else self.image.url

    def __str__(self):
        return self.image.name

    class Meta:
        verbose_name = "照片"
        verbose_name_plural = verbose_name
        ordering = ('-created',)
        app_label = 'joke'


class Text(models.Model):
    body = models.TextField("正文")
    title = models.CharField("标题", max_length=50, blank=True)
    description = models.CharField("描述", max_length=120, blank=True)
    created = models.DateTimeField("添加时间", auto_now_add=True)

    @property
    def html(self):
        return markdown.markdown(self.body)

    def __str__(self):
        return self.body[:20]

    class Meta:
        verbose_name = "文本"
        verbose_name_plural = verbose_name
        ordering = ('-created',)
        app_label = 'joke'