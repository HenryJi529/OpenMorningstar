from django import template
from django.db.models.aggregates import Count, Max
from Morningstar.models import VisiableSetting
from ..models import Post, Category, Tag


register = template.Library()


@register.inclusion_tag('blog/inclusions/_recent_posts.html', takes_context=True)
def show_recent_posts(context, num=5):
    return {
        'recent_post_list': Post.objects.all()[:num],
    }


@register.inclusion_tag('blog/inclusions/_archives.html', takes_context=True)
def show_archives(context):
    return {
        'date_list': Post.objects.dates('created', 'month', order='DESC'),
    }


@register.inclusion_tag('blog/inclusions/_categories.html', takes_context=True)
def show_categories(context):
    category_list = Category.objects.annotate(
        num_posts=Count('post')).filter(num_posts__gt=0)
    return {
        'category_list': category_list,
    }


@register.inclusion_tag('blog/inclusions/_tags.html', takes_context=True)
def show_tags(context):
    tag_list = Tag.objects.annotate(num_posts=Count('post')).filter(num_posts__gt=0).order_by('-num_posts')
    try:
        maxNum = max([tag.num_posts for tag in tag_list])
        minNum = min([tag.num_posts for tag in tag_list])
        levelNum = 5
        for tag in tag_list:
            tag.color_level = int( (tag.num_posts - minNum) / (maxNum - minNum) * (levelNum-1) ) + 1
    except (ValueError, ZeroDivisionError):
        for tag in tag_list:
            tag.color_level = 2
    return {
        'tag_list': tag_list,
    }

@register.inclusion_tag('blog/inclusions/_hot_posts.html', takes_context=True)
def show_hot_posts(context,num=5):
    hot_post_list = Post.objects.order_by('-views')[:num]
    return {
        'hot_post_list': hot_post_list,
    }

@register.inclusion_tag('blog/inclusions/_other_links.html', takes_context=False)
def show_other_links():
    pass


@register.simple_tag(takes_context=False)
def show_lover():
    try:
        return VisiableSetting.objects.get(key='lover').value
    except VisiableSetting.DoesNotExist:
        return True