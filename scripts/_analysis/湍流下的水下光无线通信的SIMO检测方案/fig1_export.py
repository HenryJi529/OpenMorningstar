# %%
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
# sns.set()

# %%
K3_list = [1e-12, 1e-13, 1e-14]
lambda_ = 530e-9
L = np.linspace(1, 50, 50)
rho0_list = [np.power(44.2 * K3 * np.power(2*np.pi/lambda_,2) * L,-3/5) for K3 in K3_list ]

# %%
with plt.style.context('bmh'):
    markers = ['o', '^', 'D']
    for K3 in K3_list:
        plt.semilogy(L, rho0_list[K3_list.index(K3)], label = f"K3 = {K3}".format(), marker=markers[K3_list.index(K3)], ms=3)
    plt.xticks(np.linspace(0, 50, 11))
    ticks = np.concatenate([np.linspace(5e-4, 1e-3, 6), np.linspace(1e-3, 1e-2, 10)[1:], np.linspace(1e-2, 1e-1, 10)[1:]])
    plt.yticks(ticks)
    plt.legend()
    plt.xlabel(r"Propagation length($m$)")
    plt.ylabel(r"Coherent length($m$)")
    plt.show()



# %%
