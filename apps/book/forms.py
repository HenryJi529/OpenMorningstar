from django import forms
from django_recaptcha.fields import ReCaptchaField


class VerifyForm(forms.Form):
    captcha = ReCaptchaField(label="人机验证")
