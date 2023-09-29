"""
灵感来源: https://feed43.com/
"""

import requests
import re
from urllib3 import disable_warnings
from urllib3.exceptions import InsecureRequestWarning


from .config import SITES


def get_sources_num():
    return len(SITES)


def get_title_from_index(index):
    return SITES[index]["title"]


def get_link_from_index(index):
    return SITES[index]["link"]


def get_items(site):
    def get_text(link):
        # 针对有些网站证书无效
        disable_warnings(InsecureRequestWarning)
        r = requests.get(link, timeout=120, verify=False)  # 针对反爬，需要增加timeout
        r.raise_for_status()
        r.encoding = r.apparent_encoding
        return r.text

    items = []
    text = get_text(site["link"])
    pattern = site["feed"]["pattern"]
    p = re.compile(pattern)
    matches = p.findall(text)
    for match in matches:
        link = match[site["feed"]["link_index"] - 1]
        title = match[site["feed"]["title_index"] - 1]
        pubDate = match[site["feed"]["pubDate_index"] - 1]
        description = site["feed"]["description"].format(
            pubDate=pubDate, title=title, link=link
        )

        item = {
            "link": link,
            "title": title,
            "pubDate": pubDate,
            "description": description,
        }
        items.append(item)
    return items


def get_data(site_index):
    site = SITES[site_index]
    title = site["title"]
    link = site["link"]
    description = site["description"]
    language = site["language"]
    items = get_items(site)
    lastBuildDate = items[0]["pubDate"]
    return (title, link, description, language, items, lastBuildDate)
