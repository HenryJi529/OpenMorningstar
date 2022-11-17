# 树莓派配置

## 字体问题
```bash
echo "LC_ALL=en_US.UTF-8" >> /etc/environment
echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf
locale-gen en_US.UTF-8
sudo apt update
```

## frpc.ini配置文件
```
[program:frpc]
directory = /opt/frp
command = ./frpc -c frpc.ini 
autostart = true
startsecs = 5
autorestart = false
startretries = 3
redirect_stderr = true
stdout_logfile_maxbytes = 20MB
stdout_logfile_backups = 20
stdout_logfile = /var/log/supervisor/frpc.log
```