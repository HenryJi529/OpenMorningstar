# 自动化安装脚本

1. oh-my-zsh

```bash
$ sh -c "$(wget https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/deploy/_install/oh-my-zsh.sh -O -)"
```

2. oh-my-bash

```bash
$ sh -c "$(wget https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/deploy/_install/oh-my-bash.sh -O -)"
```

3. install-v2ray

```bash
$ su - root <<!
$ROOT_PASSWORD
wget https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/deploy/_install/v2ray.sh && bash v2ray.sh
!
$ su - root <<!
$ROOT_PASSWORD
v2ray url
!
```
