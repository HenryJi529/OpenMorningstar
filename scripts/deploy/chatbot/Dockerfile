FROM ubuntu:jammy
WORKDIR /root

# 切换中国镜像
RUN apt-get update
RUN apt-get install -y ca-certificates
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak
COPY ./_mirror_cn/ustc-sources.list /etc/apt/sources.list
# COPY ./_mirror_cn/pip.conf /root/.pip/pip.conf

# 安装环境
RUN apt-get update
RUN apt-get install -y net-tools vim rsync curl git
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - 
RUN apt-get install -y nodejs

# 启动脚本
COPY ./chatbot/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 3000
