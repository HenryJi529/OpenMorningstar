from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, JsonResponse, Http404
import requests


DOCKERHUB_DOMAIN = "dockerhub.morningstar529.com"


@login_required(login_url="/")
def registry(request):
    try:
        r = requests.get("https://" + DOCKERHUB_DOMAIN + "/v2/_catalog")
        data = dict()
        repos = r.json()["repositories"]
        repo_list = []
        for repo in repos:
            r = requests.get("https://" + DOCKERHUB_DOMAIN + "/v2/" + repo + "/tags/list")
            tags = r.json()["tags"]
            tags = [DOCKERHUB_DOMAIN + "/" + repo + ":" + tag for tag in tags]
            item = dict()
            item["name"] = repo
            item["tags"] = tags
            repo_list.append(item)
        data["domain"] = DOCKERHUB_DOMAIN
        data["repos"] = repo_list
        return render(request, "registry/index.html", context={"data": data})
    except:
        return HttpResponse("服务器未运行")
