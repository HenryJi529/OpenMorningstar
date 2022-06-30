from django import forms
from captcha.fields import ReCaptchaField

class VerifyForm(forms.Form):
    captcha = ReCaptchaField(label="人机验证")