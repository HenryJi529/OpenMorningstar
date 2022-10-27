FROM ubuntu:latest
LABEL maintainer="jeep.jipu@gmail.com" version="1.0"

# 账户
RUN useradd ubuntu -m \ 
	&& echo "root:1234asdw" | chpasswd && echo "ubuntu:1234asdw" | chpasswd \ 
	&& usermod -aG sudo ubuntu

# 换源
COPY ./_mirror_cn/aliyun-sources.list /etc/apt/sources.list
RUN apt-get update && apt-get upgrade -y && apt-get install -y sudo
COPY ./_mirror_cn/pip.conf /home/ubuntu/.pip/pip.conf
COPY ./_mirror_cn/pip.conf /root/.pip/pip.conf

## 时区
RUN export DEBIAN_FRONTEND=noninteractive && \
	apt-get install -y tzdata && \
	ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
	dpkg-reconfigure -f noninteractive tzdata

# 依赖
RUN apt-get install -y systemctl wget curl zsh git python3 ipython3 python3-pip vim cmake net-tools \
	&& apt update && apt install -y libmysqlclient-dev python3-dev \
	&& apt-get upgrade -y && apt-get autoremove -y

# 虚拟环境
RUN /usr/bin/pip install virtualenv
RUN ln -s /usr/bin/python3 /usr/bin/python

USER ubuntu

# ZSH
RUN sh -c "$(wget -O - https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/scripts/deploy/_install/oh-my-zsh.sh)"  && \
	sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="fino-time"/g' /home/ubuntu/.zshrc

# Git
RUN mkdir /home/ubuntu/.ssh/
COPY dev/config/id_rsa_ai /home/ubuntu/.ssh/id_rsa
COPY dev/config/id_rsa_ai.pub /home/ubuntu/.ssh/id_rsa.pub
USER root
RUN chown -R ubuntu /home/ubuntu/.ssh/
USER ubuntu
RUN git config --global user.name "Ai Haibara" \
	&& git config --global user.email "ai529.haibara@gmail.com" \
	&& git config --global alias.st status \
	&& git config --global alias.co checkout \
	&& git config --global alias.br branch \
	&& git config --global alias.ph push \
	&& git config --global alias.ci "commit -m" \
	&& git config --global alias.lgraph "log --graph --pretty=oneline --abbrev-commit" \
	&& git config --global alias.last "log -1" \
	&& git config --global alias.unstage "reset HEAD" \
	&& git config --global alias.lg "log --all --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit" \
	&& git config --global alias.df "diff --compact-summary" \
	&& git config --global core.excludesfile /home/ubuntu/.gitignore_global \
	&& git config --global core.editor vim \
	&& git config --global core.quotepath false \
	&& git config --global color.ui true \
	&& git config --global pull.rebase false \
	&& git config --global url."https://hub.fastgit.xyz/".insteadOf "https://github.com/"


# 设置dev目录
RUN mkdir /home/ubuntu/dev
