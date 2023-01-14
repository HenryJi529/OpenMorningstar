import os

from django.http import HttpResponseForbidden
from django.utils.deprecation import MiddlewareMixin

BLOCKED_USER_AGENTS = ['wp_is_mobile', ]

class BlockUserAgentMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if os.environ.get('DJANGO_SETTINGS_MODULE','Morningstar.settings.dev') == 'Morningstar.settings.production':
            if request.META.get('HTTP_USER_AGENT') in BLOCKED_USER_AGENTS:
                return HttpResponseForbidden('Forbidden')
        return None



