SITES = [
    {
        "title": "河海大学信息学院学生活动",
        "link": "https://cies.hhu.edu.cn/_s97/4093/list.psp",
        "description": "河海大学信息学院学生活动, 通过晨星小站抓取",
        "language": "zh-Hans",
        "feed": {
            "pattern": r"<td align=\"left\"><a href='(/\d{4}/\d{4}/\w*/page\.htm)' target='_blank' title='([^(font)]*)'>.*</a></td>\s*<td align=\"left\" width=\"30px\"><div style=\"white-space:nowrap\">(\d{4}-\d{2}-\d{2})</div></td>",
            "link_index": 1,
            "title_index": 2,
            "pubDate_index": 3,
            "description": "通知时间: {pubDate}<br>\n公告内容: {title}",
        },
    },
    {
        "title": "河海大学研究生学院通知公告",
        "link": "https://gs.hhu.edu.cn/_s91/3624/list.psp",
        "description": "河海大学研究生学院通知公告, 通过晨星小站抓取",
        "language": "zh-Hans",
        "feed": {
            "pattern": r"<li class=\"news n\d{1,2} clearfix\">\s*<span class=\"news_title\"><a href=\'(\/\d{4}\/\d{4}\/c3624a\w{6}\/page\.htm)\' target=\'_blank\' title=\'(.*)\'>(?:\2|<font style=\'color:#\w{6};\'>\2<\/font>)<\/a><\/span>\s*<span class=\"news_meta\">(\d{4}-\d{2}-\d{2})<\/span>\s*<\/li>",
            "link_index": 1,
            "title_index": 2,
            "pubDate_index": 3,
            "description": "通知时间: {pubDate}<br>\n公告内容: {title}",
        },
    },
]
