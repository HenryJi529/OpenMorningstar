import io
import random
import re
import os
import html

from django.http import HttpResponse, JsonResponse, HttpRequest
from django.shortcuts import redirect, render
from django.urls import reverse
from django.contrib import auth
from django.views.decorators.http import require_POST
from django_redis import get_redis_connection

from Morningstar.views.base import fix_fetched_post
from Morningstar.settings.common import TENCENT_SMS_TEMPLATE
from Morningstar.settings.common import EMAIL_TEMPLATE_TEXT

from ..lib.image_captcha import generate_image
from ..lib.mail import send_mail_from_host_by_template
from ..lib.sms import send_sms_single
from ..lib.check import is_identity_belong_phone, is_identity_belong_email
from ..models import User


def get_image_captcha(request: HttpRequest):
    """生成图片验证码"""
    image_object, code = generate_image()
    request.session.cycle_key()
    session_key = request.session.session_key
    conn = get_redis_connection("default")
    conn.set(f"{session_key}-image-captcha", code, ex=60)

    stream = io.BytesIO()
    image_object.save(stream, "png")
    return HttpResponse(stream.getvalue(), "image/png")


def activate_by_email(request: HttpRequest):
    if request.method == "GET":
        username = request.GET["username"]
        code = request.GET["code"]
        conn = get_redis_connection("default")
        redis_code_bin = conn.get(f"{username}-activate")
        if not redis_code_bin:
            return HttpResponse("激活链接已经超时")
        else:
            redis_code = str(redis_code_bin.decode())
            if code == redis_code:
                user = User.objects.get(username=username)
                user.is_active = True
                user.save()
                conn.delete(f"{username}-activate")
                auth.login(request, user)
                return redirect("/")
            else:
                return HttpResponse("错误的激活链接")
    else:
        return HttpResponse("这是啥玩意儿。。")


@require_POST
def send_phone_code(request: HttpRequest, template):
    request = fix_fetched_post(request)
    identity = request.POST.get("identity")
    if not identity or not re.match(r"^(1[3|4|5|6|7|8|9])\d{9}$", identity):
        return JsonResponse({"status": "error", "msg": "手机号格式错误"})
    if template in list(TENCENT_SMS_TEMPLATE.keys()):
        code = random.randint(100000, 999999)
        if template in ["login", "chpasswd"]:
            if not User.objects.filter(phone=identity).exists():
                return JsonResponse({"status": "error", "msg": "手机号不存在"})
        else:
            if User.objects.filter(phone=identity).exists():
                return JsonResponse({"status": "error", "msg": "手机号已存在"})
        response = send_sms_single(
            identity,
            template,
            [
                code,
            ],
        )
        if response["result"] == 0:
            conn = get_redis_connection("default")
            conn.set(f"{identity}-{template}", code, ex=600)
            return JsonResponse({"status": "success", "msg": "验证码已发送"})
        else:
            return JsonResponse(
                {"status": "error", "msg": f"短信发送失败: {response['msg']}"}
            )
    else:
        return JsonResponse({"status": "error", "msg": "错误的模板名称"})


@require_POST
def send_email_code(request, template):
    request = fix_fetched_post(request)
    identity = request.POST.get("identity")
    if not identity or not re.match(
        r"^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$", identity
    ):
        return JsonResponse({"status": "error", "msg": "邮箱格式错误"})
    if template in EMAIL_TEMPLATE_TEXT.keys():
        code = random.randint(100000, 999999)
        if template in ["login", "chpasswd"]:
            if not User.objects.filter(email=identity).exists():
                return JsonResponse({"status": "error", "msg": "邮箱不存在"})
        else:
            if User.objects.filter(email=identity).exists():
                return JsonResponse({"status": "error", "msg": "邮箱已存在"})
        response = send_mail_from_host_by_template(
            [
                identity,
            ],
            template,
            [
                code,
            ],
        )
        if response:
            conn = get_redis_connection("default")
            conn.set(f"{identity}-{template}", code, ex=600)
            return JsonResponse({"status": "success", "msg": "验证码已发送"})
        else:
            return JsonResponse({"status": "error", "msg": "邮件发送失败"})
    else:
        return JsonResponse({"status": "error", "msg": "错误的模板名称"})


def get_login_token(request: HttpRequest, identity):
    if not request.user.is_superuser:
        return HttpResponse("你不是超级管理员，无权使用此功能")
    if is_identity_belong_phone(identity):
        user = User.objects.get(phone=identity)
    elif is_identity_belong_email(identity):
        user = User.objects.get(email=identity)
    else:
        user = User.objects.get(username=identity)
    if user:
        username = user.username
        password = user.password
        token = html.escape(password[-20:])
        protocol = (
            "https://"
            if os.environ.get("DJANGO_SETTINGS_MODULE", "Morningstar.settings.dev")
            == "Morningstar.settings.production"
            else "http://"
        )
        link = (
            protocol
            + request.get_host()
            + reverse(
                "login_by_token",
                args=[
                    token,
                ],
            )
        )
        conn = get_redis_connection("default")
        conn.set(f"{token}-login-token", password, ex=24 * 60 * 60)
        return render(
            request,
            "base/login_token.html",
            {"username": username, "token": token, "link": link},
        )
    else:
        return HttpResponse("用户不存在")


def login_by_token(request, token):
    conn = get_redis_connection("default")
    redis_login_token = conn.get(f"{token}-login-token")
    if not redis_login_token:
        return HttpResponse("登录链接已经超时/令牌无效")
    password = str(redis_login_token.decode())
    user = User.objects.get(password=password)
    auth.login(request, user)
    try:
        conn.delete(f"{token}-login-token")
    except:
        pass
    return redirect(reverse("blog:index"))
