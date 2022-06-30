import json
import base64
import requests
URL = "https://ghelper.me/rss/9714f7c1e4741f547c37d4b0e13d580b"


def collect_vmess(configs):
    def is_vmess(url):
        if url.startswith("vmess"):
            return True
        else:
            return False
    configs_vmess = []
    for config in configs:
        if is_vmess(config):
            configs_vmess.append(config)
    return configs_vmess


def decode(link):
    link_bytes = link.encode('utf-8')
    config_bytes = base64.b64decode(link_bytes)
    config = config_bytes.decode('utf-8')
    return config


def encode(config):
    config_bytes = config.encode('utf-8')
    link_bytes = base64.b64encode(config_bytes)
    link = link_bytes.decode('utf-8')
    return link


def get_configs():
    link = requests.get(URL).text
    configs = collect_vmess(decode(link).split("\n"))

    return configs


def rename(urls_old):
    flag_hk = 0
    flag_tw = 0
    flag_us = 0
    flag_jp = 0
    flag_de = 0
    urls_new = []
    for url in urls_old:
        link = url[8:]
        config = decode(link)
        j = json.loads(config)
        if j["ps"].startswith("香港") or j["ps"].startswith("HK"):
            flag_hk += 1
            j["ps"] = "Ghelper_HK" + str(flag_hk)
        elif j["ps"].startswith("美国") or j["ps"].startswith("美國"):
            flag_us += 1
            j["ps"] = "Ghelper_US" + str(flag_us)
        elif j["ps"].startswith("日本"):
            flag_jp += 1
            j["ps"] = "Ghelper_JP" + str(flag_jp)
        elif j["ps"].startswith("台湾") or j["ps"].startswith("台灣"):
            flag_tw += 1
            j["ps"] = "Ghelper_TW" + str(flag_tw)
        elif j["ps"].startswith("德国"):
            flag_de += 1
            j["ps"] = "Ghelper_DE" + str(flag_de)
        else:
            pass
        config = json.dumps(j)
        link = encode(config)
        urls_new.append("vmess://" + link)
    return urls_new


def export_nodes():
    urls_old = get_configs()
    urls_new = rename(urls_old)
    return urls_new


def main():
    urls_old = get_configs()
    urls_new = rename(urls_old)
    print(urls_new)
    print(len(urls_new))


if __name__ == '__main__':
    main()
