import numpy as np
from scipy.stats import lognorm
from scipy.stats import norm
import matplotlib.pyplot as plt
from functools import cached_property


class Receiver:
    def __init__(self, M=5, K3=1e-12):
        self.lambda_ = 530e-9
        self.phi = 20
        self.FOV = 60
        self.D = 5e-2
        self.d = 10e-2
        self.eta = 0.35
        self.R = 1e6
        self.K = 1.380649e-23
        self.T = 300
        self.B = 150e6

        self.N = 100000 # sample size
        self.M = M
        self.K3 = K3

        self.N0 = 4 * self.K * self.T * self.B / self.R

    @property
    def L(self):
        theta = 2*np.pi/self.M
        a = np.power(self.d**2 /(2-2*np.cos(theta)),0.5)
        L = a / np.sin(self.phi*np.pi/180)
        return L

    @property
    def 里托夫方差(self):
        return 37.3 * self.K3 * np.power(2*np.pi/self.lambda_,7/6) * np.power(self.L,11/6)

    @property
    def sigma_squared(self):
        child1 = (0.49 * self.里托夫方差) / np.power(1+1.11*self.里托夫方差**(6/5),7/6)
        child2 = 0.51*self.里托夫方差 / np.power(1+0.69*self.里托夫方差**(6/5),5/6)
        return np.exp(child1 + child2) - 1

    @property
    def mu(self):
        return -self.sigma_squared/2

    @property
    def sigma(self):
        return np.sqrt(self.sigma_squared)

    @cached_property
    def log_norm(self):
        return lognorm(self.sigma, scale=np.exp(self.mu))

    @cached_property
    def I(self):
        # 行数为样本数，列数为接收检测器数
        return self.log_norm.rvs(size=self.N*self.M).reshape(self.N, self.M)

    def getMeanSNR(self):
        return 2 * self.eta**2 * (self.I**2).sum() / self.N0 / self.N / self.M

    def getIcByMRC(self):
        return np.sqrt((self.I**2).sum(1)/self.M)

    def getIcByEGC(self):
        return self.I.sum(1)/self.M

    def getIcBySC(self):
        return self.I.max(1)/np.sqrt(self.M)

    def getIc(self, method):
        if method == "MRC":
            return self.getIcByMRC()
        elif method == "EGC":
            return self.getIcByEGC()
        elif method == "SC":
            return self.getIcBySC()
        else:
            raise ValueError("method must be MRC, EGC or SC")

    def getMeanBER(self, method):
        Ic = self.getIc(method)
        BERs = norm.cdf(self.eta*Ic/np.sqrt(2*self.N0))
        return BERs.mean()


if __name__ == '__main__':
    receiver = Receiver(M=5, K3=1e-12)
    print(f"mu = {receiver.mu}")
    print(f"sigma = {receiver.sigma}")
    print(f"L = {receiver.L}")
    print(f"N0 = {receiver.N0}")
    print(f"max(I) = {receiver.I.max()}")
    print(f"min(I) = {receiver.I.min()}")
    print(f"meanSNR = {receiver.getMeanSNR()}")
    print(f'meanBER(MRC) = {receiver.getMeanBER("MRC")}')
    print(f'meanBER(SC) = {receiver.getMeanBER("SC")}')
    print(f'meanBER(EGC) = {receiver.getMeanBER("EGC")}')
