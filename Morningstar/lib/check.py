import re


def is_identity_belong_phone(identity):
    if re.match(r'^(1[3|4|5|6|7|8|9])\d{9}$', identity):
        return True
    else:
        return False


def is_identity_belong_email(identity):
    if re.match(r'^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$', identity):
        return True 
    else:
        return False