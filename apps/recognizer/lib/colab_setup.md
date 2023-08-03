```py
# 安装依赖
!pip install torchmetrics
!pip install -U mlxtend
!pip install torchinfo

from IPython.display import clear_output
clear_output()

# 创建目录
from pathlib import Path
Path('data').mkdir(exist_ok=True)
Path('params').mkdir(exist_ok=True)

# 导入脚本
try:
    import engine
except:
    # Get the going_modular scripts
    print("[INFO] Couldn't find going_modular scripts... downloading them from GitHub.")
    !git clone https://github.com/HenryJi529/OpenMorningstar.git
    !mv OpenMorningstar/apps/recognizer/lib/*.py .
    !rm __init__.py
    !rm -rf OpenMorningstar
    print("[INFO] Finish downloading...")

# 挂在Google Drive
from google.colab import drive
drive.mount('/content/drive')
```
