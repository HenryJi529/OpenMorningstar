# Generated by Django 4.2.1 on 2023-07-24 13:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_alter_post_readtime'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='category',
            options={'ordering': ['name'], 'verbose_name': '分类', 'verbose_name_plural': '分类'},
        ),
        migrations.AlterModelOptions(
            name='tag',
            options={'ordering': ['name'], 'verbose_name': '标签', 'verbose_name_plural': '标签'},
        ),
    ]
