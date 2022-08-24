from django import forms
from captcha.fields import ReCaptchaField
from django.core.validators import RegexValidator 
from django.core.exceptions import ValidationError  # NOTE: 此方法可能导致引用未知字段的错误
from django_redis import get_redis_connection
from Morningstar.settings.common import TENCENT_SMS_TEMPLATE
import random
import re
from .lib.sms import send_sms_single
from .models import User

FAKE_USERNAME = "xiaoming"
FAKE_EMAIL = "2333@x.com"
FAKE_PASSWORD = "********"


class LoginForm(forms.Form):
    identity = forms.CharField(
        label="账户", initial="", required=True, widget=forms.TextInput(attrs={"placeholder": "用户名/邮箱/手机号", "class": "w-full"}))
    password_login = forms.CharField(
        label="密码", widget=forms.PasswordInput(attrs={"placeholder": "********", "class": "w-full"}, render_value=True), required=True)
    image_captcha = forms.CharField(label='人机验证',required=True,
        widget=forms.TextInput(attrs={"placeholder": "XXXXXX", "class": "w-full"},)
    )

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


class SendSmsForm(forms.Form):
    phone = forms.CharField(label='手机号', validators=[RegexValidator(r'^(1[3|4|5|6|7|8|9])\d{9}$', '手机号格式错误'), ])

    def __init__(self, request, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.request = request


    def clean_phone(self):
        """ 手机号校验的钩子 """
        phone = self.cleaned_data['phone']
        request = self.request

        # 判断短信模板是否有问题
        tpl = request.POST.get('tpl')
        template_id = TENCENT_SMS_TEMPLATE.get(tpl)
        
        if not template_id:
            self.add_error('code', '短信模板错误') # NOTE: 不太可能出现...

        if tpl == "register":
            if User.objects.filter(phone=phone).exists():
                self.add_error('phone', '手机号已被注册')
        elif tpl == "login":
            if not User.objects.filter(phone=phone).exists():
                self.add_error('phone', '此手机号尚未被注册')

        code = random.randint(100000, 999999)

        # 发送短信
        res = send_sms_single(phone, template_id, [code, ])
        if res['result'] != 0:
            self.add_error('code', f"短信发送失败: {res['errmsg']}")

        # 保存到redis, 五分钟有效
        conn = get_redis_connection("default")
        conn.set(f'{phone}-register', code, ex=300)

        return phone


class RegisterForm(forms.Form):
    username = forms.CharField(
        label="用户名", required=True, widget=forms.TextInput(attrs={"placeholder": FAKE_USERNAME, "class": "w-full"}))

    email = forms.EmailField(label="邮箱", required=True, 
        widget=forms.EmailInput(attrs={"placeholder": FAKE_EMAIL, "class": "w-full"}),
        validators=[RegexValidator(r'^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$', '邮箱格式错误'),])

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

    confirm_password = forms.CharField( label='重复密码',required=True,
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

    def clean_phone(self):
        phone = self.cleaned_data['phone']

        if phone == FAKE_PHONE:
            return phone

        if User.objects.filter(phone=phone).exists():
            self.add_error('phone', '此手机号已注册') 
        return phone

    def clean_confirm_password(self):
        password = self.cleaned_data.get('password')
        confirm_password = self.cleaned_data['confirm_password']
        if not password:
            return confirm_password
        
        if password != confirm_password:
            self.add_error('confirm_password', '两次密码不一致')

        return confirm_password