# Generated by Django 4.2.11 on 2024-04-21 15:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Node',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64, unique=True, verbose_name='名称')),
                ('link', models.TextField(verbose_name='配置链接')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
            ],
            options={
                'verbose_name': '节点',
                'verbose_name_plural': '节点',
                'ordering': ['-updated'],
            },
        ),
        migrations.CreateModel(
            name='SubscribeUrl',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64, unique=True, verbose_name='名称')),
                ('link', models.TextField(verbose_name='订阅链接')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
            ],
            options={
                'verbose_name': '订阅',
                'verbose_name_plural': '订阅',
                'ordering': ['-updated'],
            },
        ),
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(blank=True, max_length=64, unique=True, verbose_name='令牌')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='用户')),
            ],
            options={
                'verbose_name': '账户',
                'verbose_name_plural': '账户',
                'ordering': ['-updated'],
            },
        ),
    ]
