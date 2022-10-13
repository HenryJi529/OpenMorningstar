import random
import re
import string

from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib import auth

from django_redis import get_redis_connection

from ..models import User
from ..settings.common import TENCENT_SMS_TEMPLATE
from ..forms import LoginForm, RegisterForm, SendSmsForm
from ..lib.sms import send_sms_single
from ..lib.mail import send_mail_from_host

from .base import fix_fetched_post, handle_login, handle_register


def spa(request):
    if request.user.is_authenticated:
        return render(request, "base/index.html")
    else:
        if request.method == "POST":
            request = fix_fetched_post(request)
            # 判断confirm_password是否在POST中，如果在则判断为注册
            if "confirm_password" in request.POST:
                return handle_register(request, is_api=True)
            else:
                return handle_login(request, is_api=False)
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
                try:
                    send_mail_from_host(subject, message, [identity])
                    User.objects.filter(email=identity).update(password=make_password(new_password))
                    response_data = {"status": "success", "message": "邮箱改密成功, 新密码已发送到邮箱"}
                except:
                    response_data = {"status": "error", "message": "邮件发送错误"}
                return JsonResponse(response_data)
            else:
                response_data = {"status":"error", "message": "重置密码只能通过手机号与邮箱"}
                return JsonResponse(response_data)
