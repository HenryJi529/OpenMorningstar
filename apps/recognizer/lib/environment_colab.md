# Colab Setup

1. 获取源码与运行环境
    ```py
    # %%capture

    # 安装/更新依赖
    %pip install torchmetrics
    %pip install -U mlxtend
    %pip install torchinfo
    %pip install -U torchvision

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

2. 启动tensorboard
    ```py
    # Let's view our experiments within TensorBoard from within the notebook
    %load_ext tensorboard
    %tensorboard --logdir drive/MyDrive/Morningstar/runs
    # !pkill -f tensorboard # kill the tensorboard instance if it's still running
    ```

3. 公开tensorboard到: http://server.morningstar369.com:16006
    ```py
    # 获取frpc
    !wget -q -c https://github.com/fatedier/frp/releases/download/v0.51.2/frp_0.51.2_linux_amd64.tar.gz
    !tar -xf frp_*
    !rm frp_*.gz
    !mv frp_*/frpc ./

    # 配置frpc
    config = """
    [common]
    server_addr = server.morningstar369.com
    server_port = 7000
    token = myToken
    [tensorboard-colab]
    type = tcp
    local_ip = 0.0.0.0
    local_port = 6006
    remote_port = 16006
    """
    with open("frpc.ini", "w") as file:
        file.write(config)

    # 启动frpc
    !./frpc -c ./frpc.ini &
    ```