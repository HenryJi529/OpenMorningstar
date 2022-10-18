import os
# import ssl
# ssl._create_default_https_context = ssl._create_unverified_context

from Morningstar.settings.common import TENCENT_SMS_APP_ID
from Morningstar.settings.common import TENCENT_SMS_APP_KEY
from Morningstar.settings.common import TENCENT_SMS_TEMPLATE
from Morningstar.settings.common import TENCENT_SMS_TEMPLATE_TEXT
from Morningstar.settings.common import TENCENT_SMS_SIGN

# from qcloudsms_py.httpclient import HTTPError  # NOTE: 官方版本未适配python3.9
# from qcloudsms_py import SmsMultiSender, SmsSingleSender
from .tencentsms.httpclient import HTTPError
from .tencentsms import SmsMultiSender, SmsSingleSender


def is_production():
    """
    判断是否为生产环境
    :return:
    """
    return os.environ.get('DJANGO_SETTINGS_MODULE', 'Morningstar.settings.dev') == 'Morningstar.settings.production'


def send_sms_single(phone_num, template, template_param_list):
    """
    单条发送短信
    :param phone_num: 手机号
    :param template: 腾讯云短信模板名
    :param template_param_list: 短信模板所需参数列表，例如:【验证码：{1}，描述：{2}】，则传递参数 [888,666]按顺序去格式化模板
    :return:
    """
    if not is_production():
        content = TENCENT_SMS_TEMPLATE_TEXT[template](*template_param_list)
        print(content)
        return {'result': 0, 'msg': "测试环境发送成功", 'phone': f'{phone_num}', 'content': content}
    appid = TENCENT_SMS_APP_ID
    appkey = TENCENT_SMS_APP_KEY
    sms_sign = TENCENT_SMS_SIGN
    template_id = TENCENT_SMS_TEMPLATE[template]
    sender = SmsSingleSender(appid, appkey)
    try:
        response = sender.send_with_param(
            86, phone_num, template_id, template_param_list, sign=sms_sign)
    except HTTPError as e:
        response = {'result': 1000, 'msg': "网络异常发送失败"}
    return response


def send_sms_multi(phone_num_list, template, param_list):
    """
    批量发送短信
    :param phone_num_list: 手机号列表
    :param template: 腾讯云短信模板名
    :param param_list: 短信模板所需参数列表，例如:【验证码：{1}，描述：{2}】，则传递参数 [888,666]按顺序去格式化模板
    :return:
    """
    if not is_production():
        return {'result': 0, 'msg': "测试环境发送成功", 'phone_num_list': f'{phone_num_list}'}
    appid = TENCENT_SMS_APP_ID
    appkey = TENCENT_SMS_APP_KEY
    sms_sign = TENCENT_SMS_SIGN
    template_id = TENCENT_SMS_TEMPLATE[template]
    sender = SmsMultiSender(appid, appkey)
    try:
        response = sender.send_with_param(
            86, phone_num_list, template_id, param_list, sign=sms_sign)
    except HTTPError as e:
        response = {'result': 1000, 'msg': "网络异常发送失败"}
    return response

