from .common import *
import os

"""一系列安全措施"""
# NOTE: 检测方法: python3 manage.py check --settings=Morningstar.settings.production --deploy
X_FRAME_OPTIONS = 'SAMEORIGIN'  # NOTE: 这是用来支持同源的iframe 一般用'DENY'
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True


SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
MYSQL_ROOT_PASSWORD = os.environ['MYSQL_ROOT_PASSWORD']
REDIS_PASSWORD = os.environ['REDIS_PASSWORD']
DEBUG = False
ALLOWED_HOSTS = ['morningstar529.com', '35.220.252.85']
CSRF_TRUSTED_ORIGINS = ['https://morningstar529.com']


"""邮件"""
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'djangodb',
        'USER': 'root',
        'PASSWORD': MYSQL_ROOT_PASSWORD,
        'HOST': 'db1',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        },
    }
}

"""缓存"""
CACHE_TIMEOUT = 60 * 5
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://redis:6379",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "CONNECTION_POOL_KWARGS": {
                "max_connections": 1000,
                "encoding": 'utf-8'
            },
            "PASSWORD": REDIS_PASSWORD
        }
    }
}

"""静态文件加速"""
STATIC_URL = '/static/'

"""RECAPTCHA-V2"""
RECAPTCHA_DOMAIN = 'www.recaptcha.net'
RECAPTCHA_PUBLIC_KEY = os.environ['RECAPTCHA_PUBLIC_KEY']
RECAPTCHA_PRIVATE_KEY = os.environ['RECAPTCHA_PRIVATE_KEY']

"""维护中站点列表"""
MAINTENANCE_URL_LIST = [
    "/joke/",
]

"""压缩css/js"""
COMPRESS_ENABLED = True