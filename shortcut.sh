DOMAIN="morningstar529.com"

runCommand() {
	fab -H jeep_jipu@server.${DOMAIN} -r scripts/fabric -p $1
}

# 检视信息
check() {
	runCommand check --prompt-for-login-password
}

# 本地开发
dev() {
	# python scripts/initialize/main.py # 开发测试数据生成
	python manage.py makemigrations && python manage.py migrate
	python manage.py rebuild_index --noinput
	# python manage.py crontab add # 启动定时任务
	python manage.py runserver 0:8000
}

# 代码测试
coverage() {
	COVERAGE=$(pwd)/env/bin/coverage
	${COVERAGE} erase --rcfile=scripts/coverage/.coveragerc
	${COVERAGE} run --rcfile=scripts/coverage/.coveragerc manage.py test Morningstar/ apps/ --failfast --keepdb
	${COVERAGE} report --rcfile=scripts/coverage/.coveragerc
	${COVERAGE} html --rcfile=scripts/coverage/.coveragerc
	live-server _vercel/_coverage
}

# 更新依赖
updateDep() {
	echo "更新pip版本..."
	pip install -U pip
	# gcc scripts/dep/updateOutdatedDep.c -lpthread -o scripts/dep/updateOutdatedDep.exe
	echo "更新依赖..."
	./scripts/dep/updateOutdatedDep.exe
	read -s -n1 -p "按任意键继续..."
	echo ""
	echo "保存依赖配置..."
	pip freeze >requirements.txt && pip freeze >deploy/django/requirements.txt
	pipdeptree -fl >pipdeptree.txt
}

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

# 远程同步
updateProd() {
	runCommand update
}

# 整体更新
upgradeProd() {
	runCommand upgrade
}

# 数据备份
backupProd() {
	runCommand backup
}

# 数据还原
restoreProd() {
	runCommand restore
}

# 生成压缩包
archiveMain() {
	git archive --format=tar main | gzip >release/main.tar.gz
}

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

backupDockerVolume() {
	runCommand backupDockerVolume
}

restoreDockerVolume() {
	runCommand restoreDockerVolume
}

publicPackage() {
	echo "更新生产环境下的容器..."
	runCommand updatePackage
	echo "更新开发环境下的容器..."
	read -s -n1 -p "按任意键继续..."
	docker compose -f deploy/example_dev.yml up --build -d
	docker push henry529/dev
	docker tag henry529/dev ghcr.io/henryji529/morningstar-dev && docker push ghcr.io/henryji529/morningstar-dev
	docker tag henry529/dev dockerhub.${DOMAIN}/morningstar-dev && docker push dockerhub.${DOMAIN}/morningstar-dev
}

publicVercel() {
	path="_vercel"
	for project in $(ls $path); do
		echo "updating \"$project\"..."
		cd $path/$project
		vercel --prod
		cd ../../
		echo ""
	done
}

publicLedger() {
	runCommand updateLedger
}

#==================================================================

cat <<_haibara_
$(figlet Morningstar)
_haibara_

echo "运行命令:
============================================================
a. backupDockerVolume();
b. restoreDockerVolume();
c. publicPackage();
d. publicVercel();
e. publicLedger();
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
0. check();
1. dev();
2. coverage();
3. updateDep();
4. updateProd();
5. upgradeProd();
6. backupProd();
7. restoreProd();
8. archiveMain();
"
read -p "输入序号(a-e|0-8): " order

start_time=$(date +%s)

# NOTE: 虚拟环境几乎是必须的
source $(pwd)/env/bin/activate

case $order in
a) backupDockerVolume ;;
b) restoreDockerVolume ;;
c) publicPackage ;;
d) publicVercel ;;
e) publicLedger ;;
# ==========================
0) check ;;
1) dev ;;
2) coverage ;;
3) updateDep ;;
4) updateProd ;;
5) upgradeProd ;;
6) backupProd ;;
7) restoreProd ;;
8) archiveMain ;;
*) echo "输入错误" ;;
esac
end_time=$(date +%s)
during=$((end_time - start_time))
echo "\033[33m总运行时间: $during 秒\033[0m"
fortune | lolcat
