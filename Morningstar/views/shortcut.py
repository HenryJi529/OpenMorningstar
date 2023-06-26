from django.shortcuts import redirect, render


def shortcut(request, name):
    # 项目快捷链接
    if name in [
        "issue",
        "auto",
        "src",
        "src-mirror",
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
        elif name in ["src"]:
            if name == "src":
                return redirect("https://github.com/HenryJi529/OpenMorningstar")
            else:
                pass
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
    # 其他快捷链接
    elif name in ["gist", "sgs", "cook", "news"]:
        if name == "gist":
            return redirect("https://gist.github.com/HenryJi529")
        elif name == "sgs":
            return redirect("https://web.sanguosha.com/login/index.html")
        elif name == "cook":
            return redirect("https://github.com/Anduin2017/HowToCook")
        elif name == "news":
            return redirect("https://github.com/ruanyf/weekly")
        else:
            pass
    else:
        return render(request, "404.html")
