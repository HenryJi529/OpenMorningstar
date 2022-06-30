from django.urls import path
from django.urls import include


from . import feeds
from . import views


app_name = 'blog'
urlpatterns = [
    path('contact/', views.contact, name='contact'),
    path('search/', views.BlogSearchView(), name="search"),
    path('rss/', feeds.AllPostsRssFeed(), name='rss'),
    path('', views.IndexView.as_view(), name='index'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='detail'),
    path('archives/<int:year>/<int:month>/',
         views.ArchiveView.as_view(), name='archive'),
    path('categories/<int:pk>/', views.CategoryView.as_view(), name='category'),
    path('tags/<int:pk>/', views.TagView.as_view(), name='tag'),
    path('comment/<int:post_pk>', views.comment, name='comment'),
]
