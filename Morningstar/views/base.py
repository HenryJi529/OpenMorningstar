import json
import random
import logging

from django.http import HttpResponse, JsonResponse, Http404
from django.shortcuts import render, redirect, reverse
from django.contrib.auth.hashers import make_password
from django.contrib.sessions.models import Session
from django.contrib import auth
from django.contrib import messages

from django_redis import get_redis_connection

from ..forms import LoginForm, RegisterForm
from ..models import User
from ..lib.auth import authenticate
from ..lib.mail import send_mail_from_host


logger = logging.getLogger("django")


def fix_fetched_post(request):
    try:
        # fetch请求
        post_data = json.loads(request.body.decode("utf-8"))
        request.POST._mutable = True
        for key, value in post_data.items():
            request.POST[key] = value
        request.POST._mutable = False
    except:
        # 基本请求
        pass
    return request


def handle_register(request, is_api=True):
    def create_activate_message(username, host):
        code = random.randint(10000, 99999)
        conn = get_redis_connection("default")
        try:
            conn.delete(f'{username}-activate')
        except:
            pass
        conn.set(f'{username}-activate', code, ex=60*5)

        protocol = "https://" if request.is_secure() else "http://"
        link = protocol + host + reverse('activate_by_email') + f'?username={username}&code={code}'
        message = f"通过该链接激活:\n{link}\n五分钟内有效..."

        return message

    form = RegisterForm(request.POST)
    if form.is_valid():
        email = form.cleaned_data.get('email')
        phone = form.cleaned_data.get('phone')
        code = form.cleaned_data.get('code')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        confirm_password = form.cleaned_data.get('confirm_password')

        user = User.objects.create(
            username=username, password=make_password(password), email=email, is_active=False)
        subject = "激活邮件"
        message = create_activate_message(username=username, host=request.META['HTTP_HOST'])
        send_mail_from_host(subject, message, [email])
        if is_api:
            response_data = {'status': 'success', 'message': '成功通过邮箱注册'}
            return JsonResponse(response_data)
        else:
            messages.add_message(request, messages.INFO, "注册已完成...请通过邮箱激活")
            next = request.POST.get("next", "/")
            return redirect(next if next else "/")
    else:
        if is_api:
            return JsonResponse({'status': "error", 'message': form.errors})
        else:
            messages.add_message(request, messages.WARNING, form.errors)
            next = request.POST.get("next", "/")
            return redirect(next if next else "/")


def handle_login(request, is_api=False):
    form = LoginForm(request, request.POST)
    if form.is_valid():
        identity = form.cleaned_data.get('identity')
        password = form.cleaned_data.get('password')

        # NOTE: 使用增强后的认证函数
        user = authenticate(identity=identity,password=password)
        if user is not None:
            auth.login(request, user)
            next = request.POST.get("next", "/")
            if is_api:
                return JsonResponse({'status': 'success', 'message': '登录成功'})
            else:
                messages.add_message(request, messages.INFO, "登录成功...")
                return redirect(next if next else "/")
        else:
            if is_api:
                return JsonResponse({'status': 'error', 'message': '账号不存在或密码错误...'})
            else:
                messages.add_message(request, messages.ERROR, "账号不存在或密码错误...")
                return redirect("/")
    else:
        if is_api:
            return JsonResponse({'status': 'error', 'message': form.errors['image_captcha'][0]})
        else:
            messages.add_message(request, messages.ERROR, form.errors['image_captcha'][0])
            return redirect("/")

