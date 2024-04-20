import subprocess
import os
import threading
from pathlib import Path
from timeit import default_timer as timer
import argparse
import random
import sys
from datetime import timedelta

from fabric import Connection
import colorama
from dotenv import load_dotenv
import faker
import django
from django.core.files.base import ContentFile, File
from django.core.files.images import ImageFile

load_dotenv(dotenv_path=Path(__file__).parent / ".env", verbose=True)

DOMAIN_LIST = [
    "morningstar369.com",
    "beancount.morningstar369.com",
    "code.morningstar369.com",
    "frps.morningstar369.com",
    "jellyfin.morningstar369.com",
    "matomo.morningstar369.com",
    "portainer.morningstar369.com",
    "sshwifty.morningstar369.com",
]


def colored_print(var, end: str = "\n"):
    formatted_output = (
        colorama.Fore.YELLOW
        + colorama.Style.BRIGHT
        + str(var)
        + colorama.Style.RESET_ALL
    )
    print(formatted_output, end=end)


def time(func):
    def wrapper(*args, **kwargs):
        start_time = timer()
        result = func(*args, **kwargs)
        end_time = timer()
        execution_time = end_time - start_time
        colored_print(f"[INFO] Total running time: {execution_time:.3f} seconds")
        return result

    return wrapper


def runcmd(command, pipe: bool = True):
    if pipe:
        # 启动子进程并建立管道
        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            encoding="utf-8",
            universal_newlines=True,
        )
        # 逐行读取输出
        for line in process.stdout:
            print(line, end="")
        # 等待子进程结束
        process.wait()
    else:
        ret = subprocess.run(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            encoding="utf-8",
            universal_newlines=True,
        )
        if ret.returncode == 0:
            print(ret.stdout)
        else:
            colored_print(ret.stderr)


class Tool:
    PYTHON = Path(__file__).parent / "VENV/bin/python"
    PIPDEPTREE = Path(__file__).parent / "VENV/bin/pipdeptree"
    PIP = Path(__file__).parent / "VENV/bin/pip"
    COVERAGE = Path(__file__).parent / "VENV/bin/coverage"


class Env:
    CLOUD_USERNAME = os.getenv("CLOUD_USERNAME")
    CLOUD_PASSWORD = os.getenv("CLOUD_PASSWORD")
    PUBLIC_IP = os.getenv("PUBLIC_IP")
    DEV_PASSWORD = os.getenv("DEV_PASSWORD")


class MorningstarConnection(Connection):
    def __init__(self):
        super().__init__(
            host=Env.PUBLIC_IP,
            user=Env.CLOUD_USERNAME,
            connect_kwargs={"password": Env.CLOUD_PASSWORD},
        )


class Commands:
    @staticmethod
    def serve():
        runcmd(f"{Tool.PYTHON} manage.py runserver 127.0.0.1:8000")

    @staticmethod
    def dev():
        colored_print("同步JavaScript模块...")
        runcmd("rsync -a ./node_modules ./Morningstar/static")
        colored_print("=" * 40)
        colored_print("迁移模型到数据库...")
        runcmd(f"{Tool.PYTHON} manage.py makemigrations && python manage.py migrate")
        colored_print("=" * 40)
        colored_print("重建索引...")
        runcmd(f"{Tool.PYTHON} manage.py rebuild_index --noinput")
        # colored_print("启动定时任务...")
        # runcmd(f"{Tool.PYTHON} manage.py crontab add")
        # colored_print("="*40)
        colored_print("编译CSS/JS库...")
        threading.Thread(
            target=lambda: runcmd("npm run build &"), args=()
        ).start()  # NOTE: 需按序开启/关闭live-sass-compiler插件【以后需用python线程替代】
        colored_print("=" * 40)
        # colored_print("获取静态文件...")
        # runcmd(f"{Tool.PYTHON} manage.py collectstatic --noinput")
        # colored_print("="*40)
        colored_print("启动django-server...")
        threading.Thread(
            target=lambda: runcmd(f"{Tool.PYTHON} manage.py runserver 0:8000"),
            args=(),
        ).start()

    @staticmethod
    def coverage():
        runcmd(f"{Tool.COVERAGE} erase --rcfile=scripts/coverage/.coveragerc")
        runcmd(
            f"{Tool.COVERAGE} run --rcfile=scripts/coverage/.coveragerc manage.py test Morningstar/ apps/ --failfast --noinput"
        )
        runcmd(f"{Tool.COVERAGE} report --rcfile=scripts/coverage/.coveragerc")
        runcmd(f"{Tool.COVERAGE} html --rcfile=scripts/coverage/.coveragerc")
        runcmd(f"live-server scripts/deploy/nginx/www/coverage")

    @staticmethod
    def initialize():
        # 将项目根目录添加到 Python 的模块搜索路径中
        BASE_DIR = Path(__file__).parent
        sys.path.append(BASE_DIR)

        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Morningstar.settings.dev")
        django.setup()

        from django.utils import timezone
        from Morningstar.models import User
        import blog, book, joke, share

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
            # share
            share.models.Item.objects.all().delete()
            # user
            User.objects.all().delete()

        def init_user():
            fake = faker.Faker()
            superuser = User.objects.create_superuser(
                username="admin",
                email="admin@morningstar.com",
                phone="19850000001",
                password="admin",
            )
            # 创建邮箱账户
            for _ in range(10):
                try:
                    User.objects.create_user(
                        username=fake.name().lower().replace(" ", ""),
                        email=fake.email(),
                        password=fake.password(),
                        is_staff=True,
                    )
                except Exception:
                    pass
            # 创建手机账户
            for _ in range(10):
                try:
                    User.objects.create_user(
                        username=fake.name().lower().replace(" ", ""),
                        phone="198" + str(random.randint(10000000, 99999999)),
                        password=fake.password(),
                    )
                except Exception:
                    pass
            return superuser

        def init_blog():
            """创建分类和标签"""
            print("创建分类与标签...")
            category_list = [
                "Python学习笔记",
                "开源项目",
                "工具资源",
                "程序员生活感悟",
                "test category",
            ]
            tag_list = [
                "django",
                "Python",
                "Virtualenv",
                "Docker",
                "Nginx",
                "Elasticsearch",
                "Gunicorn",
                "Supervisor",
                "test tag",
            ]
            a_year_ago = timezone.now() - timedelta(days=365)
            for cate in category_list:
                blog.models.Category.objects.create(name=cate)
            for tag in tag_list:
                blog.models.Tag.objects.create(name=tag)

            """ 创建博文 """
            print("创建博文...")
            # 50篇英文
            fake = faker.Faker()
            for _ in range(50):
                cate = blog.models.Category.objects.order_by("?").first()
                created = fake.date_time_between(
                    start_date="-1y",
                    end_date="now",
                    tzinfo=timezone.get_current_timezone(),
                )
                post = blog.models.Post.objects.create(
                    title=fake.sentence().rstrip("."),
                    body="\n\n".join(fake.paragraphs(10)),
                    created=created,
                    category=cate,
                )
                tag4post = blog.models.Tag.objects.all()[
                    : random.randint(0, len(tag_list))
                ]
                post.tags.add(*tag4post)
                post.save()
            # 50篇中文
            fake = faker.Faker("zh_CN")
            for _ in range(50):  # Chinese
                tags = blog.models.Tag.objects.order_by("?")
                tag1 = tags.first()
                tag2 = tags.last()
                cate = blog.models.Category.objects.order_by("?").first()
                created = fake.date_time_between(
                    start_date="-1y",
                    end_date="now",
                    tzinfo=timezone.get_current_timezone(),
                )
                post = blog.models.Post.objects.create(
                    title=fake.sentence().rstrip("."),
                    body="\n\n".join(fake.paragraphs(10)),
                    created=created,
                    category=cate,
                )
                post.tags.add(tag1, tag2)
                post.save()

            """ 添加评论 """
            print("创建评论...")
            for post in blog.models.Post.objects.all()[:90]:
                post_created = post.created
                delta_in_days = "-" + str((timezone.now() - post_created).days) + "d"
                for _ in range(random.randint(3, 15)):
                    comment1 = blog.models.Comment.objects.create(
                        user=User.objects.order_by("?").first(),
                        body=fake.paragraph(),
                        created=fake.date_time_between(
                            start_date=delta_in_days,
                            end_date="now",
                            tzinfo=timezone.get_current_timezone(),
                        ),
                        post=post,
                    )
                    for ind in range(random.randint(0, 50)):
                        comment1.thumbs_up.add(User.objects.order_by("?").first())
                    for ind in range(random.randint(0, 20)):
                        comment1.thumbs_down.add(User.objects.order_by("?").first())
                    comment1.save()

        def init_book():
            fake = faker.Faker("zh_CN")
            for _ in range(100):
                try:
                    book.models.Category.objects.create(
                        name=fake.text()[: random.randint(5, 10)]
                    )
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
                        book_name=fake.text()[: random.randint(5, 10)],
                        category=book.models.Category.objects.order_by("?").first(),
                        author=book.models.Author.objects.order_by("?").first(),
                        translator=book.models.Translator.objects.order_by("?").first(),
                        file=ContentFile(
                            "It is a file",
                            name=fake.text()[: random.randint(5, 10)] + ".epub",
                        ),
                    )
                else:
                    book.models.Book.objects.create(
                        book_name=fake.text()[: random.randint(5, 10)],
                        category=book.models.Category.objects.order_by("?").first(),
                        author=book.models.Author.objects.order_by("?").first(),
                        file=ContentFile(
                            "It is a file",
                            name=fake.text()[: random.randint(5, 10)] + ".epub",
                        ),
                    )

        def init_joke():
            fake = faker.Faker("zh_CN")
            for _ in range(100):
                joke.models.Text.objects.create(
                    body=fake.text(), title=fake.text()[: random.randint(10, 15)]
                )
            for _ in range(100):
                photo1 = joke.models.Photo.objects.create(
                    title=fake.text()[: random.randint(10, 15)]
                )
                photo1.image.save(
                    fake.text()[: random.randint(5, 10)] + ".jpg",
                    ContentFile(
                        fake.image(
                            size=(random.randint(200, 500), random.randint(400, 800))
                        )
                    ),
                )

        def init_share():
            fake = faker.Faker()
            for _ in range(100):
                share.models.Item.objects.create(url=fake.url())

        colored_print("清空数据库...")
        clean_database()

        colored_print("创建用户数据...")
        superuser = init_user()
        colored_print("创建博客数据...")
        init_blog()
        colored_print("创建书籍数据...")
        init_book()
        colored_print("创建笑话数据...")
        init_joke()
        colored_print("创建分享数据...")
        init_share()
        colored_print("DONE!!!!")

    @staticmethod
    def updateDep():
        colored_print("JavaScript: 更新版本...")
        colored_print("- 更新base:")
        runcmd("npx ncu -u && yarn install")  # NOTE: 大版本更新
        runcmd("yarn upgrade")
        colored_print("- 更新extension:")
        runcmd("cd extension/popup/ && yarn upgrade && cd ../../")
        for subdir in [
            subdir
            for subdir in (Path(__file__).parent / "apps").iterdir()
            if subdir.is_dir()
        ]:
            if not (subdir / "frontend").is_dir():
                continue
            colored_print(f"- 更新{subdir.name}:")
            runcmd(f"cd {(subdir / 'frontend')} && yarn upgrade && cd ../../../")
        colored_print("=" * 40)
        colored_print("Python: 更新版本...")
        runcmd(
            f"{Tool.PYTHON} scripts/dependency/dependencyManager.py upgrade --verbose"
        )
        runcmd(
            f"{Tool.PYTHON} scripts/dependency/dependencyManager.py export --verbose"
        )
        runcmd(f"{Tool.PIPDEPTREE} -fl >pipdeptree.txt")

    @staticmethod
    def updateDjango():
        conn = MorningstarConnection()
        project_root_path = "~/morningstar"
        home_path = "~/"

        colored_print("更新代码...")
        with conn.cd(project_root_path):
            conn.run("git fetch --all && git reset --hard origin/main")

        with conn.cd(home_path):
            colored_print("转移媒体文件...")
            conn.run("docker cp ~/morningstar/media morningstar_django:/app")

            colored_print("运行更新脚本...")
            conn.run("docker exec -i morningstar_django bash /production.sh")

            colored_print("重启服务...")
            conn.run("docker exec -i morningstar_django supervisorctl restart django")

            colored_print("更新HTTPS...")
            conn.run(
                "docker exec -i morningstar_nginx certbot --nginx --non-interactive"
                + " -d "
                + " -d ".join(DOMAIN_LIST)
            )  # NOTE:解决HTTPS失效问题

    @staticmethod
    def updateNginx():
        def syncNginx(c: Connection):
            home_path = "~/"
            with c.cd(home_path):
                colored_print("同步配置文件...")
                c.run(
                    "sshpass -p "
                    + Env.DEV_PASSWORD
                    + " scp -P 1022 -r henry529@server.morningstar369.com:~/Projects/OpenMorningstar/scripts/deploy/nginx/conf  ~/morningstar/scripts/deploy/nginx/"
                )
                colored_print("同步前端页面...")
                c.run(
                    "sshpass -p "
                    + Env.DEV_PASSWORD
                    + " scp -P 1022 -r henry529@server.morningstar369.com:~/Projects/OpenMorningstar/scripts/deploy/nginx/www  ~/morningstar/scripts/deploy/nginx"
                )
                colored_print("加载新配置文件...")
                c.run("docker exec -i morningstar_nginx nginx -s reload")
                commandTemplate = (
                    "docker exec -i morningstar_nginx certbot --nginx --non-interactive"
                )
                c.run(
                    commandTemplate + " -d " + " -d ".join(DOMAIN_LIST)
                )  # NOTE:解决HTTPS失效问题

        colored_print("编译前端代码...")
        for subdir in [
            subdir
            for subdir in (Path(__file__).parent / "apps").iterdir()
            if subdir.is_dir()
        ]:
            if not (subdir / "frontend").is_dir():
                continue
            runcmd(f"cd {(subdir / 'frontend')} && npm run build")
        colored_print("同步前端代码...")
        syncNginx(MorningstarConnection())

    @staticmethod
    def updateProd():
        def updateDocker(c):
            home_path = "~/"
            with c.cd(home_path):
                colored_print("更新代码...")
                c.run("sudo rm -rf ~/morningstar/")
                c.run(
                    "git clone https://github.com/HenryJi529/OpenMorningstar.git ~/morningstar"
                )

                def update_file_with_secret():
                    c.run(
                        "source ~/.zshrc && echo \"\nenvironment=DJANGO_SECRET_KEY='${DJANGO_SECRET_KEY}',EMAIL_HOST_PASSWORD='${EMAIL_HOST_PASSWORD}',TENCENT_SMS_APP_KEY='${TENCENT_SMS_APP_KEY}',RECAPTCHA_PUBLIC_KEY='${RECAPTCHA_PUBLIC_KEY}',RECAPTCHA_PRIVATE_KEY='${RECAPTCHA_PRIVATE_KEY}',MYSQL_ROOT_PASSWORD='${MYSQL_ROOT_PASSWORD}',REDIS_PASSWORD='${REDIS_PASSWORD}'\" >> ~/morningstar/scripts/deploy/django/supervise.conf"
                    )

                colored_print("添加密钥...")
                update_file_with_secret()

                colored_print("清理docker(除volume)...")
                try:
                    c.run('docker rm -f $(docker ps -aq | tr "\\n" " ")')
                except:
                    pass
                c.run("docker system prune -af")

                colored_print("部署容器...")
                c.run(
                    "source ~/.zshrc && cd ~/morningstar/scripts/deploy; docker-compose build && docker-compose up -d"
                )

                colored_print("转移媒体文件...")
                c.run("docker cp ~/morningstar/media morningstar_django:/app")

                colored_print("启动supervisor管理Django进程...")
                c.run("docker exec -i morningstar_django service supervisor start")
                # NOTE: 重启Django确保数据库无连接错误
                c.run("docker exec -i morningstar_django bash /production.sh")
                c.run("docker exec -i morningstar_django supervisorctl start django")

                colored_print("配置HTTPS...")
                # certbot certonly --manual --preferred-challenge dns -d django.morningstar.com  # NOTE: 手动配置
                commandTemplate = (
                    "docker exec -i morningstar_nginx certbot --nginx --non-interactive"
                )
                c.run(commandTemplate + " -d " + " -d ".join(DOMAIN_LIST))

        colored_print("更新Docker...")
        updateDocker(MorningstarConnection())
        colored_print("更新Nginx...")
        Commands.updateNginx()

    @staticmethod
    def backupProd():
        def backupDatabase(c: Connection):
            project_root_path = "~/morningstar"
            with c.cd(project_root_path):
                try:
                    c.run(f"mkdir /home/{Env.CLOUD_USERNAME}/morningstar/database/")
                except:
                    pass
                c.run(
                    'docker exec -i morningstar_django bash -c "python3 manage.py dumpdata --settings=Morningstar.settings.production > database/all.json"'
                )

        def backupDockerVolume(c: Connection):
            home_path = "~/"
            with c.cd(home_path):
                c.run("bash ~/deploy.sh a")

        conn = MorningstarConnection()
        colored_print("数据库备份...")
        backupDatabase(conn)
        colored_print("同步数据库到本地...")
        runcmd(
            f"scp -P 22 {Env.CLOUD_USERNAME}@server.morningstar369.com:~/morningstar/database/all.json ~/Projects/OpenMorningstar/database"
        )
        colored_print("备份volume为压缩包...")
        backupDockerVolume(conn)
        colored_print("同步压缩包到本地...")
        runcmd(
            f"rsync -avz {Env.CLOUD_USERNAME}@server.morningstar369.com:~/backup/docker_volume ./database/"
        )

    @staticmethod
    def restoreProd():
        def restoreDatabase(c: Connection):
            project_root_path = "~/morningstar"
            with c.cd(project_root_path):
                c.run(
                    'docker exec -i morningstar_django bash -c "python3 manage.py loaddata --settings=Morningstar.settings.production database/all.json"'
                )

        def restoreDockerVolume(c: Connection):
            home_path = "~/"
            with c.cd(home_path):
                c.run("bash ~/deploy.sh b")

        conn = MorningstarConnection()
        colored_print("同步数据库到远处...")
        runcmd(
            f"scp -P 22 ~/Projects/OpenMorningstar/database/all.json {Env.CLOUD_USERNAME}@server.morningstar369.com:~/morningstar/database"
        )
        colored_print("数据库还原...")
        restoreDatabase(conn)
        colored_print("同步压缩包到远处...")
        runcmd(
            f"rsync -avz ./database/docker_volume {Env.CLOUD_USERNAME}@server.morningstar369.com:~/backup/"
        )
        colored_print("复原压缩包为volume...")
        restoreDockerVolume(conn)

    @staticmethod
    def publicArchive():
        colored_print("压缩源代码...")
        runcmd(
            "git archive --format=tar main | gzip >release/main_$(date '+%Y-%m-%d').tar.gz"
        )
        colored_print("打包插件...")
        runcmd(
            "cd extension && make build && cd .. && zip -r release/extension_$(date '+%Y-%m-%d').zip extension/dist/*"
        )

    @staticmethod
    def publicPackage():
        colored_print("更新生产环境下的容器...")
        conn = MorningstarConnection()
        home_path = "~/"
        with conn.cd(home_path):
            """发布包(dockerhub与ghcr)"""
            packages = ["beancount", "tshock"]
            for package in packages:
                try:
                    conn.run(f"docker rmi ghcr.io/henryji529/morningstar-{package}")
                except:
                    pass
                conn.run(
                    f"docker tag henry529/{package} ghcr.io/henryji529/morningstar-{package}"
                )
                conn.run(f"docker push ghcr.io/henryji529/morningstar-{package}")
                conn.run(f"docker push henry529/{package}")

    @staticmethod
    def checkCert():
        conn = MorningstarConnection()
        colored_print("Let's Encrypt证书剩余时间: ")
        conn.run(
            "source ~/.zshrc && docker exec morningstar_nginx certbot certificates"
        )

    @staticmethod
    def syncLedger():
        conn = MorningstarConnection()
        home_path = "~/"
        with conn.cd(home_path):
            colored_print("传递数据至文件夹...")
            conn.run(
                "sshpass -p "
                + Env.DEV_PASSWORD
                + " scp -P 1022 -r henry529@server.morningstar369.com:~/Projects/OpenMorningstar/scripts/deploy/beancount  ~/morningstar/scripts/deploy/"
            )
            colored_print("传递数据至数据卷...")
            conn.run(
                "docker cp ~/morningstar/scripts/deploy/beancount morningstar_beancount:/root/"
            )

    @staticmethod
    def _test():
        runcmd('echo "\033[33mThis is a test...\033[0m"')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Execute Task")
    parser.add_argument(
        "action",
        nargs=1,
        help="操作",
        choices=[
            "serve",
            "dev",
            "coverage",
            "initialize",
            "updateDep",
            "updateDjango",
            "updateNginx",
            "updateProd",
            "backupProd",
            "restoreProd",
            "publicArchive",
            "publicPackage",
            "checkCert",
            "syncLedger",
            "_test",
        ],
    )
    args = parser.parse_args()
    action = args.action[0]
    time(getattr(Commands, action))()
    runcmd("figlet Morningstar")
