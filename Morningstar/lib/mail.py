from django.core.mail import send_mail

from Morningstar.settings.common import EMAIL_HOST_USER


def send_mail_from_host(subject, message, email_list):
    send_mail(subject, message, EMAIL_HOST_USER, email_list)
