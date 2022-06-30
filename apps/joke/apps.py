from django.apps import AppConfig


class JokeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'joke'
    verbose_name = '笑话'
