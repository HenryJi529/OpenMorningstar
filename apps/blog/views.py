import re
import json

from django.shortcuts import get_object_or_404, redirect, render, reverse
from django.http import HttpResponseRedirect, HttpResponse, Http404, JsonResponse
from django.urls import reverse
from django.views import generic
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.views.generic import ListView, DetailView
from django.db.models import Q

from django.core.mail import send_mail
from haystack import views as haystack_views

from Morningstar.views.base import handle_login, handle_register
from Morningstar.views.base import fix_fetched_post
from Morningstar.settings.common import EMAIL_HOST_USER, DEFAULT_GUEST_EMAIL
from Morningstar.forms import LoginForm, RegisterForm, InfoForm, UpdateEmailForm, UpdatePhoneForm, UpdatePasswordForm
from Morningstar.lib.print import better_print
from Morningstar.lib.mail import send_mail_from_host
from Morningstar.models import User

from .models import Category, Post, Tag, Comment
from .forms import CommentForm, ContactForm


class BlogSearchView(haystack_views.SearchView):
    template = "blog/search.html"


class CustomListView(ListView):
    def get_context_data(self,**kwargs):
        context = super().get_context_data(**kwargs)
        context['login_form'] = LoginForm(self.request)
        context['register_form'] = RegisterForm()
        if self.request.user.is_authenticated:
            context['info_form'] = InfoForm(initial={
                'nickname': self.request.user.nickname,
                'bio': self.request.user.bio,
                'avatar': self.request.user.avatar,
            })
        else:
            context['info_form'] = InfoForm()
        return context


class CustomDetailView(DetailView):
    def get_context_data(self,**kwargs):
        context = super().get_context_data(**kwargs)
        context['login_form'] = LoginForm(self.request)
        context['register_form'] = RegisterForm()
        if self.request.user.is_authenticated:
            context['info_form'] = InfoForm(initial={
                'nickname': self.request.user.nickname,
                'bio': self.request.user.bio,
            })
        else:
            context['info_form'] = InfoForm()
        return context


class IndexView(CustomListView):
    model = Post
    template_name = 'blog/index.html'
    context_object_name = 'post_list'
    paginate_by = 8


class ArchiveView(IndexView):
    def get_queryset(self):
        year = self.kwargs.get('year')
        month = self.kwargs.get('month')
        return super(ArchiveView, self).get_queryset().filter(created__year=year,
                                                            created__month=month)


class CategoryView(IndexView):
    def get_queryset(self):
        # 从URL捕获的路径参数值保存在实例的kwargs字典里，非路径参数值保存在实例的args列表里。
        cate = get_object_or_404(Category, pk=self.kwargs.get('pk'))
        return super(CategoryView, self).get_queryset().filter(category=cate)


class TagView(IndexView):
    def get_queryset(self):
        tag = get_object_or_404(Tag, pk=self.kwargs.get('pk'))
        return super(TagView, self).get_queryset().filter(tags=tag)


class PostDetailView(CustomDetailView):
    model = Post
    template_name = 'blog/detail.html'
    context_object_name = 'post'

    def get(self, request, *args, **kwargs):
        # get 方法返回的是一个 HttpResponse 实例
        response = super(PostDetailView, self).get(request, *args, **kwargs)
        # 注意 self.object 的值就是被访问的文章 post
        self.object.increase_views()
        return response


def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            subject = cd['subject']
            message = request.POST['message']
            email = cd.get('email') if len(cd.get('email')) > 0 else DEFAULT_GUEST_EMAIL
            from_email = email.replace("@", "*") + "<" + EMAIL_HOST_USER + ">"
            send_mail(
                subject,
                message,
                from_email,
                ['jeep.jipu@gmail.com'],
            )
            return render(request, 'blog/contact_thanks.html')
        else:
            messages.add_message(request, messages.ERROR, form.errors['message'][0])
            return render(request, 'blog/contact.html')
    else:
        return render(request, 'blog/contact.html')


@require_POST
def comment(request, post_pk):
    post = get_object_or_404(Post, pk=post_pk)
    form = CommentForm(request.POST)
    if form.is_valid():
        # commit=False 的作用是仅仅利用表单的数据生成 Comment 模型类的实例，但还不保存评论数据到数据库。
        comment = form.save(commit=False)
        comment.user = request.user
        comment.post = post
        comment.save()
        # 重定向到 post 的详情页，实际上当 redirect 函数接收一个模型的实例时，它会调用这个模型实例的 get_absolute_url 方法，
        # 然后重定向到 get_absolute_url 方法返回的 URL。
        messages.add_message(request, messages.SUCCESS, '评论发表成功！', extra_tags='success')
        
        # 检测是否有回复他人
        pattern = re.compile(r'\[@[\w-]*?\]\(#comment-\d*?\)',re.M)
        matches = pattern.findall(request.POST['body'])
        if matches:
            for match in matches:
                # 获取回复的用户
                username = re.search(r'\[@([\w-]*?)\]', match).group(1)
                comment_id = re.search(r'\(#comment-(\d*?)\)', match).group(1)
                if Comment.objects.get(id=comment_id).user.username == username:
                    # 发送邮件通知
                    subject = "您在晨星小站的评论有了新的回复"
                    post = Comment.objects.get(id=comment_id).post
                    message = f"您在《{post.title}》的评论中有了新的回复, 点击链接查看: \nhttps://morningstar369.com{post.get_absolute_url()}#comment-{comment.id}\n"
                    to_email = User.objects.get(username=username).email
                    send_mail_from_host(subject, message, [to_email])
        else:
            pass
        return redirect(post)

    # 检查到数据不合法，我们渲染一个预览页面，用于展示表单的错误。
    # 注意这里被评论的文章 post 也传给了模板，因为我们需要根据 post 来生成表单的提交地址。
    context = {
        'post': post,
        'form': form,
    }
    messages.add_message(request, messages.ERROR,
                        '评论发表失败！请修改表单中的错误后重新提交。', extra_tags='danger')
    return render(request, 'blog/comment_preview.html', context=context)


@require_POST
def thumbs(request):
    try:
        request = fix_fetched_post(request)
        action = request.POST["action"]
        direction = request.POST["direction"]
        comment = Comment.objects.get(id=request.POST["comment_id"])
        if action == "do" and direction == "up":
            comment.thumbs_up.add(request.user)
            print(comment.thumbs_up.all())
        elif action == "do" and direction == "down":
            comment.thumbs_down.add(request.user)
        elif action == "undo" and direction == "up":
            comment.thumbs_up.remove(request.user)
        elif action == "undo" and direction == "down":
            comment.thumbs_down.remove(request.user)
        else:
            pass
        comment.save()
        return JsonResponse({
            "status": "success",
            "thumbsUp_count": comment.thumbs_up.all().count(),
            "thumbsDown_count": comment.thumbs_down.all().count(),
        })
    except:
        return JsonResponse({'status': "error"})


@login_required(login_url="/")
# @login_required(login_url=reverse("blog:index")) # NOTE: 别！！！
def logout(request):
    auth.logout(request)
    return redirect(reverse("blog:index"))


def register(request):
    return handle_register(request, is_api=False)


def login(request):
    return handle_login(request, is_api=False)


@require_POST
def updateInfo(request):
    info_form = InfoForm(request.POST, request.FILES)
    if info_form.is_valid():
        request.user.nickname = info_form.cleaned_data['nickname']
        request.user.bio = info_form.cleaned_data['bio']
        if info_form.cleaned_data['avatar']:
            request.user.avatar = info_form.cleaned_data['avatar']
        request.user.save()
        messages.add_message(request, messages.INFO, "档案更新成功...")
    else:
        print(better_print(info_form.errors))
        messages.add_message(request, messages.ERROR, "档案更新失败...")
    return redirect(reverse('blog:index'))


@require_POST
def updatePassword(request):
    update_password_form = UpdatePasswordForm(request.POST)
    if update_password_form.is_valid():
        password = update_password_form.cleaned_data['confirm_password']
        request.user.set_password(password)
        request.user.save()
        messages.add_message(request, messages.INFO, "密码修改成功...")
    else:
        error_message = [ value[0]['message'] for value in json.loads(update_password_form.errors.as_json()).values() ][0]
        messages.add_message(request, messages.ERROR, error_message)
    return redirect(reverse('blog:index'))


@require_POST
def updateEmail(request):
    update_email_form = UpdateEmailForm(request.POST)
    if update_email_form.is_valid():
        request.user.email = update_email_form.cleaned_data['email']
        request.user.save()
        messages.add_message(request, messages.INFO, "邮箱修改成功...")
    else:
        messages.add_message(request, messages.ERROR, update_email_form.errors['email_code'][0])
    return redirect(reverse('blog:index'))


@require_POST
def updatePhone(request):
    update_phone_form = UpdatePhoneForm(request.POST)
    if update_phone_form.is_valid():
        request.user.phone = update_phone_form.cleaned_data['phone']
        request.user.save()
        messages.add_message(request, messages.INFO, "手机号修改成功...")
    else:
        messages.add_message(request, messages.ERROR, update_phone_form.errors['phone_code'][0])
    return redirect(reverse('blog:index'))
