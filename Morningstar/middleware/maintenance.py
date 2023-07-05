import datetime
import os
from django.shortcuts import redirect, Http404, render
from django.http import HttpResponse
from django.utils.deprecation import MiddlewareMixin


class MaintenanceMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if (
            os.environ.get("DJANGO_SETTINGS_MODULE", "Morningstar.settings.dev")
            == "Morningstar.settings.production"
        ):
            from Morningstar.settings import production as settings

            if request.path_info not in settings.MAINTENANCE_URL_LIST:
                return None
            else:
                return render(request, "maintenance.html")
        return None
