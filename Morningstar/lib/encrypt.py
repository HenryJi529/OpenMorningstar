#!/usr/bin/env python
# -*- coding:utf-8 -*-
import uuid
import hashlib
import os


def md5(string):
    """ MD5加密 """
    if os.environ.get('DJANGO_SETTINGS_MODULE','Morningstar.settings.dev') == 'Morningstar.settings.production':
        from Morningstar.settings import production as settings
        SECRET_KEY = settings.SECRET_KEY
    else:
        from Morningstar.settings import dev as settings
        SECRET_KEY = settings.SECRET_KEY

    hash_object = hashlib.md5(SECRET_KEY.encode('utf-8'))
    hash_object.update(string.encode('utf-8'))
    return hash_object.hexdigest()


def uid(string):
    data = "{}-{}".format(str(uuid.uuid4()), string)
    return md5(data)
