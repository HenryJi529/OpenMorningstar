<div align="center">
	<h1>Open Morningstar 👋</h1>
	<a href="https://github.com/HenryJi529/OpenMorningstar/actions/workflows/django.yml">
		<img src="https://github.com/HenryJi529/OpenMorningstar/actions/workflows/django.yml/badge.svg"
			alt="Django CI" />
	</a>
	<a href="https://github.com/HenryJi529/OpenMorningstar/blob/main/scripts/deploy/docker-compose.yml">
		<img src="https://img.shields.io/badge/docker-passing-brightgreen"
			alt="Docker Passing" />
	</a>
	<a href="https://morningstar369.com/coverage/">
		<img src="https://img.shields.io/badge/coverage-click-brightgreen"
			alt="Coverage Badge" />
	</a>
	<a href="https://github.com/HenryJi529/OpenMorningstar/graphs/commit-activity">
		<img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg"
			alt="Maintenance" />
	</a>
	<a href="https://github.com/HenryJi529/OpenMorningstar/releases">
		<img src="https://img.shields.io/github/v/tag/HenryJi529/OpenMorningstar"
			alt="Release Version" />
	</a>
	<br>
	<a href="https://github.com/HenryJi529/OpenMorningstar/blob/main/LICENSE">
		<img src="https://img.shields.io/badge/License-AGPLv3-yellow.svg"
			alt="License Badge" />
	</a>
	<a href="https://github.com/HenryJi529/OpenMorningstar/pulls">
		<img src="https://img.shields.io/github/issues-pr/HenryJi529/OpenMorningstar" alt="Pull Requests Badge"/>
	</a>
	<a href="https://github.com/HenryJi529/OpenMorningstar/issues">
		<img src="https://img.shields.io/github/issues/HenryJi529/OpenMorningstar" alt="Issues Badge"/>
	</a>
	<a href="https://github.com/HenryJi529/OpenMorningstar/graphs/contributors">
		<img alt="GitHub contributors" src="https://img.shields.io/github/contributors/HenryJi529/OpenMorningstar?color=2b9348">
	</a>
	<a href="https://github.com/HenryJi529/OpenMorningstar/stargazers">
		<img src="https://img.shields.io/github/stars/HenryJi529/OpenMorningstar" alt="Stars Badge"/>
	</a>
	<a href="https://github.com/HenryJi529/OpenMorningstar/network/members">
		<img src="https://img.shields.io/github/forks/HenryJi529/OpenMorningstar" alt="Forks Badge"/>
	</a>
	<a href="#">
		<img src="https://visitor-badge.laobi.icu/badge?page_id=HenryJi529.OpenMorningstar"
			alt="Visitors" />
	</a>
	<a href="https://github.com/HenryJi529/OpenMorningstar/stargazers">
		<img src="https://img.shields.io/static/v1?label=%F0%9F%8C%9F&message=If%20Useful&style=style=flat&color=BC4E99" alt="Please Star Badge"/>
	</a>
</div>


## ✨ 技术栈:

- **前端**：CSS, Sass, TailwindCSS, DaisyUI, JavaScript, TypeScript
- **后端**：Django, Redis, MySQL
- **部署**：Docker, Nginx, Fabric, Supervisor
- **测试**：unittest(py), Coverage
- **集成**：Github Action


## 🚀 开发&部署

### 源码获取

```bash
$ git clone git@github.com:HenryJi529/OpenMorningstar.git
# or: git clone https://hub.fastgit.xyz/HenryJi529/OpenMorningstar.git
```

### 本地开发

**`/task.sh`中已提供常见的开发快捷方式...**

```bash
$ virtualenv VENV --python python3.9
$ source VENV/bin/activate
$ python scripts/dep/dependencyManager.py install --verbose
$ python manage.py runserver 0:8000
```

### 远程部署

**`/task.sh`中已提供常见的部署快捷方式...**

1. 通用部署方式
	```bash
	$ docker-compose -f scripts/deploy/docker-compose.yml up --build -d
	```

2. [本站](https://morningstar369.com)部署方式(需裸机环境)
	1. 部署基础环境: 通过scp传输`.env`与`scripts/deploy/deploy.sh`, 执行`deploy.sh`从而
		- 安装oh-my-bash
		- 安装vim与vimPlus
		- 安装code-server
		- 安装docker与docker-compose
		- 安装supervisor
		- 安装nvm与node
		- 安装其他生产力工具
	2. 通过`task.sh`中的`upgradeProd`完成后续的自动化部署


## 🙈 欢迎支持(~~宗旨是不退款！~~)

|    微信    |    支付宝    |    小荷包    |
| :-------: | :-------: | :-------: |
| <img src="https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/Morningstar/static/base/img/微信收款码.png" alt="Wechat" width="150"> | <img src="https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/Morningstar/static/base/img/支付宝收款码.png" alt="Alipay" width="150"> | <img src="https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/Morningstar/static/base/img/小荷包收款码.png" alt="PiggyBank" width="150"> |


## 🙏 感谢
<a href="https://www.djangoproject.com/">
	<img width="20%"
		src="https://www.vectorlogo.zone/logos/djangoproject/djangoproject-icon.svg"
		alt="django">
</a>
<a href="https://www.freecodecamp.org/">
	<img width="23%"
		src="https://cdn.jsdelivr.net/gh/fizzed/font-mfizz@master/src/svg/freecodecamp.svg"
		alt="freecodecamp">
</a>
<a href="https://www.jetbrains.com/">
	<img width="25%"
		src="https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/Morningstar/static/base/img/pycharm.svg"
		alt="pycharm">
</a>


## 📝 许可证

Copyright © 2022 *[Henry Ji](https://github.com/HenryJi529)*.<br/>
This project is [AGPL v3](https://raw.githubusercontent.com/HenryJi529/OpenMorningstar/main/LICENSE) licensed.
