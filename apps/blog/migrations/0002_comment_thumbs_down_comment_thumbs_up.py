# Generated by Django 4.1 on 2022-08-29 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='thumbs_down',
            field=models.PositiveIntegerField(default=0, editable=False, verbose_name='点踩数'),
        ),
        migrations.AddField(
            model_name='comment',
            name='thumbs_up',
            field=models.PositiveIntegerField(default=0, editable=False, verbose_name='点赞数'),
        ),
    ]
