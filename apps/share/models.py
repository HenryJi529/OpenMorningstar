from django.db import models


class Item(models.Model):
    url = models.URLField("链接")
    created = models.DateTimeField("创建时间", auto_now_add=True)

    class Meta:
        verbose_name = '条目'
        verbose_name_plural = verbose_name
        ordering = ['-created']
        app_label = 'share'

    def __str__(self):
        return self.url

