FROM nginx:latest

# NOTE: 不再支持sources.list直接更新

RUN apt-get update
RUN apt-get install -y certbot python3-certbot-nginx vim

# 网站配置
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
# COPY ./nginx/conf/*.conf /etc/nginx/conf.d/ # NOTE: 用文件夹映射更合理
