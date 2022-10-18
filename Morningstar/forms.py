from django import forms
from captcha.fields import ReCaptchaField
from django.core.validators import RegexValidator 
from django.core.exceptions import ValidationError  # NOTE: 此方法可能导致引用未知字段的错误
from django_redis import get_redis_connection
import random
import re

from .models import User

FAKE_USERNAME = "xiaoming"
FAKE_EMAIL = "2333@x.com"
FAKE_PASSWORD = "********"


class LoginForm(forms.Form):
    identity = forms.CharField(label="账户", initial="", required=True, widget=forms.TextInput(attrs={"placeholder": "用户名/邮箱/手机号", "class": "w-full"}))
    password = forms.CharField(label="密码", widget=forms.PasswordInput(attrs={"placeholder": "********", "class": "w-full"}, render_value=True), required=True)
    image_captcha = forms.CharField(label='人机验证',required=True, widget=forms.TextInput(attrs={"placeholder": "XXXXXX", "class": "w-full"},))

    def __init__(self, request, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.request = request
        for name, field in self.fields.items():
            if 'class' in field.widget.attrs:
                field.widget.attrs['class'] += ' input'
            else:
                field.widget.attrs['class'] = 'input'

    def clean_identity(self):
        identity = self.cleaned_data['identity']
        
        if re.match('^(1[3|4|5|6|7|8|9])\d{9}$',identity):
            self.login_method = "phone"
        elif re.search('@',identity):
            self.login_method = "email"
        else:
            self.login_method = "username"

        return identity

    def clean_image_captcha(self):
        image_captcha = self.cleaned_data['image_captcha']
        request = self.request

        session_key = request.session._session_key

        conn = get_redis_connection("default")
        redis_image_captcha = conn.get(f'{session_key}-image-captcha')

        if not redis_image_captcha:
            self.add_error('image_captcha', '图片验证码失效，请重新发送')

        if image_captcha.strip().upper() != str(redis_image_captcha.decode()).upper():
            self.add_error('image_captcha', '验证码错误，请重新输入')

        return image_captcha


class RegisterForm(forms.Form):
    username = forms.CharField(label="用户名", required=True, 
        widget=forms.TextInput(attrs={"placeholder": FAKE_USERNAME, "class": "w-full"})
        )

    email = forms.EmailField(label="邮箱", required=True, 
        widget=forms.EmailInput(attrs={"placeholder": FAKE_EMAIL, "class": "w-full"}),
        validators=[RegexValidator(r'^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$', '邮箱格式错误'),]
        )

    password = forms.CharField(label='密码', required=True, 
        widget=forms.PasswordInput(attrs={"placeholder": FAKE_PASSWORD, "class": "w-full"}),
        validators=[RegexValidator(r'^[\w_]*$', '密码中只能包含数字、字母下划线'),],
        min_length=6,
        max_length=16,
        error_messages={
            'min_length': "密码长度不能小于6个字符",
            'max_length': "密码长度不能大于16个字符"
        },
        )

    confirm_password = forms.CharField(label='重复密码',required=True,
        widget=forms.PasswordInput(attrs={"placeholder": FAKE_PASSWORD, "class": "w-full"}),
        min_length=6,
        max_length=16,
        error_messages={
            'min_length': "密码长度不能小于6个字符",
            'max_length': "密码长度不能大于16个字符"
        },
        )

    captcha = ReCaptchaField(label="人机验证")

    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        for name, field in self.fields.items():
            if 'class' in field.widget.attrs:
                field.widget.attrs['class'] += ' input'
            else:
                field.widget.attrs['class'] = 'input'

    def clean_username(self):
        username = self.cleaned_data['username']
        if User.objects.filter(username=username).exists():
            self.add_error('username', '此用户名已注册')
        return username

    def clean_email(self):
        email = self.cleaned_data['email']

        if email == FAKE_EMAIL:
            return email

        if User.objects.filter(email=email).exists():
            self.add_error('email', '此邮箱已注册')
        return email

    def clean_confirm_password(self):
        password = self.cleaned_data.get('password')
        confirm_password = self.cleaned_data['confirm_password']
        if not password:
            return confirm_password
        
        if password != confirm_password:
            self.add_error('confirm_password', '两次密码不一致')

        return confirm_password


class InfoForm(forms.Form):
    nickname = forms.CharField(label='昵称', widget=forms.TextInput(attrs={"class": "w-full"}))
    bio = forms.CharField(label='个人介绍', widget=forms.Textarea(attrs={"class": "textarea w-full", "rows": 4}))
    avatar = forms.ImageField(label='头像', required=False, widget=forms.FileInput(attrs={"class": "absolute cursor-pointer w-full", "style": "opacity: 0;"}))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            if name in ["bio", "avatar"]:
                continue
            if 'class' in field.widget.attrs:
                field.widget.attrs['class'] += ' input input-bordered'
            else:
                field.widget.attrs['class'] = 'input input-bordered'


class UpdateEmailForm(forms.Form):
    email = forms.EmailField(label="邮箱", validators=[RegexValidator(r'^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$', '邮箱格式错误'),])
    email_code = forms.CharField(label='验证码', validators=[RegexValidator(r'^\d{6}$', '验证码格式错误'), ])

    def clean_email_code(self):
        email = self.cleaned_data['email']
        email_code = self.cleaned_data['email_code']

        conn = get_redis_connection("default")
        redis_email_code = conn.get(f'{email}-chemail')
        if not redis_email_code:
            self.add_error('email_code', '验证码超时')
        if email_code == str(redis_email_code.decode()):
            return email
        else:
            self.add_error('email_code', '验证码错误，请重新输入')


class UpdatePhoneForm(forms.Form):
    phone = forms.CharField(label='手机号', validators=[RegexValidator(r'^(1[3|4|5|6|7|8|9])\d{9}$', '手机号格式错误'), ])
    phone_code = forms.CharField(label='验证码', validators=[RegexValidator(r'^\d{6}$', '验证码格式错误'), ])

    def clean_phone_code(self):
        phone = self.cleaned_data['phone']
        phone_code = self.cleaned_data['phone_code']

        conn = get_redis_connection("default")
        redis_phone_code = conn.get(f'{phone}-chphone')
        if not redis_phone_code:
            self.add_error('phone_code', '验证码超时')
        if phone_code == str(redis_phone_code.decode()):
            return phone
        else:
            self.add_error('phone_code', '验证码错误，请重新输入')


class UpdatePasswordForm(forms.Form):
    password = forms.CharField(label='密码', required=True, 
        widget=forms.PasswordInput(attrs={"placeholder": FAKE_PASSWORD, "class": "w-full"}),
        validators=[RegexValidator(r'^[\w_]*$', '密码中只能包含数字、字母下划线'),],
        min_length=6,
        max_length=16,
        error_messages={
            'min_length': "密码长度不能小于6个字符",
            'max_length': "密码长度不能大于16个字符"
        },
        )

    confirm_password = forms.CharField(label='重复密码',required=True,
        widget=forms.PasswordInput(attrs={"placeholder": FAKE_PASSWORD, "class": "w-full"}),
        min_length=6,
        max_length=16,
        error_messages={
            'min_length': "密码长度不能小于6个字符",
            'max_length': "密码长度不能大于16个字符"
        },
        )

    def clean_confirm_password(self):
        password = self.cleaned_data.get('password')
        confirm_password = self.cleaned_data['confirm_password']
        if not password:
            return confirm_password
        
        if password != confirm_password:
            self.add_error('confirm_password', '两次密码不一致')

        return confirm_password