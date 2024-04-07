from fabric import task


@task()
def updateAll(c):
    home_path = "~/"
    with c.cd(home_path):
        """更新项目"""
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
        c.run("docker exec -it morningstar_django service supervisor start")
        # NOTE: 重启Django确保数据库无连接错误
        c.run("docker exec -it morningstar_django bash /production.sh")
        c.run("docker exec -it morningstar_django supervisorctl start django")

        colored_print("配置HTTPS...")
        # c.run("certbot certonly --manual --preferred-challenge dns -d django.morningstar.com")  # NOTE: 手动配置
        # c.run("docker exec -it morningstar_nginx certbot --nginx -n --domains xxx.com")
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
def publicPackage(c):
    home_path = "~/"
    with c.cd(home_path):
        """发布包(dockerhub与ghcr)"""
        packages = ["beancount", "tshock"]
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
        colored_print("传递数据至文件夹...")
        c.run(
            "sshpass -p "
            + DEV_PASSWORD
            + " scp -P 1022 -r henry529@server.morningstar369.com:~/Projects/OpenMorningstar/scripts/deploy/beancount  ~/morningstar/scripts/deploy/"
        )
        colored_print("传递数据至数据卷...")
        c.run(
            "docker cp ~/morningstar/scripts/deploy/beancount morningstar_beancount:/root/"
        )

    print("Done!!")


@task()
def syncNginx(c):
    home_path = "~/"
    with c.cd(home_path):
        colored_print("同步配置文件...")
        c.run(
            "sshpass -p "
            + DEV_PASSWORD
            + " scp -P 1022 -r henry529@server.morningstar369.com:~/Projects/OpenMorningstar/scripts/deploy/nginx/conf  ~/morningstar/scripts/deploy/nginx/"
        )
        colored_print("同步前端页面...")
        c.run(
            "sshpass -p "
            + DEV_PASSWORD
            + " scp -P 1022 -r henry529@server.morningstar369.com:~/Projects/OpenMorningstar/scripts/deploy/nginx/www  ~/morningstar/scripts/deploy/nginx"
        )
        colored_print("加载新配置文件...")
        c.run("docker exec -it morningstar_nginx nginx -s reload")
        commandTemplate = (
            "docker exec -it morningstar_nginx certbot --nginx --non-interactive"
        )
        c.run(
            commandTemplate + " -d " + " -d ".join(DOMAIN_LIST)
        )  # NOTE:解决HTTPS失效问题

    print("Done!!")