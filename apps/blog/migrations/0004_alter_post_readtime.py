# Generated by Django 4.1 on 2022-08-24 05:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_post_readtime'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='readtime',
            field=models.IntegerField(default=0, null=True, verbose_name='阅读时间'),
        ),
    ]
