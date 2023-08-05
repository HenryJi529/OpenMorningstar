```py
# 安装/更新依赖
!pip install torchmetrics
!pip install -U mlxtend
!pip install torchinfo
!pip install -U torch
!pip install -U torchvision

# 创建目录
from pathlib import Path
Path('data').mkdir(exist_ok=True)

# 导入脚本
try:
    import engine
except:
    # Get the going_modular scripts
    print("[INFO] Couldn't find going_modular scripts... downloading them from GitHub.")
    !git clone https://github.com/HenryJi529/OpenMorningstar.git
    !mv OpenMorningstar/apps/recognizer/lib/*.py .
    !mv OpenMorningstar/apps/recognizer/lib/data/*.json ./data/
    !rm __init__.py
    !rm -rf OpenMorningstar
    print("[INFO] Finish downloading...")

# 挂载Google Drive
from google.colab import drive
drive.mount('/content/drive')

# 清理Jupyter Cell
from IPython.display import clear_output
clear_output()
```
