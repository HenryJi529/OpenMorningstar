import os
import pathlib
import random
import sys
from datetime import timedelta
import json
import faker
import csv
import django
import colorama

from django.core.files.base import ContentFile, File
from django.core.files.images import ImageFile 

def better_print(var):
    formatted_output = colorama.Fore.YELLOW + colorama.Style.BRIGHT + str(var) + colorama.Style.RESET_ALL
    print(formatted_output)


# 将项目根目录添加到 Python 的模块搜索路径中
back = os.path.dirname # 获取文件夹名称
BASE_DIR = back(back(back(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Morningstar.settings.dev")
django.setup()

from django.utils import timezone
from Morningstar.models import User
import blog, book, joke, poll, share


def clean_database():
    # blog
    blog.models.Post.objects.all().delete()
    blog.models.Category.objects.all().delete()
    blog.models.Tag.objects.all().delete()
    blog.models.Comment.objects.all().delete()
    # book
    book.models.Book.objects.all().delete()
    book.models.Category.objects.all().delete()
    book.models.Author.objects.all().delete()
    book.models.Translator.objects.all().delete()
    # joke
    joke.models.Photo.objects.all().delete()
    joke.models.Text.objects.all().delete()
    # poll
    poll.models.Choice.objects.all().delete()
    poll.models.Question.objects.all().delete()
    # share
    share.models.Item.objects.all().delete()
    # user
    User.objects.all().delete()


def init_user():
    fake = faker.Faker()
    superuser = User.objects.create_superuser(username='admin', email='admin@morningstar529.com', password='admin')
    # 创建邮箱账户
    for _ in range(10):
        try:
            User.objects.create_user(username=fake.name().lower().replace(' ', ''), email=fake.email(), password=fake.password(), is_staff=True)
        except Exception:
            pass
    # 创建手机账户
    for _ in range(10):
        try:
            User.objects.create_user(username=fake.name().lower().replace(' ', ''), phone='198' + str(random.randint(10000000,99999999)), password=fake.password())
        except Exception:
            pass
    return superuser


def init_blog():
    """ 创建分类和标签 """
    print("创建分类与标签...")
    category_list = ['Python学习笔记', '开源项目', '工具资源', '程序员生活感悟', 'test category']
    tag_list = ['django', 'Python', 'Virtualenv', 'Docker', 'Nginx',
                'Elasticsearch', 'Gunicorn', 'Supervisor', 'test tag']
    a_year_ago = timezone.now() - timedelta(days=365)
    for cate in category_list:
        blog.models.Category.objects.create(name=cate)
    for tag in tag_list:
        blog.models.Tag.objects.create(name=tag)

    """ 创建博文 """
    print("创建博文...")
    blog.models.Post.objects.create(
        title='Nginx 学习笔记',
        body=pathlib.Path(os.path.join(BASE_DIR, 'scripts', 'initialize', 'blog_post.md')).read_text(encoding='utf-8'),
        category=blog.models.Category.objects.create(name='Markdown测试'),
    )
    # 50篇英文
    fake = faker.Faker()
    for _ in range(50):
        tags = blog.models.Tag.objects.order_by('?')
        tag1 = tags.first()
        tag2 = tags.last()
        cate = blog.models.Category.objects.order_by('?').first()
        created = fake.date_time_between(start_date='-1y', end_date="now", tzinfo=timezone.get_current_timezone())
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
        created = fake.date_time_between(start_date='-1y', end_date="now", tzinfo=timezone.get_current_timezone())
        post = blog.models.Post.objects.create(
            title=fake.sentence().rstrip('.'),
            body='\n\n'.join(fake.paragraphs(10)),
            created=created,
            category=cate,
        )
        post.tags.add(tag1, tag2)
        post.save()

    """ 添加评论 """
    print("创建评论...")
    for post in blog.models.Post.objects.all()[:90]:
        post_created = post.created
        delta_in_days = '-' + str((timezone.now() - post_created).days) + 'd'
        for _ in range(random.randint(3, 15)):
            comment1 = blog.models.Comment.objects.create(
                user=User.objects.order_by('?').first(),
                body=fake.paragraph(),
                created=fake.date_time_between(start_date=delta_in_days, end_date="now", tzinfo=timezone.get_current_timezone()),
                post=post,
            )
            for ind in range(random.randint(0,50)):
                comment1.thumbs_up.add(User.objects.order_by('?').first())
            for ind in range(random.randint(0,20)):
                comment1.thumbs_down.add(User.objects.order_by('?').first())
            comment1.save()


def init_book():
    fake = faker.Faker('zh_CN')
    for _ in range(100):
        try:
            book.models.Category.objects.create(name=fake.text()[:random.randint(5,10)])
        except:
            pass
    for _ in range(100):
        try:
            book.models.Author.objects.create(name=fake.name())
        except:
            pass
    for _ in range(100):
        try:
            book.models.Translator.objects.create(name=fake.name())
        except:
            pass
    for _ in range(100):
        if round(random.random()):
            book.models.Book.objects.create(
                book_name=fake.text()[:random.randint(5,10)],
                category=book.models.Category.objects.order_by('?').first(), 
                author=book.models.Author.objects.order_by('?').first(),
                translator=book.models.Translator.objects.order_by('?').first(),
                file=ContentFile("It is a file",name=fake.text()[:random.randint(5,10)]+".epub")
            )
        else:
            book.models.Book.objects.create(
                book_name=fake.text()[:random.randint(5,10)],
                category=book.models.Category.objects.order_by('?').first(), 
                author=book.models.Author.objects.order_by('?').first(),
                file=ContentFile("It is a file",name=fake.text()[:random.randint(5,10)]+".epub")
            )            


def init_joke():
    fake = faker.Faker('zh_CN')
    for _ in range(100):
        joke.models.Text.objects.create(body=fake.text(),title=fake.text()[:random.randint(10,15)])
    for _ in range(100):
        photo1 = joke.models.Photo.objects.create(title=fake.text()[:random.randint(10,15)])
        photo1.image.save(fake.text()[:random.randint(5,10)]+'.jpg', ContentFile(fake.image(size=(random.randint(200,500),random.randint(400,800)))))


def init_poll():
    fake = faker.Faker('zh_CN')
    for _ in range(100):
        question = poll.models.Question.objects.create(question_text=fake.text()[:random.randint(20,24)])
        answer_num = random.randint(2, 5)
        for ind in range(answer_num):
            poll.models.Choice.objects.create(question=question,choice_text=fake.text()[:random.randint(15,24)],votes=abs(fake.random_int()))


def init_share():
    fake = faker.Faker()
    for _ in range(100):
        share.models.Item.objects.create(url=fake.url())


if __name__ == '__main__':
    better_print("清空数据库...")
    clean_database()

    better_print("创建用户数据...")
    superuser = init_user()

    better_print("创建博客数据...")
    init_blog()

    better_print("创建书籍数据...")
    init_book()

    better_print("创建笑话数据...")
    init_joke()

    better_print("创建投票数据...")
    init_poll()

    better_print("创建分享数据...")
    init_share()

    better_print('DONE!!!!')