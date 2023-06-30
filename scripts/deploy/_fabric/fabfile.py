from fabric import task
from invoke import Responder
import os
import sh
import subprocess
from dotenv import load_dotenv
import colorama

# NOTE: 因为.env的路径问题，所以本脚本只能通过task.sh在根目录执行


env_path = os.getcwd() + "/.env"
load_dotenv(dotenv_path=env_path, verbose=True)
DEV_PASSWORD = os.getenv("DEV_PASSWORD")
CLOUD_USERNAME = os.getenv("CLOUD_USERNAME")

DOMAIN_LIST = [
    "morningstar369.com",
    "beancount.morningstar369.com",
    "code.morningstar369.com",
    "frps.morningstar369.com",
    "matomo.morningstar369.com",
    "portainer.morningstar369.com",
    "ssh.morningstar369.com",
]


def runcmd1(command):
    ret = subprocess.run(
        command,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        encoding="utf-8",
        timeout=1,
        universal_newlines=True,
    )
    if ret.returncode == 0:
        print("success:", ret)
    else:
        print("error:", ret)


def runcmd2(command):
    process = subprocess.Popen(
        command.split(), stdout=subprocess.PIPE, universal_newlines=True
    )
    output, error = process.communicate()
    print(output)
    if error:
        print(error)


def better_print(var):
    formatted_output = (
        colorama.Fore.YELLOW
        + colorama.Style.BRIGHT
        + str(var)
        + colorama.Style.RESET_ALL
    )
    print(formatted_output)


@task()
def check(c):
    home_path = "~/"
    with c.cd(home_path):
        better_print("Let's Encrypt证书剩余时间: ")
        c.run("source ~/.zshrc && docker exec morningstar_nginx certbot certificates")
        better_print("=======================================================")
    print("Done!!")


@task()
def updateProd(c):
    project_root_path = "~/morningstar"
    home_path = "~/"

    better_print("更新代码...")
    with c.cd(project_root_path):
        c.run("git checkout .")
        c.run("git pull -f")

    with c.cd(home_path):
        better_print("转移媒体文件...")
        c.run("docker cp ~/morningstar/media morningstar_django:/app")

        better_print("运行更新脚本...")
        c.run("docker exec -it morningstar_django bash /production.sh")

        better_print("重启服务...")
        c.run("docker exec -it morningstar_django supervisorctl restart django")

        print("Done!!")


@task()
def upgradeProd(c):
    home_path = "~/"
    with c.cd(home_path):
        """更新项目"""
        better_print("更新代码...")
        c.run("sudo rm -rf ~/morningstar/")
        c.run(
            "git clone https://github.com/HenryJi529/OpenMorningstar.git ~/morningstar"
        )

        def update_file_with_secret():
            c.run(
                "source ~/.zshrc && echo \"\nenvironment=DJANGO_SECRET_KEY='${DJANGO_SECRET_KEY}',EMAIL_HOST_PASSWORD='${EMAIL_HOST_PASSWORD}',TENCENT_SMS_APP_KEY='${TENCENT_SMS_APP_KEY}',RECAPTCHA_PUBLIC_KEY='${RECAPTCHA_PUBLIC_KEY}',RECAPTCHA_PRIVATE_KEY='${RECAPTCHA_PRIVATE_KEY}',MYSQL_ROOT_PASSWORD='${MYSQL_ROOT_PASSWORD}',REDIS_PASSWORD='${REDIS_PASSWORD}'\" >> ~/morningstar/scripts/deploy/django/supervise.conf"
            )
            c.run(
                'source ~/.zshrc && sed -i "s/MORNINGSTAR_USERNAME/${MORNINGSTAR_USERNAME}/" ~/morningstar/scripts/deploy/_config/frp/frps.ini'
            )
            c.run(
                'source ~/.zshrc && sed -i "s/MORNINGSTAR_PASSWORD/${MORNINGSTAR_PASSWORD}/" ~/morningstar/scripts/deploy/_config/frp/frps.ini'
            )

        better_print("添加密钥...")
        update_file_with_secret()

        better_print("清理docker(除volume)...")
        try:
            c.run('docker rm -f $(docker ps -aq | tr "\\n" " ")')
        except:
            pass
        c.run("docker system prune -af")

        better_print("部署容器...")
        c.run(
            "source ~/.zshrc && cd ~/morningstar/scripts/deploy; docker-compose build && docker-compose up -d"
        )

        better_print("配置frps...")
        c.run(
            "docker cp ~/morningstar/scripts/deploy/_config/frp/frps.ini morningstar_frps:/etc/frp/frps.ini && docker restart morningstar_frps"
        )

        better_print("转移媒体文件...")
        c.run("docker cp ~/morningstar/media morningstar_django:/app")

        better_print("启动supervisor管理Django进程...")
        c.run("docker exec -it morningstar_django service supervisor start")
        # NOTE: 重启Django确保数据库无连接错误
        c.run("docker exec -it morningstar_django bash /production.sh")
        c.run("docker exec -it morningstar_django supervisorctl start django")

        better_print("配置HTTPS...")
        c.run("docker exec morningstar_nginx bash /start.sh")
        # c.run('docker exec -it morningstar_nginx certbot --nginx -n --domains xxx.com')
        commandTemplate = (
            "docker exec -it morningstar_nginx certbot --nginx --non-interactive"
        )
        c.run(commandTemplate + " -d " + " -d ".join(DOMAIN_LIST))

    print("Done!!")


@task()
def backupDatabase(c):
    project_root_path = "~/morningstar"
    with c.cd(project_root_path):
        try:
            c.run(f"mkdir /home/{CLOUD_USERNAME}/morningstar/database/")
        except:
            pass
        c.run(
            'docker exec -it morningstar_django bash -c "python3 manage.py dumpdata --settings=Morningstar.settings.production > database/all.json"'
        )
        c.run(
            "sshpass -p "
            + DEV_PASSWORD
            + " scp -P 1022 ~/morningstar/database/all.json henry529@server.morningstar369.com:~/Projects/OpenMorningstar/database"
        )
    print("Done!!")


@task()
def backupDockerVolume(c):
    home_path = "~/"
    with c.cd(home_path):
        c.run("bash ~/deploy.sh a")

    print("Done!!")


@task()
def restoreDatabase(c):
    project_root_path = "~/morningstar"
    with c.cd(project_root_path):
        try:
            c.run(f"mkdir /home/{CLOUD_USERNAME}/morningstar/database/")
        except:
            pass
        c.run(
            "sshpass -p "
            + DEV_PASSWORD
            + " scp -P 1022 henry529@server.morningstar369.com:~/Projects/OpenMorningstar/database/all.json ~/morningstar/database"
        )
        c.run(
            'docker exec -it morningstar_django bash -c "python3 manage.py loaddata --settings=Morningstar.settings.production database/all.json"'
        )
    print("Done!!")


@task()
def restoreDockerVolume(c):
    home_path = "~/"
    with c.cd(home_path):
        c.run("bash ~/deploy.sh b")

    print("Done!!")


@task()
def updatePackage(c):
    home_path = "~/"
    with c.cd(home_path):
        """发布包(dockerhub与ghcr)"""
        packages = ["nginx", "beancount", "tshock", "django"]
        for package in packages:
            try:
                c.run(f"docker rmi ghcr.io/henryji529/morningstar-{package}")
            except:
                pass
            c.run(
                f"docker tag henry529/{package} ghcr.io/henryji529/morningstar-{package}"
            )
            c.run(f"docker push ghcr.io/henryji529/morningstar-{package}")
            c.run(f"docker push henry529/{package}")

    print("Done!!")


@task()
def syncLedger(c):
    home_path = "~/"
    with c.cd(home_path):
        better_print("传递数据至文件夹...")
        c.run(
            "sshpass -p "
            + DEV_PASSWORD
            + " scp -P 1022 -r henry529@server.morningstar369.com:~/Projects/OpenMorningstar/scripts/deploy/beancount  ~/morningstar/scripts/deploy/"
        )
        better_print("传递数据至数据卷...")
        c.run(
            "docker cp ~/morningstar/scripts/deploy/beancount morningstar_beancount:/root/"
        )

    print("Done!!")


@task()
def syncNginx(c):
    home_path = "~/"
    with c.cd(home_path):
        better_print("同步配置文件...")
        c.run(
            "sshpass -p "
            + DEV_PASSWORD
            + " scp -P 1022 -r henry529@server.morningstar369.com:~/Projects/OpenMorningstar/scripts/deploy/nginx/conf  ~/morningstar/scripts/deploy/nginx/"
        )
        better_print("同步前端页面...")
        c.run(
            "sshpass -p "
            + DEV_PASSWORD
            + " scp -P 1022 -r henry529@server.morningstar369.com:~/Projects/OpenMorningstar/scripts/deploy/nginx/www  ~/morningstar/scripts/deploy/nginx"
        )
        better_print("加载新配置文件...")
        c.run("docker exec -it morningstar_nginx nginx -s reload")
        commandTemplate = (
            "docker exec -it morningstar_nginx certbot --nginx --non-interactive"
        )
        c.run(commandTemplate + " -d " + " -d ".join(DOMAIN_LIST))  # NOTE:解决HTTPS失效问题

    print("Done!!")
