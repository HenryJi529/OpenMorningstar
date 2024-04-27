#!/bin/bash
source .env

IGNORE="echo 'debconf debconf/frontend select Noninteractive' | sudo debconf-set-selections && "
DEBIAN_FRONTEND=noninteractive

function echo_important {
  echo "\033[47;31m$1\033[0m"
}

change_password() {
  echo_important "root:$CLOUD_ROOT_PASSWORD" | sudo chpasswd
  echo_important "$CLOUD_USERNAME:$CLOUD_PASSWORD" | sudo chpasswd
}

change_cn_source() {
  change_apt_source() {
    sudo mv /etc/apt/sources.list /etc/apt/sources.list.back
    sudo touch /etc/apt/sources.list
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
deb http://security.ubuntu.com/ubuntu/ jammy-security main restricted universe multiverse" | sudo tee /etc/apt/sources.list
    sudo apt-get update && sudo apt-get upgrade -y
  }
  change_pip_source() {
    mkdir ~/.pip
    echo "[global]
index-url = https://pypi.doubanio.com/simple/
" >~/.pip/pip.conf
  }
  change_apt_source
  change_pip_source
}

config_remote_connect() {
  config_ssh() {
    sudo apt install -y ssh
    sudo sed -i "s/PasswordAuthentication no/PasswordAuthentication yes/g" /etc/ssh/sshd_config
    # sudo sed -i "s/#PermitRootLogin prohibit-password/PermitRootLogin yes/g" /etc/ssh/sshd_config
    sudo systemctl restart ssh
    sudo apt install -y sshpass
  }
  config_telnet() {
    sudo apt-get install -y telnetd telnet # 查看 sudo systemctl status inetd
    # sudo ufw allow 23
  }
  config_ssh
  config_telnet
}

config_shell() {
  config_bash() {
    bash -c "$(curl -fsSL https://raw.githubusercontent.com/ohmybash/oh-my-bash/master/tools/install.sh)"
    cat ~/.bashrc ~/.bashrc.pre-oh-my-bash >~/.bashrc.new
    rm ~/.bashrc ~/.bashrc.pre-oh-my-bash
    mv ~/.bashrc.new ~/.bashrc
  }
  config_zsh() {
    sudo apt-get update && sudo apt-get install -y zsh
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
    sudo sed -i "s/ZSH_THEME="robbyrussell"/ZSH_THEME="josh"/g" ~/.zshrc
    sudo sed -i "s/\/home\/$CLOUD_USERNAME:\/bin\/bash/\/home\/$CLOUD_USERNAME:\/bin\/zsh/g" /etc/passwd
  }
  config_bash
  config_zsh
}

config_git() {
  sudo apt-get install -y git curl
  # config alias
  git config --global user.name "Henry Ji"
  git config --global user.email ${EMAIL}
  git config --global alias.st status
  git config --global alias.co checkout
  git config --global alias.br branch
  git config --global alias.ph push
  git config --global alias.ci "commit -m"
  git config --global alias.lgraph "log --graph --pretty=oneline --abbrev-commit"
  git config --global alias.last "log -1"
  git config --global alias.unstage "reset HEAD"
  git config --global alias.lg "log --all --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
  git config --global alias.df "diff --compact-summary"
  # config core
  git config --global core.excludesfile /home/${CLOUD_USERNAME}/.gitignore_global
  git config --global core.editor vim
  git config --global core.quotepath false
  # config color
  git config --global color.ui true
  # config pull
  git config --global pull.rebase false
  # config init
  git config --global init.defaultBranch main
  # install git lfs
  curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
  sudo apt-get install -y git-lfs
  git lfs install
}

config_vim() {
  sudo apt-get install -y vim
  git clone https://github.com/chxuan/vimplus.git ~/.vimplus
  cd ~/.vimplus
  ./install.sh <<!
3
!
  # TODO: 实现vimplus自动化 -- 需要PlugInstall
  cd ~/.vim/plugged/YouCompleteMe
  /usr/bin/python3 ./install.py
  cd ~
}

config_python() {
  sudo apt-get install -y python3-pip
  sudo /usr/bin/pip3 install virtualenv
}

config_sqlite() {
  sudo apt install -y sqlite3 sqlite3-doc
}

config_docker() {
  curl -fsSL https://get.docker.com | bash -s docker
  # curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
  sudo gpasswd -a ${USER} docker
  sudo systemctl restart docker
  sudo chmod a+rw /var/run/docker.sock
  sudo apt install -y docker-compose
  # NOTE: 设置备份路径
  test -d "/home/${CLOUD_USERNAME}/backup/docker_volume/" || mkdir /home/${CLOUD_USERNAME}/backup/docker_volume/
}

config_supervisor() {
  sudo apt-get install -y supervisor
  sudo systemctl enable supervisor
  sudo chmod -R 777 /var/log/supervisor
}

config_node() {
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
  echo 'export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
' >>~/.zshrc
  # nvm install node # NOTE: 当前安装v19.0.0
}

install_tiny_tool() {
  echo "安装tldr..."
  sudo apt install -y tldr
  echo "安装tmux..."
  sudo apt install -y tmux
  echo "安装rename..."
  sudo apt install -y rename
  echo "安装cmatrix,cowsay,ninvaders,moon-buggy..."
  sudo apt install -y cmatrix cowsay ninvaders moon-buggy
  echo "安装neofetch..."
  sudo apt install -y neofetch
  echo "安装net-tools..."
  sudo apt install -y net-tools
  echo "安装figlet,toilet..."
  sudo apt install -y figlet toilet
  echo "安装croc..."
  curl https://getcroc.schollz.com | bash
  echo "安装ffsend..."
  sudo snap install ffsend
  echo "安装you-get..."
  sudo /usr/bin/pip3 install you-get
  echo "安装rsync..."
  sudo apt-get install -y rsync
  echo "安装asciinema..."
  sudo apt install -y asciinema
  echo "安装bpytop,htop..."
  sudo snap install -y bpytop htop
  echo "安装trash-cli..."
  sudo apt install -y trash-cli
  echo "安装w3m..."
  sudo apt install -y w3m
  echo "安装transmission"
  sudo apt install -y transmission-cli

  echo "DONE!"
}

install_vscode() {
  curl -fsSL https://code-server.dev/install.sh | sh
  mkdir -p ~/.config/code-server
  echo "bind-addr: 0.0.0.0:5299
auth: password
password: ${CLOUD_PASSWORD}
cert: false 
" >~/.config/code-server/config.yaml
  sudo systemctl enable --now code-server@${CLOUD_USERNAME}
  /usr/bin/code-server --install-extension ms-python.python            # Python
  /usr/bin/code-server --install-extension esbenp.prettier-vscode      # Prettier
  /usr/bin/code-server --install-extension dbaeumer.vscode-eslint      # ESLint
  /usr/bin/code-server --install-extension ms-azuretools.vscode-docker # Docker
  /usr/bin/code-server --install-extension p1c2u.docker-compose        # Docker-Compose
  echo "DONE!"
}

update_myself() {
  rm ~/deploy.sh
  wget https://raw.githubusercontent.com/HenryJi529/OpenMorningstar/main/scripts/deploy/deploy.sh -P ~/
  chmod +x ~/deploy.sh
}

full_process() {
  print_step() {
    echo "=============================================================="
    echo "$1"
    read -s -n1 -p "按任意键继续..."
    echo ""
  }
  print_step "换中国源..."
  change_cn_source
  print_step "配置远程连接..."
  config_remote_connect
  print_step "配置shell..."
  config_shell
  print_step "配置Git..."
  config_git
  print_step "配置Python..."
  config_python
  print_step "配置Sqlite..."
  config_sqlite
  print_step "配置Docker..."
  config_docker
  print_step "配置Supervisor..."
  config_supervisor
  print_step "配置Node..."
  config_node
  print_step "安装小工具..."
  install_tiny_tool
  print_step "安装VScode..."
  install_vscode
  print_step "配置VIM..."
  config_vim
}

main() {
  echo "执行操作: 
{{持续维护相关：}}
u. 更新脚本...;
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
0. 完整流程...;
1. 修改密码...;
2. 切换中国镜像...;
3. 配置远程连接...;
4. 配置shell...;
5. 配置Git...;
6. 配置VIM...;
7. 配置Python...;
8. 配置Sqlite...;
9. 配置Docker...;
10.配置Supervisor...;
11.配置Node...;
12.安装小工具...;
13.安装VScode...;
===============================
"
  read -p "输入序号(u | 0-13): " order
  case $order in
  u) update_myself ;;
  0) full_process ;;
  1) change_password ;;
  2) change_cn_source ;;
  3) config_remote_connect ;;
  4) config_shell ;;
  5) config_git ;;
  6) config_vim ;;
  7) config_python ;;
  8) config_sqlite ;;
  9) config_docker ;;
  10) config_supervisor ;;
  11) config_node ;;
  12) install_tiny_tool ;;
  13) install_vscode ;;
  *) echo "error input" ;;
  esac
}
if [ $# -eq 1 ]; then
  if [ $1 == "u" ]; then
    echo "更新脚本..."
    update_myself
  else
    exit 1
  fi
  exit 0
fi
main
echo "DONE!"
