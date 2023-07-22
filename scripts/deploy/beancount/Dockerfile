FROM ubuntu:jammy
LABEL maintainer="jeep.jipu@gmail.com" version="1.0"
WORKDIR /root/

# 换源
RUN apt-get update
RUN apt-get install -y ca-certificates
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak
COPY ./_mirror_cn/ustc-sources.list /etc/apt/sources.list
# COPY ./_mirror_cn/pip.conf /root/.pip/pip.conf

# 安装python3.9和对应pip
RUN apt-get update && apt-get install -y python3-pip && pip install --upgrade pip

# 安装 beancount
RUN pip install beancount fava

# 数据文件
RUN mkdir /root/beancount
RUN echo 'option "title" "我的账本"' >/root/beancount/moneybook.bean && echo 'option "operating_currency" "CNY"' >>/root/beancount/moneybook.bean && echo '2022-05-06 open Equity:OpenBalance' >>/root/beancount/moneybook.bean

EXPOSE 5000
CMD fava beancount/moneybook.bean --host 0.0.0.0
