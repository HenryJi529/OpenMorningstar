FROM nginx:latest

# NOTE: 不再支持sources.list直接更新

RUN apt-get update
RUN apt-get install -y certbot python3-certbot-nginx vim cron
RUN echo "0 12 * * 1 root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew" | tee -a /etc/crontab

# 网站配置
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
# COPY ./nginx/conf/*.conf /etc/nginx/conf.d/ # NOTE: 用文件夹映射更合理

# 启动脚本
COPY ./nginx/start.sh /start.sh
RUN chmod +x /start.sh
