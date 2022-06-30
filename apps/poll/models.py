import datetime
from django.db import models
from django.utils import timezone
from django.contrib import admin


class Question(models.Model):
    question_text = models.CharField("问题文本", max_length=200)
    pub_date = models.DateTimeField('发布日期', default=timezone.now)

    class Meta:
        verbose_name = '问题'
        verbose_name_plural = verbose_name
        ordering = ['-pub_date', '-question_text', ]

    def __str__(self):
        return self.question_text

    @admin.display(
        boolean=True,
        ordering='pub_date',
        description='Published recently?',
    )
    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.pub_date <= now


class Choice(models.Model):
    question = models.ForeignKey(
        Question, verbose_name="问题", on_delete=models.CASCADE)
    choice_text = models.CharField("选项", max_length=200)
    votes = models.IntegerField("票数", default=0)

    def __str__(self):
        return self.choice_text

    class Meta:
        verbose_name = '选项'
        verbose_name_plural = verbose_name
