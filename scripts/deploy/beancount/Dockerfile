FROM python:3.9-slim
LABEL maintainer="jeep.jipu@gmail.com" version="1.0"
WORKDIR /root/

# 安装 beancount
RUN pip install beancount fava

# 数据文件
RUN mkdir /root/beancount
RUN echo 'option "title" "我的账本"' >/root/beancount/moneybook.bean && echo 'option "operating_currency" "CNY"' >>/root/beancount/moneybook.bean && echo '2022-05-06 open Equity:OpenBalance' >>/root/beancount/moneybook.bean

EXPOSE 5000
CMD fava beancount/moneybook.bean --host 0.0.0.0
