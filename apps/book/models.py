from django.db import models
from requests.utils import unquote

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = '分类'
        verbose_name_plural = verbose_name
        app_label = 'book'

    def __str__(self):
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = '作者'
        verbose_name_plural = verbose_name
        app_label = 'book'

    def __str__(self):
        return self.name


class Translator(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = '译者'
        verbose_name_plural = verbose_name
        app_label = 'book'

    def __str__(self):
        return self.name


class Book(models.Model):
    book_name = models.CharField('书名', max_length=100)
    category = models.ForeignKey(Category, verbose_name='分类', on_delete=models.CASCADE)
    author = models.ForeignKey(Author, verbose_name='作者', on_delete=models.SET_DEFAULT, null=True, default=None)
    translator = models.ForeignKey(Translator, verbose_name='译者', on_delete=models.SET_DEFAULT, null=True, default=None, blank=True)
    file = models.FileField('文件', upload_to="book/%Y%m%d%H%M%S/", default="book/default.pdf", blank=True, null=True)
    foreign_url = models.URLField('外链', null=True, blank=True)

    @property
    def uri(self):
        return unquote(self.foreign_url if self.foreign_url else self.file.url)

    class Meta:
        verbose_name = '书目'
        verbose_name_plural = verbose_name
        app_label = 'book'

    def __str__(self):
        return self.book_name



