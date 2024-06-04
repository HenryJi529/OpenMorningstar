from .common import *

SECRET_KEY = "django-insecure-o29$)y=p*bnwu!uqa8!@$w)l1gz#n@=%&&ze+xur%w)799)4%8"
DEBUG = True
ALLOWED_HOSTS = ["*"]


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "database/morningstar.sqlite3",
    }
}


"""邮件"""
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


"""缓存"""
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "CONNECTION_POOL_KWARGS": {"max_connections": 1000, "encoding": "utf-8"},
            "PASSWORD": "1234asdw",
        },
    }
}


""" RECAPTCHA-V2"""
RECAPTCHA_PUBLIC_KEY = "6Le20wwdAAAAAKjy3eAJ8BPLN59KDRrRBeslsqpw"
RECAPTCHA_PRIVATE_KEY = "6Le20wwdAAAAAIyF33a5fiD-PJ7uioonJQ9ycilI"


"""压缩css/js"""
COMPRESS_ENABLED = False


"""跨站资源共享"""  # NOTE: 先判定regex
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https?://127\.0\.0\.1:(?:\d+)?$",
    r"^http?://localhost:(?:\d+)?$",
]
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:8000",  # NOTE: 后端测试专用
# ]


""" 添加测试环境的配置 """
try:
    from .test import *
except:
    pass
