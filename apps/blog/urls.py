from django.urls import path
from django.urls import include
from Morningstar.settings.common import CACHE_TIMEOUT
from django.views.decorators.cache import cache_page

from . import feeds
from . import views


app_name = 'blog'
urlpatterns = [
    path('contact/', views.contact, name='contact'),
    path('search/', views.BlogSearchView(), name="search"),
    path('rss/', cache_page(CACHE_TIMEOUT)(feeds.AllPostsRssFeed()), name='rss'),
    path('', cache_page(CACHE_TIMEOUT)(views.IndexView.as_view()), name='index'),
    path('posts/<int:pk>/', cache_page(CACHE_TIMEOUT)(views.PostDetailView.as_view()), name='detail'),
    path('archives/<int:year>/<int:month>/',
        cache_page(CACHE_TIMEOUT)(views.ArchiveView.as_view()), name='archive'),
    path('categories/<int:pk>/', cache_page(CACHE_TIMEOUT)( views.CategoryView.as_view()), name='category'),
    path('tags/<int:pk>/', cache_page(CACHE_TIMEOUT)(views.TagView.as_view()), name='tag'),
    path('comment/<int:post_pk>', views.comment, name='comment'),
]
