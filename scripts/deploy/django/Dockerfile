FROM python:3.9
WORKDIR /app

RUN apt-get update
RUN apt-get install -y net-tools vim rsync curl
RUN apt-get install -y default-mysql-client
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - 
RUN apt-get install -y nodejs
RUN npm install -g yarn
RUN apt-get install -y cron
RUN apt-get install -y supervisor
# NOTE: 分离python依赖安装，加快构建速度
# COPY ./django/requirements-prod.txt /app/requirements-prod.txt
# RUN python3 -m pip install -r /app/requirements-prod.txt

# 解决timezone依赖
RUN export DEBIAN_FRONTEND=noninteractive && apt-get install -y tzdata && ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && dpkg-reconfigure -f noninteractive tzdata

RUN test -d static || mkdir static
RUN test -d log || mkdir log && touch log/cron.log 

COPY ./django/production.sh /production.sh
COPY ./django/supervise.conf /etc/supervisor/conf.d/django.conf
