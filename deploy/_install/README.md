# 自动化安装脚本

1. oh-my-zsh

```bash
$ sh -c "$(wget https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/deploy/_install/oh-my-zsh.sh -O -)"
```

2. Baota

```bash
install_Baota() {
  wget -O - https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/deploy/_install/baota.sh | sudo bash
  #关闭安全入口
  sudo rm -f /www/server/panel/data/admin_path.pl
  # 设置密码
  sudo bt <<!
5
$MORNINGSTAR_PASSWORD
!
  # 设置用户名
  sudo bt <<!
6
$MORNINGSTAR_USERNAME
!
}
```

3. oh-my-bash

```bash
$ sh -c "$(wget https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/deploy/_install/oh-my-bash.sh -O -)"
```

4. v2ray

```bash
$ su - root <<!
$ROOT_PASSWORD
sh -c "$(wget https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/deploy/_install/v2ray.sh -O -)"
!
$ su - root <<!
$ROOT_PASSWORD
v2ray url
!
```
