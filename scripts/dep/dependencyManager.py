import json
import csv
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
PACKAGES_INFO_PATH = "scripts/dep/packagesInfo.csv"

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
    def __init__(self, environment_path=ENVIRONMENT_PATH, dev_requirements_path=DEV_REQUIREMENTS_PATH, prod_requirements_path=PROD_REQUIREMENTS_PATH, pkl_path=PKL_PATH, packages_info_path=PACKAGES_INFO_PATH, flag_verbose=False, flag_update=False, is_install=False):
        self.environment_path = environment_path
        self.dev_requirements_path = dev_requirements_path
        self.prod_requirements_path = prod_requirements_path
        self.pkl_path = pkl_path
        self.packages_info_path = packages_info_path
        self.flag_verbose = flag_verbose
        self.flag_update = flag_verbose

        self.expire_time = EXPIRE_TIME

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

        if not is_install:
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
        if "latestVersionInfo" in self.pipCache and self.pipCache["latestVersionInfo"]["time"] > time.time() - self.expire_time and not self.flag_update:
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
        if f"pipShow-{str(packageName)}" in self.pipCache and self.pipCache[f"pipShow-{str(packageName)}"]["time"] > time.time() - self.expire_time and not self.flag_update:
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

    def installPackages(self):
        for package in self.packages:
            if self.flag_verbose:
                result = subprocess.run(["pip", "install", f"{package.name}=={package.version}"])
            else:
                result = subprocess.run(["pip", "install", f"{package.name}=={package.version}"], stdout=subprocess.DEVNULL)
            print(f"安装成功: {package.name}=={package.version}")
        print("安装完成: 共安装了{}个包".format(len(self.packages)))

    def exportPackages(self):
        devRequires = set()
        prodRequires = set()
        for package in self.packages:
            if package.inDev:
                devRequires.add((package.name, package.version))
            else:
                prodRequires.add((package.name, package.version))
                devRequires.add((package.name, package.version))
        devRequires = sorted(devRequires, key=lambda x: x[0])
        prodRequires = sorted(prodRequires, key=lambda x: x[0])
        with open(self.dev_requirements_path, "w") as f:
            for package in devRequires:
                f.write(f"{package[0]}=={package[1]}\n")
        with open(self.prod_requirements_path, "w") as f:
            for package in prodRequires:
                f.write(f"{package[0]}=={package[1]}\n")


def handle(args):
    environment_path = ENVIRONMENT_PATH
    dev_requirements_path = DEV_REQUIREMENTS_PATH
    prod_requirements_path = PROD_REQUIREMENTS_PATH
    pkl_path = PKL_PATH
    packages_info_path = PACKAGES_INFO_PATH
    flag_verbose = False
    flag_update = False
    is_install = False

    if args.environmentPath:
        if pathlib.Path(args.environmentPath).parent.exists():
            environment_path = args.environmentPath
        else:
            raise Exception(f"environmentPath {str(pathlib.Path(args.environmentPath).parent)} is not exist")
    if args.devRequirementsPath:
        if pathlib.Path(args.devRequirementsPath).parent.exists():
            dev_requirements_path = args.devRequirementsPath
        else:
            raise Exception(f"devRequirementsPath {str(pathlib.Path(args.devRequirementsPath).parent)} is not exist")
    if args.prodRequirementsPath:
        if pathlib.Path(args.prodRequirementsPath).parent.exists():
            prod_requirements_path = args.prodRequirementsPath
        else:
            raise Exception(f"prodRequirementsPath {str(pathlib.Path(args.prodRequirementsPath).parent)} is not exist")
    if args.pklPath:
        if pathlib.Path(args.pklPath).parent.exists():
            pkl_path = args.pklPath
        else:
            raise Exception(f"pklPath {str(pathlib.Path(args.pklPath).parent)} is not exist")
    if args.packagesInfoPath:
        if pathlib.Path(args.packagesInfoPath).parent.exists():
            packages_info_path = args.packagesInfoPath
        else:
            raise Exception(f"packagesInfoPath {str(pathlib.Path(args.packagesInfoPath).parent)} is not exist")
    if args.verbose:
        flag_verbose = True
    if args.update:
        flag_update = True
    args.action = args.action[0]
    if args.action == "install":
        is_install = True

    manager = Manager(environment_path=environment_path, dev_requirements_path=dev_requirements_path, prod_requirements_path=prod_requirements_path, pkl_path=pkl_path, packages_info_path=packages_info_path, flag_verbose=flag_verbose, flag_update=flag_update, is_install=is_install)

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
                    print(f"依赖: {package.requires}")
                    print(f"是否在开发中使用: {package.inDev}")

        if not args.packageName:
            with open(manager.packages_info_path, "w") as f:
                writer = csv.writer(f)
                writer.writerow(['名称', '版本', '最新版本', '用途/概要', '主页', '是否锁定版本', '关于版本的说明', '依赖', '是否在开发中使用'])
            for packageName in manager.devPackageNames:
                showPackageInfo(packageName)
                print("====================================================")
                with open(manager.packages_info_path, "a") as f:
                    writer = csv.writer(f)
                    for package in manager.packages:
                        if package.name == packageName:
                            writer.writerow([package.name, package.version, package.latestVersion, package.summary, package.homepage, package.locked, package.note, package.requires, package.inDev])

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

    elif args.action == "install":
        manager.installPackages()

    elif args.action == "export":
        manager.exportPackages()

    else:
        raise Exception(f"未知的action: {args.action}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='一个简单易用的Python环境管理工具(只维护environment.json中的核心包)')
    parser.add_argument('action', nargs=1, help='操作', choices=['show', 'upgrade', 'install', 'export'])
    parser.add_argument('-p', '--packageName', required=False, help='包名')
    parser.add_argument('--environmentPath', required=False, help='设置environment.json路径')
    parser.add_argument('--devRequirementsPath', required=False, help='设置requirements-dev.txt路径')
    parser.add_argument('--prodRequirementsPath', required=False, help='设置requirements-prod.txt路径')
    parser.add_argument('--pklPath', required=False, help='设置pip数据库路径')
    parser.add_argument('--packagesInfoPath', required=False, help='设置packagesInfo.csv路径')
    parser.add_argument('--update', action='store_true', help='更新pip数据库')
    parser.add_argument('--verbose', action='store_true', help='输出更多信息')
    args = parser.parse_args()
    handle(args)





