# -*- coding: utf-8 -*-
"""
https://tool.oschina.net/encrypt?type=3
"""
import base64
import json
import copy
import os
from . import ghelper
# import ghelper # NOTE: 单文件测试


class Node(object):
    def __init__(self, node_name, node_url_old):
        self.PREFIX = "vmess://"
        self.name = node_name
        self.url_old = node_url_old
        self.link_old = self.url_old[len(self.PREFIX):]
        self.link_new = ""
        self.url_new = ""

    def __str__(self):
        return self.name

    def convert(self):
        link_bytes_old = self.link_old.encode('ascii')
        config_bytes_old = base64.b64decode(link_bytes_old)
        config_old = config_bytes_old.decode('ascii')
        j_old = json.loads(config_old)
        # 修改配置
        j_new = copy.deepcopy(j_old)
        j_new["ps"] = self.name
        # 重新生成url
        config_new = json.dumps(j_new)
        config_bytes_new = config_new.encode('ascii')
        link_bytes_new = base64.b64encode(config_bytes_new)
        self.link_new = link_bytes_new.decode('ascii')
        self.url_new = self.PREFIX + self.link_new


def get_nodes_old(node_file):
    with open(node_file) as f:
        nodes_old = dict(json.load(f))["nodes"]
    return nodes_old


def convert_node_url(nodes_old):
    nodes_url_new = []
    for node_old in nodes_old:
        name = node_old["name"]
        url_old = node_old["url"]
        node = Node(node_name=name, node_url_old=url_old)
        node.convert()
        nodes_url_new.append(node.url_new)
    return nodes_url_new


def generate_secret(plain):
    plain_bytes = plain.encode('ascii')
    secret_bytes = base64.b64encode(plain_bytes)
    secret = secret_bytes.decode('ascii')
    return secret


def generate_html(plain, html_file):
    plain_bytes = plain.encode('ascii')
    secret_bytes = base64.b64encode(plain_bytes)
    secret = secret_bytes.decode('ascii')
    with open(html_file, "w") as f:
        f.write(secret)


def run(node_file):
    # 读取
    nodes_old = get_nodes_old(node_file)
    # print("文件加载完成...")
    # 转换
    nodes_url_new = convert_node_url(nodes_old)
    # print("节点转换完成...")
    # 添加外部urls
    try:
        ghelper_url = ghelper.export_nodes()
        nodes_url_new.extend(ghelper_url)
    except:
        pass
    # 发布
    plain = ""
    for node_url_new in nodes_url_new:
        plain += node_url_new + "\n"
    secret = generate_secret(plain)
    return secret
