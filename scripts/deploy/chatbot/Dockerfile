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

EXPOSE 3000
CMD git clone https://github.com/HenryJi529/chatbot-ui.git chatbot && cd chatbot && npm install && npm run build && npm run start