FROM nginx:latest

# RUN apt-get update
# RUN apt-get install -y ca-certificates
# RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak
# COPY ./_mirror_cn/tuna-sources-debian.list /etc/apt/sources.list

RUN apt-get update
RUN apt-get install -y certbot python3-certbot-nginx vim cron
RUN echo "0 12 * * 1 root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew" | tee -a /etc/crontab
# 启动脚本
COPY ./nginx/start.sh /start.sh
RUN chmod +x /start.sh

# 网站配置
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/conf/_django_blog.conf /etc/nginx/conf.d/_django_blog.conf
COPY ./nginx/conf/_django_book.conf /etc/nginx/conf.d/_django_book.conf
COPY ./nginx/conf/_django_joke.conf /etc/nginx/conf.d/_django_joke.conf
COPY ./nginx/conf/_django_lover.conf /etc/nginx/conf.d/_django_lover.conf
COPY ./nginx/conf/_django_nav.conf /etc/nginx/conf.d/_django_nav.conf
COPY ./nginx/conf/_django_poll.conf /etc/nginx/conf.d/_django_poll.conf
COPY ./nginx/conf/_django_tool.conf /etc/nginx/conf.d/_django_tool.conf
COPY ./nginx/conf/_django_v2ray.conf /etc/nginx/conf.d/_django_v2ray.conf
COPY ./nginx/conf/_django.conf /etc/nginx/conf.d/_django.conf
COPY ./nginx/conf/_frps.conf /etc/nginx/conf.d/_frps.conf
COPY ./nginx/conf/beancount.conf /etc/nginx/conf.d/beancount.conf
COPY ./nginx/conf/code.conf /etc/nginx/conf.d/code.conf
COPY ./nginx/conf/dockerhub.conf /etc/nginx/conf.d/dockerhub.conf
COPY ./nginx/conf/gitea.conf /etc/nginx/conf.d/gitea.conf
COPY ./nginx/conf/portainer.conf /etc/nginx/conf.d/portainer.conf
COPY ./nginx/conf/rsshub.conf /etc/nginx/conf.d/rsshub.conf
COPY ./nginx/conf/send.conf /etc/nginx/conf.d/send.conf
COPY ./nginx/conf/ssh.conf /etc/nginx/conf.d/ssh.conf


