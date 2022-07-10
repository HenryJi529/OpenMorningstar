# ✅ 代办事项
- **django & webpack**
	- 每个app内构建src、dist、
- **清理bootstrap**(主要是栅格系统)
	- blog
	- Morningstar
	- joke
- **完善readme**
- 全面测试
## _base
- 网页基础模版: https://www.ahhhhfs.com/
- 本站服务页面
- 个人介绍页面
- 账号管理页面
	- 修改(密码，昵称等)【短信，邮箱】
	- 绑定oauth账号
- oauth2: github, google
- 七牛SDK: 
	- py: https://developer.qiniu.com/kodo/sdk/python
	- js: https://developer.qiniu.com/kodo/1283/javascript
- 蓝奏SDK

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

----

## joke
- 全面适配Bootstrap5
- 完全采用 drf 实现
- 文字也生成图片
- 实现 feed 订阅
- 界面设计
	- 手机端：类似tinder
	- PC端：下拉刷新方式

----

## rss
- 纠正逻辑错误(累积而非刷新)

----

## sanguosha
- 按照三国杀十周年设定武将强度
- 游戏模式:
	- 主从武将模式(1v1模式)
	- 身份场(5,6,8)
	- 2v2
	- 3v3
