from django.contrib import admin
from django.contrib.admin import ModelAdmin
from Morningstar.models import User
# https://django-import-export.readthedocs.io/en/latest/getting_started.html
from import_export import resources
from import_export.formats import base_formats
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin, ImportMixin, ExportMixin, ImportExportActionModelAdmin

from .models import User


class UserResource(resources.ModelResource):
    username = Field(attribute='username', column_name='用户名')
    password = Field(attribute='password', column_name='密码')
    email = Field(attribute='email', column_name='邮箱')
    phone = Field(attribute='phone', column_name='手机号')
    bio = Field(attribute='bio', column_name='个人简介')
    avatar = Field(attribute='avatar', column_name='头像')

    class Meta:
        model = User
        fields = ('username', 'password',
                  'phone', 'email', 'bio', 'avatar')
        export_order = ('username', 'password',
                        'phone', 'email', 'bio', 'avatar')
        import_id_fields = ('username',)


@admin.register(User)
class UserAdmin(ImportExportActionModelAdmin):
    formats = (base_formats.CSV, base_formats.XLS)
    resource_class = UserResource
    list_display = ('id', 'username', '全名', 'email', 'phone', 'is_staff',
                    'is_active', 'is_superuser', 'last_login', 'date_joined')

    def 全名(self, obj):
        return obj.first_name + ' ' + obj.last_name
# admin.site.register(User, UserAdmin)


admin.site.site_header = "项目后台"
