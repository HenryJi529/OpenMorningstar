# Generated by Django 4.1.7 on 2023-05-01 09:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_alter_category_name_alter_tag_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='requireLogin',
            field=models.BooleanField(default=False),
        ),
    ]
