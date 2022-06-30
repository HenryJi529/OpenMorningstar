from django.http import HttpResponse, JsonResponse, Http404
from django.shortcuts import render, redirect, reverse
from django.contrib.auth.hashers import make_password
from django.contrib.sessions.models import Session
from django.contrib import auth
from Morningstar.models import User
from django.contrib.auth.decorators import login_required
from django_user_agents.utils import get_user_agent
from django.views.generic import View
from django.contrib import messages
from Morningstar.settings.common import EMAIL_HOST_USER
from Morningstar.settings.common import BASE_DIR
from django.core.mail import send_mail

import string
import io
import os
import json
import random
import logging
from PIL import Image
import re
from django_redis import get_redis_connection

from ..forms import LoginForm, RegisterForm, SendSmsForm
from ..lib.auth import authenticate
from ..lib.sms import send_sms_single
from ..lib import image_captcha
from ..lib import qrcoder
from Morningstar.settings.common import TENCENT_SMS_TEMPLATE

logger = logging.getLogger("django")


def credits(request):
    items = [
        {
            "name": "django",
            "license_url": "https://cdn.jsdelivr.net/gh/django/django/LICENSE",
            "homepage_url": "https://www.djangoproject.com/"
        },
        {
            "name": "django-jazzmin",
            "license_url": "https://cdn.jsdelivr.net/gh/farridav/django-jazzmin/LICENSE",
            "homepage_url": "https://github.com/farridav/django-jazzmin"
        },
        {
            "name": "multipass",
            "license_url": "https://cdn.jsdelivr.net/gh/canonical/multipass/COPYING.GPL.txt",
            "homepage_url": "https://multipass.run/"
        },
    ]
    return render(request, "base/credits.html", context={"items": items})

def login(request):
    auth.logout(request)
    login_form = LoginForm(request)
    register_form = RegisterForm()
    return render(request, "base/login_register.html", context={
        "login_form": login_form,
        "register_form": register_form,
    })


def index(request):
    if request.user.is_authenticated:
        return render(request, "base/index.html")
    else:
        if request.method == "POST":
            # 判断confirm_password是否在POST中，如果在则判断为注册
            if "confirm_password" in request.POST:
                form = RegisterForm(request.POST)
                if form.is_valid():
                    email = form.cleaned_data.get('email')
                    phone = form.cleaned_data.get('phone')
                    code = form.cleaned_data.get('code')
                    username = form.cleaned_data.get('username')
                    password = form.cleaned_data.get('password')
                    confirm_password = form.cleaned_data.get('confirm_password')
            
                    def create_activate_message(username, host):
                        code = random.randint(10000, 99999)
                        conn = get_redis_connection("default")
                        try:
                            conn.delete(f'{username}-activate')
                        except:
                            pass
                        conn.set(f'{username}-activate', code, ex=60*5)
                        return f"通过该链接激活:\nhttps://{host}/activate/?username={username}&code={code}\n五分钟内有效"

                    user = User.objects.create(
                        username=username, password=make_password(password), email=email, is_active=False)
                    subject = "激活邮件"
                    message = create_activate_message(username=username, host=request.META['HTTP_HOST'])
                    from_email = EMAIL_HOST_USER
                    send_mail(subject, message, from_email, [email],)
                    messages.add_message(request, messages.INFO, "注册已完成...请通过邮箱激活")
                    response_data = {'status': 'success', 'message': '成功通过邮箱注册'}
                    return JsonResponse(response_data)
                else:
                    return JsonResponse({'status': "error", 'message': form.errors})
            else:
                form = LoginForm(request, request.POST)
                if form.is_valid():
                    identity = form.cleaned_data.get('identity')
                    password = form.cleaned_data.get('password_login')

                    # NOTE: 使用增强后的认证函数
                    user = authenticate(identity=identity,password=password)

                    if user is not None:
                        auth.login(request, user)
                        next = request.POST.get("next", "/")
                        return redirect(next if next else "/")
                    else:
                        messages.add_message(request, messages.ERROR, "账号不存在或密码错误")
                        return redirect("/")
                else:
                    messages.add_message(request, messages.ERROR, form.errors['image_captcha'][0])
                    return redirect("/")
        else:
            login_form = LoginForm(request)
            register_form = RegisterForm()
            return render(request, "base/login_register.html", context={
                "login_form": login_form,
                "register_form": register_form,
            })


def send_sms(request):
    """ 发送短信 """
    form = SendSmsForm(request, data=request.POST)
    # 校验手机号：格式是否正确, 是否存在； 检验模版是否存在
    if form.is_valid():
        return JsonResponse({'status': "success"})

    return JsonResponse({'status': "error", 'message': form.errors})
    

def activate(request):
    if request.method == "GET":
        username = request.GET["username"]
        code = request.GET["code"]
        conn = get_redis_connection("default")
        redis_code_bin = conn.get(f'{username}-activate')
        if not redis_code_bin:
            return HttpResponse("激活链接已经超时")
        else:
            redis_code = str(redis_code_bin.decode())
            if code == redis_code:
                user = User.objects.get(username=username)
                user.is_active = True
                user.save()
                conn.delete(f'{username}-activate')
                auth.login(request, user)
                return redirect("/")
            else:
                return HttpResponse("错误的激活链接")
    else:
        return HttpResponse("这是啥玩意儿。。")


def get_image_captcha(request):
    """ 生成图片验证码 """
    image_object, code = image_captcha.generate_image()
    session_key = request.session._session_key

    conn = get_redis_connection("default")
    conn.set(f'{session_key}-image-captcha', code, ex=60)

    stream = io.BytesIO()
    image_object.save(stream, 'png')
    return HttpResponse(stream.getvalue(),"image/png")


@login_required(login_url="/")
def logout(request):
    auth.logout(request)
    return redirect("/")


def change_password(request):
    if request.method == "GET":
        identity = request.GET.get('identity')
        image_captcha = request.GET.get('image_captcha')

        session_key = request.session._session_key
        conn = get_redis_connection("default")

        redis_image_captcha = conn.get(f'{session_key}-image-captcha')
        if not redis_image_captcha:
            response_data = {"status":"error", "message": "验证码失效，请重新获取"}
            return JsonResponse(response_data)
        elif image_captcha.strip().upper() != str(redis_image_captcha.decode()).upper():
            response_data = {"status":"error", "message": '验证码错误，请重新输入'}
            return JsonResponse(response_data)
        else:
            if re.match(r'^(1[3|4|5|6|7|8|9])\d{9}$', identity):
                code = random.randint(100000, 999999)
                template_id = TENCENT_SMS_TEMPLATE.get("chpasswd")

                if not User.objects.filter(phone=identity).exists():
                    response_data = {"status": "error", "message": "手机号不存在"}
                    return JsonResponse(response_data)

                # 发送短信
                res = send_sms_single(identity, template_id, [code, ])
                if res['result'] != 0:
                    response_data = {"status": "error", "message": f"短信发送失败: {res['errmsg']}"}
                    return JsonResponse(response_data)
                else:
                    User.objects.filter(phone=identity).update(password=make_password(str(code)))
                    response_data = {"status": "success", "message": "手机号改密成功, 新密码已发送到短信"}
                    return JsonResponse(response_data)

            elif re.match(r'^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$', identity):
                def generate_password(length=8,chars=string.ascii_letters+string.digits):
                    return ''.join([random.choice(chars) for i in range(length)])
                def create_chpasswd_message(new_password):
                    return f"您的新密码为: {new_password}"
                new_password = generate_password()
                message = create_chpasswd_message(new_password)
                subject = "激活邮件"
                from_email = EMAIL_HOST_USER
                try:
                    send_mail(subject, message, from_email, [identity],)
                    User.objects.filter(email=identity).update(password=make_password(new_password))
                    response_data = {"status": "success", "message": "邮箱改密成功, 新密码已发送到邮箱"}
                except:
                    response_data = {"status": "error", "message": "邮件发送错误"}
                return JsonResponse(response_data)

            else:
                response_data = {"status":"error", "message": "重置密码只能通过手机号与邮箱"}
                return JsonResponse(response_data)

            
def get_favicon(request):
    image = Image.open(os.path.join(BASE_DIR, 'Morningstar/static/base/img/favicon.ico'))
    stream = io.BytesIO()
    image.save(stream, 'ico')
    return HttpResponse(stream.getvalue(),"image/ico")

def get_qrcode(request):
    url = "https://morningstar529.com/"
    back_color=(255, 255, 255)
    center_color=(255, 0, 255)
    edge_color=(75,20,147)
    icon_path=os.path.join(BASE_DIR, "Morningstar", "static", "base", "img", "logo.png")
    qrcode_image = qrcoder.make_qrcode(data=url, image_size=(400, 400), box_radius_ratio=0.5, icon_path=icon_path, back_color=back_color, center_color=center_color, edge_color=edge_color)
    stream = io.BytesIO()
    qrcode_image.save(stream, 'png')
    return HttpResponse(stream.getvalue(),"image/png")
