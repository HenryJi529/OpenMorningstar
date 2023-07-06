# 更新日志

## v0.2.9:

本次更新如下内容:

1. 常规更新(UI, 依赖, 数据, 测试)
1. workflow:
    - fabric: 解决流程执行中的不确定
    - `tasks.sh`: 整合常用命令
    - 更新GithubAction
1. deploy:
    - nginx: 
        - 整合前后端Nginx配置
        - 纯静态网页转换部署方式(From Vercel)
        - 分离数据配置与基础设施
    - docker: 
        - django: 
            - 分离Python依赖与版本，加快构建速度
            - 更新node版本
        - tshock: 添加`tmux`，更新配置
        - matomo: 更新配置
1. apps:
    - **extension**: 用vue重构
    - **blog**: 更新视图与UI
    - **formula**: 用vue重构
    - **joke**: 用vue重构，前后端分离
    - **nav**: ts转换为js
    - **notes**: 整合进主站
    - **quiz**: 整合进主站
    - **share**: 用vue重构，前后端分离


## v0.2.8:

本次更新如下内容:

1. 常规更新(UI, 依赖, 数据)
1. 固定 django-cors-headers 版本, 固定 python 版本
1. 部分 python 代码使用 black 格式化
1. 更新 GithubAction
1. 更新生产系统版本, 更换 IP, 更新 multipass 脚本, 更新自动化安装脚本
1. fabric: 实现 certbot 自动化配置
1. docker: 更新 dockerfile, 更新.dockerignore, 容器镜像换源
1. nginx: 解决 code.morningstar369.com 无法正常访问问题
1. **blog**: 更新 UI, 更新 post readtime 字段属性, 支持表格, 实现 visableSetting, 实现 requireLogin
1. **proxy**: 添加 token 机制, 敏感数据分离, 更新线路, 更新测试
1. **resume**: 更新信息
1. **rss**: 更新"河海大学研究生学院通知公告", 适配"江苏师范研究生院招生公告"

## v0.2.7:

本次更新如下内容:

1. 新增 Chrome 插件(v0.0.1)
1. 删除 cSpell 词库
1. 常规更新(UI, 依赖, 数据)
1. blog: 修复前端 bug
1. proxy: 支持多订阅
1. joke: 增加开放 api
1. 更新运维脚本
1. 更新 Vue 项目
1. 更新 cors 规则
1. 更新 gitignore
1. 更新 Github Action
1. 更新 dev 页

## v0.2.6:

本次更新如下内容:

1. 常规更新(UI, 依赖, 数据, cSpell 词库, Readme)
1. 更新工具安装脚本
1. blog: 新增 blockquote
1. 添加 animate.css
1. 更新快捷链接
1. CI: 添加 docker 镜像发布流程
1. 添加 CounterApp, NotesApp, QuizApp, VueRouterLearning
1. 新增依赖管理工具

## v0.2.5:

本次更新如下内容:

1. 更新 Readme
1. 常规更新(UI, 依赖, 数据)
1. proxy: 更新数据结构
1. nav: 支持条目特殊标记

## v0.2.4:

本次更新如下内容:

1. 更新 Readme
1. 常规更新(UI, 依赖, 数据)
1. blog: 修复公式块溢出问题
1. 更新 github 模版

## v0.2.3:

本次更新如下内容:

1. 更新 Readme
1. 常规更新(词库, 依赖, 数据, 数据结构)
1. 重构 proxy 应用
1. 支持 terser 压缩 JS 输出文件

## v0.2.2:

本次更新如下内容:

1. 更新 Readme
1. 常规更新(词库, 依赖, 数据)
1. 新增 apple-touch-logo
1. 默认压缩 CSS 输出
1. 新增示爱页
1. 更新部署自动化脚本
1. 更新 CI
1. 更新账本结构
1. 新增树莓派配置
1. 启用 TypeScript

## v0.2.1:

本次更新如下内容:

1. 更新 Readme
1. 更新依赖(django-jazzmin)
1. 更新博客 UI
1. 更新 SECURITY.md
1. 忽略 pipdeptree.txt

## v0.2.0:

本次更新如下内容:

1. 重建项目结构
1. 新增数据备份功能
1. 添加小荷包付款码
1. 隐藏项目 IP
1. 更新网站生日
1. 更新 cSpell 词库

## v0.1.7:

本次更新如下内容:

1. 解决 tailwindcss 与 daisyUI 冲突的问题
1. 更新 tasks 脚本
1. 调整项目目录结构
1. 常规更新(词库, 依赖)
1. share: 新增二维码分享功能

## v0.1.6:

本次更新如下内容:

1. 替换域名
1. 更新初始化脚本
1. 更新 UI
1. 常规更新(词库, 依赖, media 数据)
1. 解决 frp 服务端网站无法登录错误
1. 更新 gitea 配置
1. 解决 blog feed 跳转问题

## v0.1.5:

本次更新如下内容:

1. 完成 profile 相关功能
1. 实现找回账号功能
1. 优化代码结构，降低模块间耦合度
1. 更新 UI

## v0.1.4:

本次更新如下内容:

1. 重构项目，删除 spa 页面
1. 更新 cSpell 词库
1. 优化代码风格
1. 更新 UI

## v0.1.3:

本次更新如下内容:

1. 增强评论回复的邮件提醒功能
1. 实现评论回复@后的跳转
1. 提供 fleet 运行配置
1. 更新依赖
1. 更新感谢列表
1. 更新 nav 数据

## v0.1.2:

本次更新如下内容:

1. 更新测试
1. 实现评论区的代码高亮

## v0.1.1:

本次更新如下内容:

1. 更新博客评论功能
1. 优化 UI
1. 更新测试

## v0.1.0:

本次更新如下内容:

1. 项目雏形
1. 在线部署
1. 数据迁移
