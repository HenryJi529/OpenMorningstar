FROM ubuntu:latest
LABEL maintainer="jeep.jipu@gmail.com" version="1.0"
ARG tshock_version=4.5.18
ARG terraria_version=1.4.3.6
WORKDIR /root

# 换源
RUN apt-get update
RUN apt-get install -y ca-certificates
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak
COPY ./_mirror_cn/ustc-sources.list /etc/apt/sources.list

RUN apt-get update && apt-get upgrade -y

## 时区
RUN export DEBIAN_FRONTEND=noninteractive && apt-get install -y tzdata >/dev/null
RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN dpkg-reconfigure -f noninteractive tzdata

# 安装mono-devel
RUN apt-get install -y gnupg ca-certificates && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF && "deb https://download.mono-project.com/repo/ubuntu stable-focal main" | tee /etc/apt/sources.list.d/mono-official-stable.list && apt-get update && apt-get install -y mono-devel

# 安装必要工具
RUN apt-get install -y unzip vim wget

# 安装tshock
RUN wget https://github.com/Pryaxis/TShock/releases/download/v${tshock_version}/TShock${tshock_version}_Terraria${terraria_version}.zip -O /root/tshock.zip
RUN unzip tshock.zip -d /root/TShock/ && rm tshock.zip

# 解决路径无法访问问题
RUN mkdir -p /root/.local/share/Terraria
RUN chmod 777 /root/.local/share/Terraria

COPY tshock/start.sh /start.sh
RUN chmod +x /start.sh
EXPOSE 7777
