cd /app

# 更新Python依赖...
python3 -m pip install -U pip
python3 -m pip install -r /app/requirements-prod.txt
# 更新并迁移JavaScript依赖...
yarn install --production
rsync -a /app/node_modules /app/static
# 迁移数据库
python3 manage.py makemigrations --settings=Morningstar.settings.production
python3 manage.py migrate --settings=Morningstar.settings.production
# 定时任务启动
service cron start
python3 manage.py crontab add --settings=Morningstar.settings.production
# 更新检索
python3 manage.py rebuild_index --settings=Morningstar.settings.production --noinput
# 收集静态
python3 manage.py collectstatic --settings=Morningstar.settings.production --noinput
# 加载/检测AI模型(参数)
python3 apps/recognizer/lib/model_handler.py
# 初始时需创建超级管理员
# python3 manage.py createsuperuser --settings=Morningstar.settings.production
