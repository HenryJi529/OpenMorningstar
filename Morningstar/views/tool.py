import io

from django.http import HttpResponse
from django_redis import get_redis_connection

from ..lib import image_captcha


def get_image_captcha(request):
    """ 生成图片验证码 """
    image_object, code = image_captcha.generate_image()
    session_key = request.session._session_key

    conn = get_redis_connection("default")
    conn.set(f'{session_key}-image-captcha', code, ex=60)

    stream = io.BytesIO()
    image_object.save(stream, 'png')
    return HttpResponse(stream.getvalue(),"image/png")