from django.db import models
from django.contrib.auth.models import AbstractUser

from Morningstar.lib.nickname_generator import get_random_nickname

class User(AbstractUser):
    nickname = models.CharField(unique=True, verbose_name="昵称", max_length=200, blank=True, null=True)
    email = models.EmailField(unique=True, max_length=200, blank=True, null=True, verbose_name='邮箱')
    phone = models.CharField(unique=True, verbose_name="手机号", max_length=32, blank=True, null=True)
    bio = models.TextField(verbose_name="个人简介", blank=True, null=True)
    avatar = models.ImageField(verbose_name="头像", default="avatar/default.svg", upload_to='avatar/%Y%m%d%H%M%S/', blank=True, null=True)
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "档案"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.nickname:
            self.nickname = get_random_nickname()
        super().save(*args, **kwargs)
