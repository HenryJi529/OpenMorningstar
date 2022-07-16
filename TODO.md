# ✅ 代办事项
- **通过tailwind重构ui**
	- base
	- blog
	- book
	- joke
	- nav: transition
	- poll
- 全面测试
- 本站运行时间

----

## _base
- 联系客服
- 网页基础模版: https://www.ahhhhfs.com/
- 本站服务页面
- 个人介绍页面
- 账号管理页面
	- 修改(密码，昵称等)【短信，邮箱】
	- 绑定oauth账号
- oauth2: github, google

----

## blog
- 界面设计
	- daisyUI适配
	- 暗黑模式
	- 适配主题: https://github.com/xugaoyi/vuepress-theme-vdoing
- 完整的评论功能
	- 发表回复评论(多层级评论Thread)
	- 评论的邮件提醒
	- 支持 Markdown
	- 支持Github登录评论
	- 支持图床
- media/blog博客默认导入admin
- 代码点击复制功能
- 分享
	- 简单的 SEO 功能，新建文章等会自动通知 Google。
	- 多目标源博文分享(微信/QQ/Twitter)
- 部分数据增加缓存(如配置信息)。
- 优化了部分视图函数查询的方法(重复的查询操作抽取到 models 了)。
- about页面
- 支持个人设置(如设置头像，个人介绍)
- 相关文章推荐(根据相似标签)
- 博客内容:
	- 正则表达式原理及使用: 
		- javascript版本: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions
	- Nginx使用手册:
		- 匹配规则: https://moonbingbing.gitbooks.io/openresty-best-practices/content/ngx/nginx_local_pcre.html
		- 手册: https://www.freecodecamp.org/news/the-nginx-handbook/
	- requests: https://requests.readthedocs.io/en/latest/
	- matplotlib: https://matplotlib.org/stable/gallery/index
	- numpy:
		- 一千题: https://github.com/rougier/numpy-100
		- 文档: https://numpy.org/doc/stable/index.html
	- pandas: 
		- 101题: https://www.machinelearningplus.com/python/101-pandas-exercises-python/

----

## joke
- 完全采用 drf 实现
- 文字也生成图片
- 实现 feed 订阅
- 界面设计
	- 手机端：类似tinder
	- PC端：下拉刷新方式
- 素材: https://www.tumblr.com/blog/view/morningstar529

