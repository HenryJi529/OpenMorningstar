FROM ubuntu:latest

WORKDIR /app

RUN apt-get update
RUN apt-get install -y ca-certificates
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak
COPY ./_mirror_cn/ustc-sources.list /etc/apt/sources.list
# COPY ./_mirror_cn/pip.conf /root/.pip/pip.conf

RUN apt-get update
RUN apt-get install -y iputils-ping net-tools vim rsync
RUN apt-get install -y python3.9 python3-pip mysql-client libmysqlclient-dev
RUN apt-get install -y nodejs npm
RUN apt-get install -y cron
RUN apt-get install -y supervisor
COPY ./django/requirements-prod.txt /app/requirements-prod.txt
RUN python3 -m pip install -r /app/requirements-prod.txt

# 解决timezone依赖
RUN export DEBIAN_FRONTEND=noninteractive && apt-get install -y tzdata && ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && dpkg-reconfigure -f noninteractive tzdata

RUN mkdir static && mkdir appdata && chmod +777 -R appdata/

COPY ./django/production.sh /production.sh
RUN chmod +x /production.sh

COPY ./django/supervise.conf /etc/supervisor/conf.d/django.conf
