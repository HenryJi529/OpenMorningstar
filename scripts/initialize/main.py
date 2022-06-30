import os
import pathlib
import random
import sys
from datetime import timedelta
import json
import faker
import csv
import django

# 将项目根目录添加到 Python 的模块搜索路径中
back = os.path.dirname # 获取文件夹名称
BASE_DIR = back(back(back(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Morningstar.settings.dev")
django.setup()

from django.utils import timezone
from Morningstar.models import User
import joke, blog


def clean_database():
    # user
    User.objects.all().delete()
    # blog
    blog.models.Post.objects.all().delete()
    blog.models.Category.objects.all().delete()
    blog.models.Tag.objects.all().delete()
    blog.models.Comment.objects.all().delete()
    # joke
    joke.models.Photo.objects.all().delete()


def init_user():
    superuser = User.objects.create_superuser(
        username='admin', email='admin@morningstar529.com', password='admin')
    User.objects.create_user(
        username='staff', email='staff@morningstar529.com', password='staff', is_staff=True)
    User.objects.create_user(username='guest1', email='guest1@morningstar529.com', password='guest1')
    User.objects.create_user(username='guest2', phone='19850052801',password='guest2')
    return superuser


def init_joke():
	photo_csv_path = pathlib.Path(BASE_DIR).joinpath('scripts', 'initialize', 'joke_photo.csv')
	csv_reader = csv.reader(open(photo_csv_path))
	for line in csv_reader:
		if line[2]:
			joke.models.Photo.objects.create(foreign_url=line[2])


def init_blog():
    """ 创建分类和标签 """
    print('create categories and tags')
    category_list = ['Python学习笔记', '开源项目', '工具资源', '程序员生活感悟', 'test category']
    tag_list = ['django', 'Python', 'Virtualenv', 'Docker', 'Nginx',
                'Elasticsearch', 'Gunicorn', 'Supervisor', 'test tag']
    a_year_ago = timezone.now() - timedelta(days=365)
    for cate in category_list:
        blog.models.Category.objects.create(name=cate)
    for tag in tag_list:
        blog.models.Tag.objects.create(name=tag)

    """ 创建博文 """
    print('create a markdown sample post')
    blog.models.Post.objects.create(
        title='Nginx 学习笔记',
        body=pathlib.Path(BASE_DIR).joinpath(
            'scripts', 'initialize', 'blog_post.md').read_text(encoding='utf-8'),
        category=blog.models.Category.objects.create(name='Markdown测试'),
    )
    print('create some faked posts published within the past year')
    # 50篇英文
    fake = faker.Faker()
    for _ in range(50):
        tags = blog.models.Tag.objects.order_by('?')
        tag1 = tags.first()
        tag2 = tags.last()
        cate = blog.models.Category.objects.order_by('?').first()
        created = fake.date_time_between(start_date='-1y', end_date="now",
                                        tzinfo=timezone.get_current_timezone())
        post = blog.models.Post.objects.create(
            title=fake.sentence().rstrip('.'),
            body='\n\n'.join(fake.paragraphs(10)),
            created=created,
            category=cate,
        )
        post.tags.add(tag1, tag2)
        post.save()
    # 50篇中文
    fake = faker.Faker('zh_CN')
    for _ in range(50):  # Chinese
        tags = blog.models.Tag.objects.order_by('?')
        tag1 = tags.first()
        tag2 = tags.last()
        cate = blog.models.Category.objects.order_by('?').first()
        created = fake.date_time_between(start_date='-1y', end_date="now",
                                        tzinfo=timezone.get_current_timezone())
        post = blog.models.Post.objects.create(
            title=fake.sentence().rstrip('.'),
            body='\n\n'.join(fake.paragraphs(10)),
            created=created,
            category=cate,
        )
        post.tags.add(tag1, tag2)
        post.save()

    """ 添加评论 """
    # print('create some comments')
    # for post in blog.models.Post.objects.all()[:90]:
    #     post_created = post.created
    #     delta_in_days = '-' + \
    #         str((timezone.now() - post_created).days) + 'd'
    #     for _ in range(random.randrange(3, 15)):
    #         blog.models.Comment.objects.create(
    #             name=fake.name(),
    #             email=fake.email(),
    #             body=fake.paragraph(),
    #             created=fake.date_time_between(
    #                 start_date=delta_in_days,
    #                 end_date="now",
    #                 tzinfo=timezone.get_current_timezone()),
    #             post=post,
    #         )


if __name__ == '__main__':
    """ 清除旧数据 """
    print('clean database')
    clean_database()

    print("创建用户数据")
    superuser = init_user()

    print("创建相册数据")
    init_joke()

    print("创建博客数据")
    init_blog()


    print('DONE!!!!')