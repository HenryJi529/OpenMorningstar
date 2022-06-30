from django.shortcuts import redirect, render


def shortcut(request, name):
    # 项目快捷链接
    if name in ["issue", "auto", "src", "src-mirror", "host", "vercel", "domain", "namecheap", "license", "coverage", "task", "resume", "mailbox"]:
        if name == 'issue':
            return redirect("https://github.com/HenryJi529/OpenMorningstar/issues")
        elif name == "auto":
            return redirect("https://github.com/HenryJi529/OpenMorningstar/actions")
        elif name == "src" or name == "src-mirror":
            if name == "src":
                return redirect("https://github.com/HenryJi529/OpenMorningstar")
            elif name == "src-mirror":
                return redirect("https://gitea.morningstar529.com/Henry529/OpenMorningstar")
            else:
                pass
        elif name == "host" or name == "vercel":
            return redirect("https://vercel.com/dashboard")
        elif name == "domain" or name == "namecheap":
            return redirect("https://ap.www.namecheap.com/Domains/DomainControlPanel/morningstar529.com/advancedns")
        elif name == "license":
            return redirect("https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/LICENSE")
        elif name == "coverage":
            return redirect("https://coverage.morningstar529.com/")
        elif name == "task":
            return redirect("https://ticktick.com/webapp#m/all/matrix")
        elif name == "resume":
            return redirect("https://resume.morningstar529.com/")
        elif name == "mailbox":
            return redirect("https://privateemail.com/appsuite/#!!&app=io.ox/mail&folder=default0/INBOX")
        else:
            pass
    # 静态资源管理
    elif name in ["qiniu", "lanzou"]:
        if name == "qiniu":
            return redirect("https://portal.qiniu.com/kodo/bucket/resource-v2?bucketName=morningstar-529")
        elif name == "lanzou":
            return redirect("https://pc.woozooo.com/mydisk.php")
        else:
            pass
    # 速查表链接
    elif name in ["gist", "html", "css", "js", "bash", "sass"]:
        if name == "gist":
            return redirect("https://gist.github.com/HenryJi529")
        elif name == "html":
            return redirect("https://man.ilovefishc.com/html5/")
        elif name == "css":
            return redirect("https://man.ilovefishc.com/css3/")
        elif name == "js":
            return redirect("https://zh.javascript.info/")
        elif name == "bash":
            return redirect("https://wsgzao.github.io/post/bash/")
        elif name == "sass":
            return redirect("https://www.sass.hk/docs/")
        else:
            pass
    # 其他快捷链接
    elif name in ["sgs", "cook", "news"]:
        if name == "sgs":
            return redirect("https://web.sanguosha.com/login/index.html")
        elif name == "cook":
            return redirect("https://github.com/Anduin2017/HowToCook")
        elif name == "news":
            return redirect("https://github.com/ruanyf/weekly")
        else:
            pass
    else:
        return render(request, '404.html')