from pathlib import Path
import os
BASE_DIR = Path(__file__).resolve().parent.parent.parent

HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'
HAYSTACK_SEARCH_RESULTS_PER_PAGE = 8
HAYSTACK_CUSTOM_HIGHLIGHTER = 'Morningstar.utils.Highlighter'

HAYSTACK_CONNECTIONS = {
    'default': {
        # 使用whoosh引擎
        'ENGINE': 'Morningstar.whoosh_cn_backend.WhooshEngine',
        # 'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
        # 索引文件路径
        'PATH': os.path.join(BASE_DIR, 'whoosh_index'),
    }
}
