# 加载环境变量
source .env

PIP=$(pwd)/VENV/bin/pip
PYTHON=$(pwd)/VENV/bin/python
PIPDEPTREE=$(pwd)/VENV/bin/pipdeptree

runRemoteCommand() {
	fab -H $CLOUD_USERNAME@${PUBLIC_IP} -r scripts/deploy/_fabric -p $1
}

# 简单运行
serve() {
	echo "启动django-server..."
	python manage.py runserver 127.0.0.1:8000
}

# 本地开发
dev() {
	echo "同步JavaScript模块..."
	rsync -a ./node_modules ./Morningstar/static
	echo "==================================="
	echo "迁移模型到数据库..."
	python manage.py makemigrations && python manage.py migrate
	echo "==================================="
	echo "重建索引..."
	python manage.py rebuild_index --noinput
	echo "==================================="
	# echo "启动定时任务..."
	# python manage.py crontab add
	# echo "==================================="
	echo "编译CSS/JS库..."
	npm run build &
	# bash scripts/build/build_sass.sh & # NOTE: 可用live-sass-compiler替换
	echo "==================================="
	# echo "获取静态文件..."
	# python manage.py collectstatic --noinput
	# echo "==================================="
	echo "启动django-server..."
	python manage.py runserver 0:8000
}

# 初始化数据
initialize() {
	python scripts/initialize/main.py
}

# 代码测试
coverage() {
	COVERAGE=$(pwd)/VENV/bin/coverage
	${COVERAGE} erase --rcfile=scripts/coverage/.coveragerc
	${COVERAGE} run --rcfile=scripts/coverage/.coveragerc manage.py test Morningstar/ apps/ --failfast --noinput
	${COVERAGE} report --rcfile=scripts/coverage/.coveragerc
	${COVERAGE} html --rcfile=scripts/coverage/.coveragerc
	live-server scripts/deploy/nginx/www/coverage
}

# 更新依赖
updateDep() {
	echo "JavaScript: 更新版本..."
	npx ncu -u
	npm update
	echo "==================================="
	echo "Python: 更新依赖..."
	${PYTHON} scripts/dep/dependencyManager.py upgrade --verbose
	${PYTHON} scripts/dep/dependencyManager.py export --verbose
	${PIPDEPTREE} -fl >pipdeptree.txt
	echo "==================================="
	echo "DONE!!!"
}

# 更新Django
updateDjango() {
	runRemoteCommand updateDjango
}

# 更新nginx(配置及前端代码)
updateNginx() {
	runRemoteCommand updateNginx
}

# 整体更新
updateAll() {
	runRemoteCommand updateAll
}

# 数据备份
backupProd() {
	# 数据库备份
	runRemoteCommand backupDatabase
	# 备份volume为压缩包
	runRemoteCommand backupDockerVolume
	# 同步压缩包到本地
	rsync -avz ${CLOUD_USERNAME}@server.morningstar369.com:~/backup/docker_volume ./database/
}

# 数据还原
restoreProd() {
	# 数据库还原
	runRemoteCommand restoreDatabase
	# 同步压缩包到远处
	rsync -avz ./database/docker_volume ${CLOUD_USERNAME}@server.morningstar369.com:~/backup/
	# 复原压缩包为volume
	runRemoteCommand restoreDockerVolume
}

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

# 发布源码和插件压缩包
publicArchive() {
	time=$(date "+%Y-%m-%d")
	# 压缩源代码
	git archive --format=tar main | gzip >release/main_${time}.tar.gz
	# 打包插件
	cd extension && make build && cd ..
	zip -r release/extension_${time}.zip extension/dist/*
}

# 发布Docker Image
publicPackage() {
	echo "更新生产环境下的容器..."
	runRemoteCommand updatePackage
	read -s -n1 -p "按任意键继续..."
	echo ""
	echo "==================================="
	echo "更新开发环境下的容器..."
	docker compose -f scripts/deploy/example_dev.yml up --build -d
	docker push henry529/dev
	docker tag henry529/dev ghcr.io/henryji529/morningstar-dev && docker push ghcr.io/henryji529/morningstar-dev
}

# 同步账本
syncLedger() {
	runRemoteCommand syncLedger
}

# 检视信息
check() {
	runRemoteCommand check --prompt-for-login-password
}

#==================================================================

cat <<_haibara_
$(figlet Morningstar)
_haibara_

echo "运行命令:
============================================================
a. publicArchive();
b. publicPackage();
c. syncLedger();
d. check();
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
0. serve();
1. dev();
2. initialize();
3. coverage();
4. updateDep();
5. updateDjango();
6. updateNginx();
7. updateAll();
8. backupProd();
9. restoreProd();
"
read -p "输入序号(a-d|0-9): " order

start_time=$(date +%s)

# NOTE: 虚拟环境几乎是必须的
source $(pwd)/VENV/bin/activate

case $order in
a) publicArchive ;;
b) publicPackage ;;
c) syncLedger ;;
d) check ;;
# ==========================
0) serve ;;
1) dev ;;
2) initialize ;;
3) coverage ;;
4) updateDep ;;
5) updateDjango ;;
6) updateNginx ;;
7) updateAll ;;
8) backupProd ;;
9) restoreProd ;;
*) echo "输入错误" ;;
esac
end_time=$(date +%s)
during=$((end_time - start_time))
echo "\033[33m总运行时间: $during 秒\033[0m"
fortune | lolcat
