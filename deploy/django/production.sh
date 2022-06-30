cd /app
service cron start
python3 manage.py makemigrations --settings=Morningstar.settings.production
python3 manage.py migrate --settings=Morningstar.settings.production
touch /app/log/cron.log && python3 manage.py crontab add --settings=Morningstar.settings.production
python3 manage.py rebuild_index --settings=Morningstar.settings.production --noinput
python3 manage.py collectstatic --settings=Morningstar.settings.production --noinput

# 初始时需创建超级管理员
# python3 manage.py createsuperuser --settings=Morningstar.settings.production
