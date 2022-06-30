from django import template
from ..forms import CommentForm

register = template.Library()


@register.inclusion_tag('blog/inclusions/_comment_form.html', takes_context=True)
def show_comment_form(context, post, user, form=None):
    user = user
    if form is None:
        form = CommentForm()
    return {
        'form': form,
        'post': post,
        'user': user,
    }


@register.inclusion_tag('blog/inclusions/_comment_list.html', takes_context=True)
def show_comments(context, post):
    comment_list = post.comment_set.all()
    return {
        'comment_list': comment_list,
    }
