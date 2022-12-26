"""
代办：
1. 生成两个版本的requirements.txt
2. 绘制依赖图
3. 支持安装指令
"""

import json
import pathlib
import subprocess
import argparse
import time
import pickle
import logging
from functools import cached_property, lru_cache

ENVIRONMENT_PATH = "environment.json"
DEV_REQUIREMENTS_PATH = "requirements-dev.txt"
PROD_REQUIREMENTS_PATH = "requirements-prod.txt"
PKL_PATH = "scripts/dep/dependencyManager.pkl"
EXPIRE_TIME = 24*60*60


class Package:
    def __init__(self, name, version, summary=None, homepage=None, locked=False, note=None, dependencies=[], inDev=False):
        """
        name: 名称
        version: 版本
        summary: 用途/概要
        homepage: 主页
        locked: 是否锁定版本(True, False{默认})
        note: 关于版本的说明
        dependencies: 隐式依赖
        inDev: 是否在开发中使用(True, False{默认})
        """
        self.name = name
        self.locked = locked
        self.inDev = inDev
        self.note = note
        self.dependencies = dependencies
        self._version = version
        self._summary = summary
        self._homepage = homepage

    def __str__(self):
        return self.name

    @property
    def version(self):
        return self._version
    @version.setter
    def version(self, version):
        self._version = version

    @property
    def summary(self):
        return self._summary
    @summary.setter
    def summary(self, summary):
        if self._summary:
            return
        self._summary = summary

    @property
    def homepage(self):
        return self._homepage
    @homepage.setter
    def homepage(self, homepage):
        if self._homepage:
            return
        self._homepage = homepage

    @property
    def requires(self):
        return self._requires
    @requires.setter
    def requires(self, requires):
        self._requires = requires
        if self.dependencies:
            self._requires.extend(self.dependencies)

    @property
    def latestVersion(self):
        return self._latestVersion
    @latestVersion.setter
    def latestVersion(self, latestVersion):
        self._latestVersion = latestVersion


class Manager:
    def __init__(self, environment_path=ENVIRONMENT_PATH, dev_requirements_path=DEV_REQUIREMENTS_PATH, prod_requirements_path=PROD_REQUIREMENTS_PATH, pkl_path=PKL_PATH, expire_time=EXPIRE_TIME):
        self.environment_path = environment_path
        self.dev_requirements_path = dev_requirements_path
        self.prod_requirements_path = prod_requirements_path
        self.pkl_path = pkl_path
        self.expire_time = expire_time

        self.flag_verbose = False

        # 首先同步版本
        def synchronizeVersion(environment_path):
            result = subprocess.run(["pip", "list", "--format=json"], stdout=subprocess.PIPE)
            versionInfo = list(json.loads(result.stdout))

            with open(environment_path, 'r') as f:
                data = dict(json.load(f))

            for packageName in data:
                for each in versionInfo:
                    if each["name"] == packageName:
                        data[packageName]["version"] = each["version"]

            with open(environment_path, 'w') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)

        synchronizeVersion(self.environment_path)

        self.packages = self._getPackages()
        self.devPackageNames = self._getDevPackageNames()
        self.prodPackageNames = self._getProdPackageNames()

        if pathlib.Path(self.pkl_path).exists():
            with open(self.pkl_path, "rb") as f:
                self.pipCache = pickle.load(f)
        else:
            self.pipCache = {}

    def _getPackages(self):
        def read_json_as_dict(json_path):
            with open(json_path) as f:
                data = dict(json.load(f))
            return data
        
        data = read_json_as_dict(self.environment_path)

        packages = []
        for name, info in data.items():
            package = Package(
                name=name, version=info["version"], 
                summary=info.get("summary", None), homepage=info.get("homepage",None), 
                locked=info.get("locked", False), note=info.get("note", None), 
                dependencies=info.get("dependencies",[]), inDev=info.get("inDev", False)
            )
            packages.append(package)

        return packages

    def _getDevPackageNames(self):
        return [package.name for package in self.packages]
    
    def _getProdPackageNames(self):
        return [package.name for package in self.packages if not package.inDev]

    @cached_property
    def latestVersionInfo(self):
        if "latestVersionInfo" in self.pipCache and self.pipCache["latestVersionInfo"]["time"] > time.time() - self.expire_time:
            return self.pipCache["latestVersionInfo"]["data"]
        else:
            result = subprocess.run(["pip", "list", "--outdated", "--format=json"], stdout=subprocess.PIPE)
            latestVersionInfo = list(json.loads(result.stdout))

            self.pipCache["latestVersionInfo"] = {
                "time": time.time(), 
                "data": latestVersionInfo
            }
            with open(self.pkl_path, "wb") as f:
                pickle.dump(self.pipCache, f)

            return latestVersionInfo

    def isPackageLocked(self, packageName):
        if packageName not in self.devPackageNames:
            raise Exception(f"Package {packageName} is not in the environment")
        else:
            for package in self.packages:
                if package.name == packageName:
                    return package.locked

    @property
    def outdatedPackageNames(self):
        return [ item["name"] for item in self.latestVersionInfo if item["name"] in 
        [package.name for package in self.packages]
        ]

    @property
    def outdatedNotLockedPackageNames(self):
        return [ packageName for packageName in self.outdatedPackageNames
        if self.isPackageLocked(packageName) == False
        ]

    def getLatestVersion(self, packageName):
        for item in self.latestVersionInfo:
            if item["name"] == packageName:
                return item["latest_version"]

    def upgradePackage(self, packageName):
        if self.isPackageLocked(packageName):
            raise Exception(f"Package {packageName} is locked")
        else:
            self.updatePackageInfo(packageName)

            if self.flag_verbose:
                result = subprocess.run(["pip", "install", "-U", f"{packageName}"])
            else:
                result = subprocess.run(["pip", "install", "-U", f"{packageName}"], stdout=subprocess.DEVNULL)
            version = self.getLatestVersion(packageName)
            if result.returncode != 0:
                return {
                    "packageName": packageName,
                    "version": version,
                    "status": "error",
                }
                raise Exception(f"更新{packageName}失败...")
            # 因版本变动，
            # 所以需要更新packages中的信息，
            for package in self.packages:
                if package.name == packageName:
                    package.version = self.getLatestVersion(packageName)
            # 删除pip相关缓存，
            self.pipCache.pop(f"pipShow-{str(packageName)}")
            try:
                # 有可能已经被pop了
                self.pipCache.pop("latestVersionInfo")
            except KeyError:
                pass
            with open(self.pkl_path, "wb") as f:
                pickle.dump(self.pipCache, f)
            # 更新数据到环境文件中
            with open(self.environment_path, 'r') as f:
                data = dict(json.load(f))
            data[packageName]["version"] = self.getLatestVersion(packageName)
            with open(self.environment_path, 'w') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)

            return {
                "packageName": packageName,
                "version": version,
                "status": "ok",
            }

    def upgradeNotLockedPackages(self):
        results = []
        for packageName in self.outdatedNotLockedPackageNames:
            version = self.getLatestVersion(packageName)
            result = self.upgradePackage(packageName)
            results.append(result)
        return results

    @lru_cache
    def _getTextsFromPipShow(self, packageName):
        if f"pipShow-{str(packageName)}" in self.pipCache and self.pipCache[f"pipShow-{str(packageName)}"]["time"] > time.time() - self.expire_time:
            return self.pipCache[f"pipShow-{str(packageName)}"]["data"]
        else:
            result = subprocess.run(["pip", "show", str(packageName)], stdout=subprocess.PIPE)
            texts = result.stdout.decode("utf-8").split('\n')
            
            self.pipCache[f"pipShow-{str(packageName)}"] = {
                "time": time.time(),
                "data": texts
            }
            with open(self.pkl_path, "wb") as f:
                pickle.dump(self.pipCache, f)

            return texts
    def _getPackageInfoFromPipShow(self, packageName, infoName):
        texts = self._getTextsFromPipShow(packageName)
        try:
            info = [text.split(":", 1)[1].strip() for text in texts if text.startswith(infoName)][0]
        except:
            info = None
        return info
    def getPackageSummaryFromPipShow(self, packageName):
        return self._getPackageInfoFromPipShow(packageName, "Summary")
    def getPackageHomepageFromPipShow(self, packageName):
        return self._getPackageInfoFromPipShow(packageName, "Home-page")
    def getPackageRequiresFromPipShow(self, packageName):
        requires_str = self._getPackageInfoFromPipShow(packageName, "Requires")
        requires = requires_str.split(',')
        return requires

    def updatePackageInfo(self, packageName):
        if packageName not in self.devPackageNames:
            raise Exception(f"Package {packageName} is not in the environment")
        else:
            for package in self.packages:
                if package.name == packageName:
                    package.summary = self.getPackageSummaryFromPipShow(packageName)
                    package.homepage = self.getPackageHomepageFromPipShow(packageName)
                    package.requires = self.getPackageRequiresFromPipShow(packageName)
                    package.latestVersion = self.getLatestVersion(packageName)

def handle(args):
    manager = Manager()
    if args.verbose:
        manager.flag_verbose = True

    args.action = args.action[0]
    if args.action == "show":
        def showPackageInfo(packageName):
            manager.updatePackageInfo(packageName)
            for package in manager.packages:
                if package.name == packageName:
                    print(f"名称: {package.name}")
                    print(f"版本: {package.version}")
                    print(f"最新版本: {package.latestVersion}")
                    print(f"用途/概要: {package.summary}")
                    print(f"主页: {package.homepage}")
                    print(f"是否锁定版本: {package.locked}")
                    print(f"关于版本的说明: {package.note}")
                    print(f"依赖: {package.dependencies}")
                    print(f"是否在开发中使用: {package.inDev}")

        if not args.packageName:
            for packageName in manager.devPackageNames:
                showPackageInfo(packageName)
                print("====================================================")
        elif args.packageName not in manager.devPackageNames:
            raise Exception(f"{args.packageName}不在environment.json中")
        else:
            showPackageInfo(args.packageName)

    elif args.action == "upgrade":
        if not args.packageName:
            results = manager.upgradeNotLockedPackages()
            print(results)
        elif args.packageName not in manager.devPackageNames:
            raise Exception(f"{args.packageName}不在environment.json中")
        else:
            result = manager.upgradePackage(args.packageName)
            print(result)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='一个简单易用的Python环境管理工具(只维护environment.json中的核心包)')
    parser.add_argument('action', nargs=1, help='操作', choices=['show', 'upgrade'])
    parser.add_argument('-p', '--packageName', required=False, help='包名')
    parser.add_argument('--update', action='store_true', help='更新数据库')
    parser.add_argument('--verbose', action='store_true', help='输出更多信息')
    args = parser.parse_args()
    handle(args)





