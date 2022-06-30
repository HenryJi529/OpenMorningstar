echo "---------------------Install Mysql---------------------"
sudo apt install -y mysql-server mysql-client libmysqlclient-dev
sudo mysql_secure_installation

echo "---------------------Mess Mysql---------------------"
# 列出数据库:
docker exec -it morningstar-mysql mysql -u root -p********* \
	-e "show databases;"
# 显示user和host
docker exec -it morningstar-mysql mysql -u root -p********* \
	-e "SELECT User, Host FROM mysql.user;"
# 创建用户和数据库
docker exec -it morningstar-mysql mysql -u root -p********* \
	-e "create user 'ghelper'@'%' identified by '1234asdw';"
docker exec -it morningstar-mysql mysql -u root -p********* \
	-e "create database ghelperdb;"
docker exec -it morningstar-mysql mysql -u root -p********* \
	-e "grant all privileges on ghelperdb.* to 'ghelper'@'%';"

1. "show databases;"
2. "drop database audiodb;"
3. "drop user audio;"
4. "flush privileges;"
