# %%
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from lib import Receiver
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS']  #MacOS自带
plt.rcParams['axes.unicode_minus']=False #用来正常显示负号

# %%
receiver = Receiver(M=5, K3=1e-12)

# %%
with plt.style.context('bmh'):
    data = receiver.I.flatten()
    plt.hist(data,bins=300)
    plt.xlabel(r"接收光强$I_r$")
    plt.ylabel(r"频数")
    plt.show()

# %%
with plt.style.context('bmh'):
    data = receiver.I.flatten()
    s = pd.Series(data)
    fig, ax = plt.subplots(1)
    s.plot(kind="kde", ax = ax)
    ax.set_xlabel(r"接收光强$I_r$")
    ax.set_ylabel(r"核密度")
    plt.show()

# %%



