import json
import base64
import requests


class Ghelper:
    def __init__(self, url, id):
        """
        url: 原始的Ghelper链接
        data: Ghelper给出的原始数据
        link: 单个节点的配置(字符串格式)
        links: 节点配置列表(字符串列表)
        config: 单个节点的配置(JSON格式)
        configs: 节点配置列表(JSON列表)
        """
        self.url = url
        self.id = ["a", "b", "c", "d", "e", "f"][id]

    @property
    def links(self):
        def decode_str(str_encoded):
            str_encoded_bytes = str_encoded.encode('utf-8')
            str_decoded_bytes = base64.b64decode(str_encoded_bytes)
            str_decoded = str_decoded_bytes.decode('utf-8')
            return str_decoded

        def encode_str(str_decoded):
            str_decoded_bytes = str_decoded.encode('utf-8')
            str_encoded_bytes = base64.b64encode(str_decoded_bytes)
            str_encoded = str_encoded_bytes.decode('utf-8')
            return str_encoded

        def get_links_old(url):
            data = requests.get(url).text
            links_old = decode_str(data).split("\n")
            return links_old

        def rename_configs(configs_old):
            count = {"HK":0, "TW":0, "US":0, "JP":0, "DE":0, "UK":0, "SG":0, "KR":0}
            prefix = {"HK":["香港","HK"], "TW":["台湾","台灣"], "US":["美国","美國"], "JP":["日本"], "DE":["德国"], "UK":["英国","英國"], "SG": ["新加坡"], "KR": ["KR", "韩国", "韓國", "韩國"]}
            configs_new = []
            for config_old in configs_old:
                j = json.loads(config_old)

                for location in count:
                    for name in prefix[location]:
                        if j["ps"].startswith(name):
                            count[location] += 1
                            j["ps"] = f"Ghelper_{location}{self.id}" + str(count[location])

                config_new = json.dumps(j)
                configs_new.append(config_new)
            return configs_new

        # 通过request获取原始配置链接列表
        links_old = get_links_old(self.url)
        # 获取vmess协议的配置
        configs_old = [decode_str(link_old[8:]) for link_old in links_old if link_old.startswith("vmess")]
        # 更改vmess配置的名称
        configs_new = rename_configs(configs_old)
        # 生成新的配置链接列表
        links_new = ["vmess://" + encode_str(config_new) for config_new in configs_new]

        return links_new
