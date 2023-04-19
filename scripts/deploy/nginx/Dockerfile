FROM nginx:latest

# RUN apt-get update
# RUN apt-get install -y ca-certificates
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak
COPY ./_mirror_cn/tuna-sources-debian.list /etc/apt/sources.list

RUN apt-get update
RUN apt-get install -y certbot python3-certbot-nginx vim cron
RUN echo "0 12 * * 1 root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew" | tee -a /etc/crontab
# 启动脚本
COPY ./nginx/start.sh /start.sh
RUN chmod +x /start.sh

# 网站配置
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/conf/main.conf /etc/nginx/conf.d/main.conf
COPY ./nginx/conf/others.conf /etc/nginx/conf.d/others.conf

