import io

from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.contrib import auth
from django_redis import get_redis_connection

from ..lib.image_captcha import generate_image
from ..lib.mail import send_mail_from_host
from ..models import User


def get_image_captcha(request):
    """ 生成图片验证码 """
    image_object, code = generate_image()
    session_key = request.session._session_key

    conn = get_redis_connection("default")
    conn.set(f'{session_key}-image-captcha', code, ex=60)

    stream = io.BytesIO()
    image_object.save(stream, 'png')
    return HttpResponse(stream.getvalue(),"image/png")


def activate_by_email(request):
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

