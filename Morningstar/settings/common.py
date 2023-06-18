"""
Django settings for Morningstar project.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

import sys
from pathlib import Path
import os
import colorama
import logging

# NOTE：解决force_str不兼容问题
import django
from django.utils.encoding import force_str

django.utils.encoding.force_text = force_str

# 加载第三方配置文件
from .jazzmin import *
from .haystack import *

# NOTE: 本项目的密钥保存方法如下
# 1. 开发与部署环境密钥相同时，开发密钥通过.env加载，部署密钥通过环境变量加载
# 2. 不相同时，开发密钥直接放入开发配置文件(dev.py)中，部署密钥仍通过环境变量加载
from dotenv import load_dotenv

env_path = os.getcwd() + "/.env"
load_dotenv(dotenv_path=env_path, verbose=True)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, os.path.join(BASE_DIR, "apps"))

AUTH_USER_MODEL = "Morningstar.User"
ROOT_URLCONF = "Morningstar.urls"
WSGI_APPLICATION = "Morningstar.wsgi.application"

DOMAIN = "morningstar369.com"

"""应用列表"""
INSTALLED_APPS = [
    "Morningstar.apps.BaseConfig",  # 基本
    "apps.blog.apps.BlogConfig",  # 博客
    "apps.book.apps.BookConfig",  # 书籍
    "apps.formula.apps.FormulaConfig",  # 公式
    "apps.game.apps.GameConfig",  # 游戏
    "apps.joke.apps.JokeConfig",  # 笑话
    "apps.lover.apps.LoverConfig",  # 爱人
    "apps.nav.apps.NavConfig",  # 导航
    "apps.poll.apps.PollConfig",  # 投票
    "apps.proxy.apps.ProxyConfig",  # 代理
    "apps.rss.apps.RssConfig",  # RSS
    "apps.share.apps.ShareConfig",  # 分享
    "captcha",  # google recaptcha
    "compressor",  # 压缩js
    "corsheaders",  # 处理跨域访问
    "debug_toolbar",  # 调试工具
    "django_crontab",  # 定时任务
    "django_user_agents",  # 处理用户代理
    "fontawesomefree",  # 字体图标
    "haystack",  # 搜索
    "import_export",  # 导入导出
    "jazzmin",  # UI定制
    "matomo",  # 网站分析
    "rest_framework",  # restful api
    "django.contrib.humanize",  # {% load humanize %}
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.messages",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.sitemaps",  # 站点地图
    # NOTE: 相当于在url中添加static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    "django.contrib.staticfiles",
]

"""中间价"""
MIDDLEWARE = [
    # The order of MIDDLEWARE is important.
    # You should include the Debug Toolbar middleware as early as possible in the list.
    # However, it must come after any other middleware that encodes the response’s content, such as GZipMiddleware
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # NOTE: 位置固定；
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django_user_agents.middleware.UserAgentMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.common.BrokenLinkEmailsMiddleware",  # 404邮箱提醒
    "Morningstar.middleware.block.BlockUserAgentMiddleware",  # UserAgent黑名单
    "Morningstar.middleware.maintenance.MaintenanceMiddleware",  # 维护中的站点重定向
]


"""跨站资源共享"""
CORS_ALLOW_ALL_ORIGINS = False


"""模版处理"""
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [  # BASE_DIR / 'templates', 减少根目录文件夹数量?
            os.path.join(BASE_DIR, "Morningstar", "templates")
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
            "builtins": [
                "django.templatetags.static",  # NOTE: 默认在模版中启用{%load static %}
            ],
        },
    },
]

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


"""语言与时区"""
# 语言
LANGUAGE_CODE = "zh-Hans"
# 时区
# datetime.datetime.now() - 东八区时间 / datetime.datetime.utcnow() => utc时间
USE_TZ = True  # NOTE: Django5.0起, 默认启用
TIME_ZONE = "Asia/Shanghai"

USE_I18N = True
# USE_L10N = True  # NOTE: Django5.0起, 此设置移除


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, "static")  # 收集静态
STATICFILES_DIRS = [  # NOTE: 除app/static/外的静态文件
    # os.path.join(BASE_DIR, 'Morningstar', 'static')
    BASE_DIR
    / "Morningstar"
    / "static"
]


# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


"""邮件"""
EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USER = "morningstar1.gcp@gmail.com"
try:
    EMAIL_HOST_PASSWORD = os.environ["EMAIL_HOST_PASSWORD"]
except KeyError:
    EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
EMAIL_PORT = 587
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = "morningstar1.gcp@gmail.com"
DEFAULT_GUEST_EMAIL = "guest@morningstar369.com"
SERVER_EMAIL = "morningstar1.gcp@gmail.com"
# 500
ADMINS = [("Henry", "jeep.jipu@gmail.com")]
# 404
MANAGERS = [("Henry", "jeep.jipu@gmail.com")]

EMAIL_TEMPLATE_TEXT = {
    "login": {
        "subject": "Morningstar - 登录",
        "message": lambda code: f"{code}为您的登录验证码。如非本人操作，请忽略本邮件。",
    },  # NOTE: 需要邮箱在数据库中存在
    "chpasswd": {
        "subject": "Morningstar - 改密",
        "message": lambda code: f"{code}为您的改密验证码。如非本人操作，请忽略本邮件。",
    },  # NOTE: 需要邮箱在数据库中存在
    "activate": {
        "subject": "Morningstar - 激活",
        "message": lambda code: f"{code}为您的激活验证码。如非本人操作，请忽略本邮件。",
    },
    "chemail": {
        "subject": "Morningstar - 换绑",
        "message": lambda code: f"{code}为您的换绑验证码。如非本人操作，请忽略本邮件。",
    },
}

"""腾讯云短信"""
TENCENT_SMS_APP_ID = 1400623801
try:
    TENCENT_SMS_APP_KEY = os.environ["TENCENT_SMS_APP_KEY"]
except KeyError:
    TENCENT_SMS_APP_KEY = os.getenv(key="TENCENT_SMS_APP_KEY")
TENCENT_SMS_SIGN = "嘉鱼居个人公众号"

TENCENT_SMS_TEMPLATE = {
    "login": 1278656,  # NOTE: 需要手机号在数据库中存在
    "chpasswd": 1278679,  # NOTE: 需要手机号在数据库中存在
    "register": 1278655,
    "chphone": 1576443,
}

TENCENT_SMS_TEMPLATE_TEXT = {
    "register": lambda code: f"{code}为您的注册验证码。如非本人操作，请忽略本短信。",
    "login": lambda code: f"{code}为您的登录验证码。如非本人操作，请忽略本短信。",
    "chpasswd": lambda code: f"{code}为您的改密验证码。如非本人操作，请忽略本短信。",
    "chphone": lambda code: f"{code}为您的换绑验证码。如非本人操作，请忽略本短信。",
}

"""日志系统"""
# 文档: https://docs.djangoproject.com/zh-hans/3.2/topics/logging/
# 原版: https://github.com/django/django/blob/main/django/utils/log.py
# 参考：https://docs.djangoproject.com/zh-hans/4.0/ref/logging/#default-logging-configuration
# Python日志: https://docs.python.org/zh-cn/3/library/logging.html#logrecord-objects


class FilterLevels(logging.Filter):
    def __init__(self, filter_levels=None):
        super(FilterLevels, self).__init__()
        self._filter_levels = filter_levels

    def filter(self, record):
        if record.levelname in self._filter_levels:
            return True
        return False


LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "filters": {
        "require_debug_true": {
            "()": "django.utils.log.RequireDebugTrue",
        },
        "require_debug_false": {
            "()": "django.utils.log.RequireDebugFalse",
        },
        "info_pass_filter": {
            "()": "Morningstar.settings.common.FilterLevels",
            "filter_levels": ["INFO"],
        },
    },
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
        "console": {
            "format": colorama.Fore.BLUE
            + colorama.Style.BRIGHT
            + "{levelname}: {asctime}:{name}:{message}"
            + colorama.Style.RESET_ALL,
            "style": "{",
        },
        "file": {
            "format": '{levelname}: {name} "{status_code} {message}"',
            "style": "{",
        },
        "django.server-info": {
            "format": colorama.Fore.YELLOW
            + colorama.Style.BRIGHT
            + "{levelname}: [{asctime}] {message}"
            + colorama.Style.RESET_ALL,
            "style": "{",
        },
        "django.server-warning": {
            "format": colorama.Fore.RED
            + colorama.Style.BRIGHT
            + "{levelname}: [{asctime}] {message}"
            + colorama.Style.RESET_ALL,
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "filters": ["require_debug_true"],
            "formatter": "console",
        },
        "django.server-info": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "django.server-info",
            "filters": ["info_pass_filter"],
        },
        "django.server-warning": {
            "level": "WARNING",
            "class": "logging.StreamHandler",
            "formatter": "django.server-warning",
        },
        "file": {
            "level": "INFO",
            "class": "logging.FileHandler",
            "filename": os.path.join(BASE_DIR, "log/", "django.log"),
            "formatter": "file",
        },
        "mail_admins": {
            "level": "ERROR",
            "class": "django.utils.log.AdminEmailHandler",
            "filters": ["require_debug_false"],
            "formatter": "file",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "propagate": True,
        },
        "django.request": {
            "handlers": ["file", "mail_admins"],
            "propagate": False,
        },
        "django.server": {
            # 只用于开发阶段
            "handlers": ["django.server-info", "django.server-warning"],
            "filters": ["require_debug_true"],
            "propagate": False,
        },
    },
}


"""Debug Toolbar"""
INTERNAL_IPS = [
    "127.0.0.1",
]

DEBUG_TOOLBAR_PANELS = [
    "debug_toolbar.panels.history.HistoryPanel",
    # 'debug_toolbar.panels.versions.VersionsPanel',
    "debug_toolbar.panels.timer.TimerPanel",
    "debug_toolbar.panels.settings.SettingsPanel",
    "debug_toolbar.panels.headers.HeadersPanel",
    "debug_toolbar.panels.request.RequestPanel",
    # 'debug_toolbar.panels.sql.SQLPanel',
    "debug_toolbar.panels.staticfiles.StaticFilesPanel",
    "debug_toolbar.panels.templates.TemplatesPanel",
    "debug_toolbar.panels.cache.CachePanel",
    "debug_toolbar.panels.signals.SignalsPanel",
    "debug_toolbar.panels.logging.LoggingPanel",
    "debug_toolbar.panels.redirects.RedirectsPanel",
    # 'debug_toolbar.panels.profiling.ProfilingPanel',
]

"""定时任务"""
CRONJOBS = [
    ("0 0 * * *", "Morningstar.cron.test", ">> " + str(BASE_DIR) + "/log/cron.log")
]


"""媒体设置"""
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"

"""静态文件"""
STATIC_URL = "/static/"
COMPRESS_ROOT = BASE_DIR / "static"  # 压缩css/js
STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
    # other finders..
    "compressor.finders.CompressorFinder",
)

"""用户代理"""
USER_AGENTS_CACHE = "default"

"""缓存"""
CACHE_TIMEOUT = (
    60 * 5
    if os.environ.get("DJANGO_SETTINGS_MODULE", "Morningstar.settings.dev")
    == "Morningstar.settings.production"
    else 5
)

"""Matomo"""
MATOMO_SITE_ID = 1
MATOMO_URL = "https://matomo.morningstar369.com/"

""" RECAPTCHA-V2"""
RECAPTCHA_DOMAIN = "www.recaptcha.net"
