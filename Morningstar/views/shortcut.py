from django.shortcuts import redirect, render


def shortcut(request, name):
    # 项目快捷链接
    if name in [
        "issue",
        "auto",
        "src",
        "host",
        "vercel",
        "domain",
        "namecheap",
        "license",
        "task",
        "wechatpp",
    ]:
        if name == "issue":
            return redirect("https://github.com/HenryJi529/OpenMorningstar/issues")
        elif name == "auto":
            return redirect("https://github.com/HenryJi529/OpenMorningstar/actions")
        elif name == "src":
            return redirect("https://github.com/HenryJi529/OpenMorningstar")
        elif name == "host" or name == "vercel":
            return redirect("https://vercel.com/dashboard")
        elif name == "domain" or name == "namecheap":
            return redirect(
                "https://ap.www.namecheap.com/Domains/DomainControlPanel/morningstar369.com/advancedns"
            )
        elif name == "license":
            return redirect(
                "https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/LICENSE"
            )
        elif name == "task":
            return redirect("https://ticktick.com/webapp#m/all/matrix")
        elif name == "wechatpp":
            return redirect("https://mp.weixin.qq.com/cgi-bin/home")
        else:
            pass
    # 静态资源管理
    elif name in ["qiniu", "lanzou"]:
        if name == "qiniu":
            return redirect(
                "https://portal.qiniu.com/kodo/bucket/overview?bucketName=morningstar-369"
            )
        elif name == "lanzou":
            return redirect("https://pc.woozooo.com/mydisk.php")
        else:
            pass
    else:
        return render(request, "404.html")
