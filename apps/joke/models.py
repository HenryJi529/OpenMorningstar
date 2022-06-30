from django.db import models
from django.utils.timezone import now


class Photo(models.Model):
    image = models.ImageField(
        "本站托管图片", upload_to='photo/%Y%m%d%H%M%S/', blank=True)
    foreignUrl = models.URLField("外部图片链接", blank=True, unique=True)
    created = models.DateTimeField("添加时间", auto_now_add=True)

    def __str__(self):
        return self.image.name

    class Meta:
        verbose_name = "照片"
        verbose_name_plural = verbose_name
        ordering = ('-created',)
