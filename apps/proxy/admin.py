import base64
import json
import hashlib
import uuid

from django.contrib import admin

# https://django-import-export.readthedocs.io/en/latest/getting_started.html
from import_export import resources
from import_export.formats import base_formats
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin

from .models import Node, SubscribeUrl, Account


@admin.register(Node)
class NodeAdmin(ImportExportModelAdmin):
    list_display = (
        "id",
        "name",
    )

    def save_model(self, request, obj, form, change):
        def decode_str(str_encoded):
            str_encoded_bytes = str_encoded.encode("utf-8")
            str_decoded_bytes = base64.b64decode(str_encoded_bytes)
            str_decoded = str_decoded_bytes.decode("utf-8")
            return str_decoded

        def encode_str(str_decoded):
            str_decoded_bytes = str_decoded.encode("utf-8")
            str_encoded_bytes = base64.b64encode(str_decoded_bytes)
            str_encoded = str_encoded_bytes.decode("utf-8")
            return str_encoded

        def convert(link_old, name):
            # 获取配置
            config_old = decode_str(link_old[8:])
            # 修改配置
            j = json.loads(config_old)
            j["ps"] = name
            config_new = json.dumps(j)
            # 生成链接
            link_new = "vmess://" + encode_str(config_new)
            return link_new

        # 替换ps
        obj.link = convert(obj.link, obj.name)

        super().save_model(request, obj, form, change)


@admin.register(SubscribeUrl)
class SubscribeUrlAdmin(ImportExportModelAdmin):
    list_display = (
        "id",
        "name",
    )


@admin.register(Account)
class AccountAdmin(ImportExportModelAdmin):
    list_display = ("id", "user", "token")

    def save_model(self, request, obj, form, change):
        def generate_token(id):
            # 使用 uuid4 生成一个随机字符串
            salt = uuid.uuid4().hex
            # 将 salt 和 id 拼接，然后计算其 SHA-256 哈希值
            hashed = hashlib.sha256(salt.encode() + str(id).encode()).hexdigest()
            # 将 salt 和 hashed 值拼接，作为最终的 token
            return (salt + hashed)[:16]

        obj.token = generate_token(obj.user.id) if not obj.token else obj.token
        print(generate_token(obj.user.id))
        super().save_model(request, obj, form, change)
