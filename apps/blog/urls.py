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
    path('feed/', cache_page(CACHE_TIMEOUT)(feeds.AllPostsRssFeed()), name='feed'),
    path('', views.IndexView.as_view(), name='index'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='detail'),
    path('archives/<int:year>/<int:month>/', views.ArchiveView.as_view(), name='archive'),
    path('categories/<int:pk>/', views.CategoryView.as_view(), name='category'),
    path('tags/<int:pk>/', views.TagView.as_view(), name='tag'),
    path('comment/<int:post_pk>', views.comment, name='comment'),
    path('thumbs/', views.thumbs, name='thumbs'),

    # 账号相关
    path('logout/', views.logout, name='logout'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('updateInfo/', views.updateInfo, name='updateInfo'),
    path('updatePassword/', views.updatePassword, name='updatePassword'),
]
