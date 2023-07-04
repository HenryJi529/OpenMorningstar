cd /app

# 更新Python依赖...
python3 -m pip install -r /app/requirements-prod.txt
# 更新并迁移JavaScript依赖...
yarn install --production
test -d "/app/static" || mkdir /app/static
rsync -a /app/node_modules /app/static
# 迁移数据库
python3 manage.py makemigrations --settings=Morningstar.settings.production
python3 manage.py migrate --settings=Morningstar.settings.production
# 定时任务启动
service cron start
test -d "/app/log" || mkdir /app/log
touch /app/log/cron.log && python3 manage.py crontab add --settings=Morningstar.settings.production
# 更新检索
python3 manage.py rebuild_index --settings=Morningstar.settings.production --noinput
# 收集静态
python3 manage.py collectstatic --settings=Morningstar.settings.production --noinput

# 初始时需创建超级管理员
# python3 manage.py createsuperuser --settings=Morningstar.settings.production
