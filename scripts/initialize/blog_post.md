## 学习目标

1. 理解[流行工具](https://www.digitalocean.com/community/tools/nginx?global.app.lang=zhCN)生成的配置文件以及各种文档中的配置文件。
2. 从头开始将 Nginx 配置为 Web 服务器、反向代理服务器和负载均衡器。
3. 优化 Nginx 以获得最大的服务器性能。

## 简介

Nginx 是一种高性能网络服务器，专注于高性能、高并发和低资源使用。核心是一个反向代理服务器。一般用于反向代理和静态资源托管。
对比 Apache(httpd)的优势:

1. 它可以处理更多的并发请求。
2. 它可以在更低资源消耗的前提下更快地交付静态内容。

## 配置实验场地

### 虚拟机环境

推荐使用 multipass 创建虚拟机(MacOS 用户可跳过这一步骤, 区别仅在于 nginx 配置文件的目录)

1. 安装[multipass](https://multipass.run/install)
2. 创建虚拟机(cloud-config.yml 可参考[简易配置](https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/deploy/dev/cloud-config.yml))
   ```bash
   multipass launch --name master --cpus 2 --mem 2G --disk 10G --cloud-init cloud-config.yml
   ```
3. 进入虚拟机的 bash 环境
   ```bash
   multipass shell master
   ```
4. 确保 nginx 已经启动
   - 可以查看 nginx 服务的状态
     ```bash
     service nginx status
     -------------------------------------------
     ...
     Active: active (running)
     ...
     ```
   - 如果没有启动，可执行启动命令
     ```bash
     sudo service nginx start
     ```

### 其他准备

为了更好的演示多域名下的 Nginx 配置，推荐使用[switchhost](https://github.com/oldj/SwitchHosts)修改客户端的配置
![](https://cdn.morningstar369.com/mweb/16580354059224.jpg)

## 初次使用

### 配置第一个站点

nginx 的配置文件在`/etc/nginx/`目录下(MacOS 中则在`/usr/local/etc/nginx/`下)，以`.conf`扩展名结尾。

1. 初始化配置文件
   原始的配置文件比较复杂，初次学习时可以将其备份下(将`nginx.conf`重命名为`nginx.conf.bak`)，后创建新的`nginx.conf`，并输入如下内容:
   ```nginx
   events {
   }
   http {
       server {
           listen 80;
           server_name local.com;
           return 200 "Bonjour, mon ami!\n";
       }
   }
   ```
2. 检验配置文件
   ```bash
   sudo nginx -t
   ```
3. 配置无误后可重新加载配置文件
   ```bash
   sudo nginx -s reload
   ```
4. 通过`curl`查看效果
   ```bash
   curl -i http://local.com
   ```

### 基础概念: 指令和上下文

指令分为简单指令(`;`结尾)和块指令(`{}`括起来的指令)
能够在其中包含其他指令的块指令称为上下文(类似作用域)。
Nginx 有四个核心上下文:

- `events`: 用于设置 nginx 在一般级别处理请求的全局配置，具有唯一性
- `http`: 定义服务器将如何处理 HTTP 和 HTTPS 请求的配置，也具有唯一性
- `server`: 嵌套在`http`中，用于在单个主机内配置特定的虚拟服务器
- `main`: `main`上下文是配置文件本身，所有其他上下文都包含在`main`中

## 静态内容服务

之前最基础的配置中，我们已经可以通过让 Nginx 响应一个纯文本了，下面尝试让 Nginx 提供静态文件。

### 获取源码

为了方便学习，可以在 Nginx 配置的根目录下创建`www`目录用于存放站点项目源代码。

```bash
git clone https://github.com/HenryJi529/nginx-demo-projects.git
```

### 提供静态内容

现在有了要提供的静态内容，更新`nginx.conf`

```nginx
events {
}
http {
    server {
        listen 80;
        server_name local.com;
        root /usr/local/etc/nginx/www/static-demo;
    }
}
```

`root`用于声明站点的根目录，是 Nginx 在收到相应请求后查找的路径

访问[http://local.com](http://local.com)
![](https://cdn.morningstar369.com/mweb/16580551862411.jpg)
尽管 Nginx 已正确提供`index.html`，但似乎 CSS 样式不起作用。

### 静态文件类型处理

观察静态网站，得出 css 的路径为 http://local.com/css/style.css
![](https://cdn.morningstar369.com/mweb/16580554216323.jpg)
通过`curl`查看请求请求报文首部

```bash
curl -I http://local.com/css/style.css
-------------------------------------------
HTTP/1.1 200 OK
Server: nginx/1.23.0
Date: Sun, 17 Jul 2022 11:02:00 GMT
Content-Type: text/plain
Content-Length: 474
Last-Modified: Wed, 22 Jun 2022 16:13:08 GMT
Connection: keep-alive
ETag: "62b33f94-1da"
Accept-Ranges: bytes
```

其中, `Content-Type`标记这个 css 文件为`text/plain`而不是`text/css`, 这就是网页格式未能展现的原因。

可以通过引入`mime.types`文件加以解决([MIME: Multipurpose Internet Mail Extensions](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types))

```nginx
events {
}
http {
    include mime.types;
    server {
        listen 80;
        server_name local.com;
        root /usr/local/etc/nginx/www/static-demo;
    }
}
```

`include`关键字可以用于引入模块，便于模块化配置。
重新加载配置并通过`curl`查看 css 的响应首部

```bash
curl -I http://local.com/css/style.css
-------------------------------------------
HTTP/1.1 200 OK
Server: nginx/1.23.0
Date: Sun, 17 Jul 2022 11:45:10 GMT
Content-Type: text/css
Content-Length: 474
Last-Modified: Wed, 22 Jun 2022 16:13:08 GMT
Connection: keep-alive
ETag: "62b33f94-1da"
Accept-Ranges: bytes
```

`Content-Type`已经成功转化成`text/css`。
再通过浏览器访问页面:
![](https://cdn.morningstar369.com/mweb/16580587514604.jpg)

### `root`与`alias`

`root`与`alias`都用于在提供静态服务时指定文件路径，但

- `alias`只能用在`location`上下文中
- 通过`root`获得的文件目录是`root`路径+`location`路径；通过`alias`获得的文件目录是`alias`路径(直接替换掉`location`路径)

## 动态路由

上一小节实现了一个简单的静态内容服务器配置，它获取与 URI 相匹配的站点文件，并进行相应。

然而，如果访问的 URI 无法匹配到站点文件，将返回默认的 404 页面
![](https://cdn.morningstar369.com/mweb/16580615401815.jpg)

这一问题可以通过动态路由配置来解决
在本节，需要了解`location`上下文、变量、重定向、重写以及`try_files`指令。

### 位置匹配

#### 前缀匹配

更新配置如下:

```nginx
events {
}
http {
    include mime.types;
    server {
        listen 80;
        server_name local.com;
        root /usr/local/etc/nginx/www/static-demo;

        location /location1 {
            return 200 "location1\n";
        }
    }
}
```

这里引入了`location`上下文，这个上下文通常嵌套在`server`块中。

通过`curl`测试配置效果

```bash
curl -i http://local.com/location1
-------------------------------------------
HTTP/1.1 200 OK
Server: nginx/1.23.0
Date: Sun, 17 Jul 2022 12:51:28 GMT
Content-Type: text/plain
Content-Length: 10
Connection: keep-alive

location1
```

访问[http://local.com/location1/](http://local.com/location1/), [http://local.com/location11/](http://local.com/location11/), [http://local.com/location11/1](http://local.com/location11/1)也能获得相同的结果。事实上通过这一配置，任何`location1/`都能被匹配到。这种匹配被称为**前缀匹配**。

#### 完全匹配

要进行**完全匹配**，需更新配置为

```nginx
events {
}
http {
    include mime.types;
    server {
        listen 80;
        server_name local.com;
        root /usr/local/etc/nginx/www/static-demo;

        location = /location1 {
            return 200 "location1\n";
        }
    }
}
```

这种配置下，向除`/location1`外，甚至`/location1/`都会得到 404 响应。

```bash
curl -I http://local.com/location1/
-------------------------------------------
HTTP/1.1 404 Not Found
Server: nginx/1.23.0
Date: Sun, 17 Jul 2022 13:30:40 GMT
Content-Type: text/html
Content-Length: 153
Connection: keep-alive
```

完全匹配还有一些诡异的特性，可以看下面的例子

```nginx
events {
}
http {
    include mime.types;
    server {
        listen 80;
        server_name local.com;
        location = /www {
            root /usr/local/etc/nginx;
        }
    }
}
```

通过实验可以知道，此时访问[http://local.com/www](http://local.com/www)仍然返回 404。根据 root 与 location 的原理，此时匹配的应该是`/usr/local/etc/nginx/www/index.html`，虽然根目录上却有这样的文件，但因为完全匹配的机制，依旧引发了 404。

#### 正则匹配

```nginx
events {
}
http {
    include mime.types;
    server {
        listen 80;
        server_name local.com;
        location ~ /hello[0-9] {
            return 200 "Hello\n";
        }
    }
}
```

通过`~`，告诉 Nginx 执行正则表达式匹配

```bash
curl -i http://local.com/hello1/12
-------------------------------------------
HTTP/1.1 200 OK
Server: nginx/1.23.0
Date: Sun, 17 Jul 2022 15:22:49 GMT
Content-Type: text/plain
Content-Length: 6
Connection: keep-alive

Hello
```

实际上，不考虑优先级的情况下，前缀匹配也可以看作特殊的正则匹配，而完全匹配可以看作是路径加上`$`的正则匹配。

默认情况下，正则表达式区分大小写，通过`~*`就可以转化为不区分大小写。

#### 匹配优先级

| 匹配模式     | 标记符      | 优先级 |
| ------------ | ----------- | ------ |
| 完全匹配     | `=`         | 1      |
| 优先前缀匹配 | `^~`        | 2      |
| 正则匹配     | `~` or `~*` | 3      |
| 前缀匹配     | None        | 4      |

不妨验证一下：

1. 更新 Nginx 配置如下:
   ```nginx
   events {
   }
   http {
       include mime.types;
       server {
           listen 80;
           server_name local.com;
           location /hello7 {
               return 200 "Hello7\n";
           }
           location ^~ /hello8 {
               return 200 "hello8\n";
           }
           location ~ /hello[0-9] {
               return 200 "hello\n";
           }
       }
   }
   ```
2. 通过`curl`查看结果:
   - 正则匹配与优先前缀匹配同时满足时，选择优先前缀匹配
     ```bash
     curl http://local.com/hello8
     -------------------------------------------
     hello8
     ```
   - 正则匹配与前缀匹配同时满足时，选择正则匹配
     ```bash
     curl http://local.com/hello7
     -------------------------------------------
     hello
     ```

此外, 值得注意的是，**对于同属一个优先级的正则匹配，是按照在文件中的顺序进行匹配的**。

#### 内部匹配

`@`用于定义一个 location 块，不能被客户端直接访问，只能被 Nginx 内部配置指令访问，如`try_files`或`error_page`
`nginx events { } http { include mime.types; server { listen 80; server_name local.com; location / { error_page 418 = @queryone; error_page 419 = @querytwo; error_page 420 = @querythree; if ( $args ~ "service=one" ) { return 418; } if ( $args ~ "service=two" ) { return 419; } if ( $args ~ "service=three" ) { return 420; } } location @queryone { return 200 'do stuff for one\n'; } location @querytwo { return 200 'do stuff for two\n'; } location @querythree { return 200 'do stuff for three\n'; } } } `
通过`curl`测试:
`bash curl "http://local.com/1?service=one" ------------------------------------------- do stuff for one `

### 变量

#### 定义与查看

Nginx 通过`set`可以在配置文件的任何位置定义新变量，
具体用法如下:

```nginx
# set $<variable_name> <variable_value>;
set name "Farhan"
set age 25
set is_working true
```

Nginx 支持三种类型的变量

- 字符串
- 整型
- 布尔型

除去自己申明外，nginx 还有[内置变量](https://nginx.org/en/docs/varindex.html)

这里提供一个简单的方法设置与查看变量：

1. 配置 nginx.conf
   ```nginx
   events {
   }
   http {
       include mime.types;
       server {
           listen 80;
           server_name local.com;
           return 200 "Host - $host\nURI - $uri\nArgs - $args\n";
       }
   }
   ```
2. 用`curl`访问[http://local.com/1?name=henry](http://local.com/1?name=henry)
   ```bash
   curl "http://local.com/1?name=henry&age=18"
   -------------------------------------------
   Host - local.com
   URI - /1
   Args - name=henry&age=18
   Name - henry
   ```
   显然，`$host`保存根地址，`$uri`保存相对于根的请求 URI，而`$args`包含所有查询字符串。
   此外，通过`set $name $arg_name;`可以将查询的字符串变量的值保存在了 Nginx 的新变量中。

#### 常用的内置变量

- `$remote_addr`: 存放了客户端的公网 IP
- `$host`保存根地址
- `$uri`保存相对于根的请求 URI
- `$request_uri`: 包含请求参数的原始 URI
- `$args`包含所有查询字符串
- `$http_user_agent`: 客户端浏览器的详细信息
- `$http_cookie`: 客户端的 cookie 信息
- `$remote_port`: 客户端访问 Nginx 服务器随机打开的端口
- `$request_method`: 请求资源的方式，GET/PUT/DELETE 等
- `$scheme`: 请求的协议，如 ftp，https，http 等
- `$server_protocol`: 保存了客户端请求资源使用的协议的版本，如 HTTP/1.0，HTTP/1.1，HTTP/2.0 等
- `$server_addr`: 保存了服务器的 IP 地址
- `$server_name`: 请求的服务器的主机名
- `$server_port`: 请求的服务器的端口号

### 命令

#### return

该命令一般用于对请求的客户端直接返回状态码(3XX,4XX)，或者用于测试路由(200)。
语法:

```nginx
return code [text];
return [code] URL;
```

#### rewrite

用于通知客户端，请求的资源已经换地方，例如访问 joke.morningstar369.com，转到 morningstar369.com/joke/
用法:

```nginx
rewrite regex URL [flag];
```

关于 flag 中的`redirect`与`last`:

- redirect: 返回包含 302 代码的临时重定向，在替换字符串不以`http://`等开头时使用
- permanent: 返回包含 301 代码的永久重定向

#### deny

用于禁止访问某个目录下的文件，用法如下：

```nginx
location /directory {
    location ~ .*\.(scss)?$ {
        deny all;
    }
}
```

## 日志系统

默认情况下，nginx 的日志文件位于`/var/log/nginx/`目录下(MacOS 中则在`/usr/local/var/log/nginx/`下)，以`.log`扩展名结尾。

```bash
ls -l /usr/local/var/log/nginx
-------------------------------------------
total 512
-rw-r--r--  1 henry529  admin  168023 Jul 20 10:13 access.log
-rw-r--r--  1 henry529  admin   79382 Jul 20 08:18 error.log
```

### 基础使用

1. 配置`nginx.conf`
   ```bash
   events {
   }
   http {
       include mime.types;
       server {
           listen 80;
           server_name local.com;
           return 200 "success\n";
       }
   }
   ```
2. 清空这两个文件
   ```bash
   rm /usr/local/var/log/nginx/access.log /usr/local/var/log/nginx/error.log
   ```
3. 重新开启 Nginx 服务
   ```bash
   sudo nginx -s reload
   ```
   如果不向 Nginx 发送`reopen`信号，他会继续将日志写入之前打开的流，新文件将保持为空。
4. 通过`curl`访问网站根目录
   ```bash
   curl -i http://local.com
   -------------------------------------------
   HTTP/1.1 200 OK
   Server: nginx/1.23.1
   Date: Sun, 24 Jul 2022 04:59:05 GMT
   Content-Type: text/plain
   Content-Length: 8
   Connection: keep-alive
   ...
   success
   ```
5. 查看日志
   ```bash
   cat /usr/local/var/log/nginx/access.log
   -------------------------------------------
   127.0.0.1 - - [24/Jul/2022:12:55:16 +0800] "GET / HTTP/1.1" 200 8 "-" "curl/7.79.1"
   ```

### 配置日志系统

1. 修改常规日志位置
   ```nginx
   access_log /var/logs/nginx/admin.log;
   ```
2. 修改错误日志位置及级别
   ```nginx
   error_log /var/log/error.log warn
   ```
   有八个级别的错误消息:
   - debug – 有助于确定问题所在的有用调试信息。
   - info - 不需要阅读但可能很好了解的信息性消息。
   - notice - 发生了一些值得注意的正常现象。
   - warn - 发生了意外，但不必担心。
   - error - 某些事情不成功。
   - crit - 存在急需解决的问题。
   - alert - 需要迅速采取行动。
   - emerg - 系统处于无法使用的状态，需要立即关注。

## 反向代理

**反向代理**: 客户端向 Nginx 服务器发起请求，而 Nginx 再将请求传递给后端；后端服务器处理完请求后，将其发送回 Nginx，之后，Nginx 将响应返给客户端。整个过程中，客户端不知道谁在实际处理请求，所以要反向代理。

### 简易案例

配置`nginx.conf`:

```nginx
events {
}
http {
    include mime.types;
    server {
        listen 80;
        server_name local.com;
        location / {
            proxy_pass https://segmentfault.com/;
        }
    }
}
```

访问[http://local.com](http://local.com)，将看到原始的思否站点:
![](https://cdn.morningstar369.com/mweb/16586432800096.jpg)

### 搭配 Python 后端

1. 在 Nginx 配置根目录下执行:
   ```bash
   python3 www/python-socket-demo/server.py
   -------------------------------------------
   Server started...
   ```
2. 通过`curl`检测 Python 后端是否正常运行
   ```bash
   curl -i 127.0.0.1:8000
   -------------------------------------------
   HTTP/1.1 200 OK
   Content-Type: text/html
   ...
   Hello World
   ```
3. 更新 nginx 配置如下:
   ```nginx
   events {
   }
   http {
       include mime.types;
       server {
           listen 80;
           server_name local.com;
           location / {
               proxy_pass http://localhost:8000;
           }
       }
   }
   ```
4. 通过浏览器检查反向代理是否成功
   ![](https://cdn.morningstar369.com/mweb/16586460626307.jpg)
   显示的正是后端的响应，说明反向代理成功

## 负载均衡

由于 Nginx 的反向代理设计，可以轻松地将其配置为负载均衡器。

这里通过`load-balancer-demo/`目录下的三个 server 来演示下:

1. 在三个终端中分别启动三个 server:
   ```bash
   node www/load-balancer-demo/server-x.js
   ```
2. 更新 nginx 配置如下:
   ```nginx
   events {
   }
   http {
       include mime.types;
       upstream backend_servers {
           server localhost:3001;
           server localhost:3002;
           server localhost:3003;
       }
       server {
           listen 80;
           server_name local.com;
           location / {
               proxy_pass http://backend_servers;
           }
       }
   }
   ```
   其中，`upstream`是一组可以被视为单个后端的服务器。
3. 通过`curl`检测：
   ```bash
   while sleep 0.5; do curl http://local.com; done
   -------------------------------------------
   response from server - 1.
   response from server - 2.
   response from server - 3.
   response from server - 1.
   response from server - 2.
   response from server - 3.
   response from server - 1.
   response from server - 2.
   ```
   可以看到，负载均衡已经实现。

## 配置文件模块化

一般来说`nginx.conf`应该有 nginx 维护者而不是服务器管理员来更改。所以，在实际配置 nginx 中，不修改`nginx.conf`，而是通过原始配置文件中自带的`include conf.d`等命令，导入模块化的站点配置文件。

## 参考

1. [NGINX 完全手册](https://chinese.freecodecamp.org/news/the-nginx-handbook/#how-to-understand-directives-and-contexts-in-nginx)
2. [吐血整理-关于 Nginx 的 location 匹配规则总结看这一篇就够了](https://juejin.cn/post/6908623305129852942)
