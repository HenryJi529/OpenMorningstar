from django.core.mail import send_mail

from Morningstar.settings.common import EMAIL_HOST_USER
from Morningstar.settings.common import EMAIL_TEMPLATE_TEXT


def send_mail_from_host(subject, message, email_list):
    response = send_mail(subject, message, EMAIL_HOST_USER, email_list)
    return response


def send_mail_from_host_by_template(email_list, template, template_param_list):
    subject = EMAIL_TEMPLATE_TEXT[template]['subject']
    message = EMAIL_TEMPLATE_TEXT[template]['message'](*template_param_list)
    response = send_mail(subject, message, EMAIL_HOST_USER, email_list)
    return response


