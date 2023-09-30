"""
https://tool.oschina.net/encrypt?type=3
"""
from django.db import models

from Morningstar.models import User


class Node(models.Model):
    name = models.CharField("名称", max_length=64, unique=True)
    link = models.TextField("配置链接")  # NOTE: TextField不可使用unique=True
    updated = models.DateTimeField("更新时间", auto_now=True)

    class Meta:
        verbose_name = "节点"
        verbose_name_plural = verbose_name
        ordering = ["-updated"]
        app_label = "proxy"

    def __str__(self):
        return self.name


class SubscribeUrl(models.Model):
    name = models.CharField("名称", max_length=64, unique=True)
    link = models.TextField("订阅链接")
    updated = models.DateTimeField("更新时间", auto_now=True)

    class Meta:
        verbose_name = "订阅"
        verbose_name_plural = verbose_name
        ordering = ["-updated"]
        app_label = "proxy"

    def __str__(self):
        return self.name


class Account(models.Model):
    user = models.ForeignKey(User, verbose_name="用户", on_delete=models.CASCADE)
    token = models.CharField("令牌", max_length=64, unique=True, blank=True)
    updated = models.DateTimeField("更新时间", auto_now=True)

    class Meta:
        verbose_name = "账户"
        verbose_name_plural = verbose_name
        ordering = ["-updated"]
        app_label = "proxy"

    def __str__(self):
        return self.user.username
