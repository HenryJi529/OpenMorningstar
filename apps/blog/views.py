from django.shortcuts import get_object_or_404, redirect, render, reverse
from django.http import HttpResponseRedirect, HttpResponse, Http404
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
from Morningstar.settings.common import EMAIL_HOST_USER
from Morningstar.forms import LoginForm, RegisterForm

from .models import Category, Post, Tag
from .forms import CommentForm, ContactForm

class BlogSearchView(haystack_views.SearchView):
    template = "blog/search.html"


class CustomListView(ListView):
    def get_context_data(self,**kwargs):
        context = super().get_context_data(**kwargs)
        context['login_form'] = LoginForm(self.request)
        context['register_form'] = RegisterForm()
        return context


class CustomDetailView(DetailView):
    def get_context_data(self,**kwargs):
        context = super().get_context_data(**kwargs)
        context['login_form'] = LoginForm(self.request)
        context['register_form'] = RegisterForm()
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
            email = cd.get('email') if len(
                cd.get('email')) > 0 else 'guest@morningstar529.com'
            from_email = email.replace("@", "*") + "<" + EMAIL_HOST_USER + ">"
            send_mail(
                subject,
                message,
                from_email,
                ['admin@morningstar529.com'],
            )
            return render(request, 'blog/contact_thanks.html')
    return render(request, 'blog/contact.html')


@require_POST
def comment(request, post_pk):
    post = get_object_or_404(Post, pk=post_pk)
    form = CommentForm(request.POST)
    if form.is_valid():
        # commit=False 的作用是仅仅利用表单的数据生成 Comment 模型类的实例，但还不保存评论数据到数据库。
        comment = form.save(commit=False)
        comment.post = post
        comment.save()
        # 重定向到 post 的详情页，实际上当 redirect 函数接收一个模型的实例时，它会调用这个模型实例的 get_absolute_url 方法，
        # 然后重定向到 get_absolute_url 方法返回的 URL。
        messages.add_message(request, messages.SUCCESS,
                            '评论发表成功！', extra_tags='success')
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


@login_required(login_url="/")
# @login_required(login_url=reverse("blog:index")) # NOTE: 别！！！
def logout(request):
    auth.logout(request)
    return redirect(reverse("blog:index"))


def register(request):
    return handle_register(request, is_api=False)


def login(request):
    return handle_login(request, is_api=False)