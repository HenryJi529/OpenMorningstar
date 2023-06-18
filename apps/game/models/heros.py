from typing import Tuple, Dict, List

from .lib import Country, Sex
from .base import Hero


class 曹擦(Hero):
    def __init__(self):
        super().__init__(country=Country.WEI, health=4, sex=Sex.MALE)
        self._skillList = ["奸雄"]
        self._lordSkillList = ["护驾"]

    def 奸雄(self):
        pass

    def 护驾(self):
        pass


class 刘备(Hero):
    def __init__(self):
        super().__init__(country=Country.SHU, health=4, sex=Sex.MALE)
        self._skillList = ["仁德"]
        self._lordSkillList = ["激将"]

    def 仁德(self, targetHero: Hero):
        pass

    def 激将(self, targetHeroList: List[Hero]):
        pass


class 孙权(Hero):
    def __init__(self):
        super().__init__(country=Country.WU, health=4, sex=Sex.MALE)
        self._skillList = ["制衡"]
        self._lordSkillList = ["救援"]

    def 制衡(self):
        pass

    def 救援(self, targetHeroList: List[Hero]):
        pass


class 司马懿(Hero):
    def __init__(self):
        super().__init__(country=Country.WEI, health=3, sex=Sex.MALE)
        self._skillList = ["反馈", "鬼才"]

    def 反馈(self, targetHero: Hero):
        pass

    def 鬼才(self):
        pass


class 夏侯淳(Hero):
    def __init__(self):
        super().__init__(country=Country.WEI, health=3, sex=Sex.MALE)
        self._skillList = ["刚烈"]

    def 刚烈(self, targetHero: Hero):
        pass


class 甄姬(Hero):
    def __init__(self):
        super().__init__(country=Country.WEI, health=3, sex=Sex.FEMALE)
        self._skillList = ["倾国", "洛神"]

    def 倾国(self):
        pass


class 张辽(Hero):
    def __init__(self):
        super().__init__(country=Country.WEI, health=4, sex=Sex.MALE)
        self._skillList = ["突袭"]

    def 突袭(self, targetHero1: Hero, targetHero2: Hero = None):
        pass


class 许褚(Hero):
    def __init__(self):
        super().__init__(country=Country.WEI, health=4, sex=Sex.MALE)
        self._skillList = ["裸衣"]

    def 裸衣(self):
        pass


class 郭嘉(Hero):
    def __init__(self):
        super().__init__(country=Country.WEI, health=3, sex=Sex.MALE)
        self._skillList = ["天妒", "遗计"]

    def 天妒(self):
        pass

    def 遗计(self):
        pass


class 貂蝉(Hero):
    def __init__(self):
        super().__init__(country=Country.QUN, health=3, sex=Sex.FEMALE)
        self._skillList = ["离间", "闭月"]

    def 离间(self, targetHero1: Hero, targetHero2: Hero):
        pass


class 关羽(Hero):
    def __init__(self):
        super().__init__(country=Country.SHU, health=4, sex=Sex.MALE)
        self._skillList = ["武圣"]

    def 武圣(self):
        pass


class 张飞(Hero):
    # https://sanguosha.fandom.com/zh/wiki/%E5%BC%A0%E9%A3%9E
    """
    咆哮:
    替身:
    """

    def __init__(self):
        super().__init__(country=Country.SHU, health=4, sex=Sex.MALE)
        self._skillList = ["咆哮", "替身"]

    def 咆哮(self):
        pass

    def 替身(self):
        pass


class 诸葛亮(Hero):
    def __init__(self):
        super().__init__(country=Country.SHU, health=3, sex=Sex.MALE)
        self._skillList = ["观星", "空城"]

    def 观星(self):
        pass

    def 空城(self):
        pass


class 赵云(Hero):
    def __init__(self):
        super().__init__(country=Country.SHU, health=4, sex=Sex.MALE)
        self._skillList = ["龙胆"]

    def 龙胆(self):
        pass


class 马超(Hero):
    def __init__(self):
        super().__init__(country=Country.SHU, health=4, sex=Sex.MALE)
        self._skillList = ["铁骑"]

    def 铁骑(self, targetHero: Hero):
        pass


class 黄月英(Hero):
    def __init__(self):
        super().__init__(country=Country.SHU, health=3, sex=Sex.FEMALE)
        self._skillList = ["集智", "奇才"]

    def 集智(self):
        pass

    def 奇才(self):
        pass


class 甘宁(Hero):
    def __init__(self):
        super().__init__(country=Country.WU, health=4, sex=Sex.MALE)
        self._skillList = ["奇袭"]

    def 奇袭(self, targetHero: Hero):
        pass


class 吕蒙(Hero):
    def __init__(self):
        super().__init__(country=Country.WU, health=4, sex=Sex.MALE)
        self._skillList = ["克己"]

    def 克己(self):
        pass


class 周瑜(Hero):
    def __init__(self):
        super().__init__(country=Country.WU, health=3, sex=Sex.MALE)
        self._skillList = ["英姿", "反间"]

    def 英姿(self):
        pass

    def 反间(self, targetHero: Hero):
        pass


class 周盖(Hero):
    def __init__(self):
        super().__init__(country=Country.WU, health=4, sex=Sex.MALE)
        self._skillList = [
            "苦肉",
        ]

    def 苦肉(self):
        pass


class 陆逊(Hero):
    def __init__(self):
        super().__init__(country=Country.WU, health=3, sex=Sex.MALE)
        self._skillList = ["谦逊", "连营"]

    def 谦逊(self):
        pass

    def 连营(self):
        pass


class 大乔(Hero):
    def __init__(self):
        super().__init__(country=Country.WU, health=3, sex=Sex.FEMALE)
        self._skillList = ["国色", "流离"]

    def 国色(self, targetHero: Hero):
        pass

    def 流离(self, targetHero1: Hero, targetHero2: Hero):
        pass


class 孙尚香(Hero):
    def __init__(self):
        super().__init__(country=Country.WU, health=3, sex=Sex.FEMALE)
        self._skillList = ["结姻", "枭姬"]

    def 结姻(self, targetHero: Hero):
        pass

    def 枭姬(self):
        pass


class 华佗(Hero):
    def __init__(self):
        super().__init__(country=Country.QUN, health=3, sex=Sex.MALE)
        self._skillList = ["急救", "青囊"]

    def 急救(self, targetHero: Hero):
        pass

    def 青囊(self, targetHero: Hero):
        pass


class 吕布(Hero):
    def __init__(self):
        super().__init__(country=Country.QUN, health=4, sex=Sex.MALE)
        self._skillList = ["无双"]

    def 无双(self):
        pass


if __name__ == "__main__":
    hero = 刘备()
    print(hero.__class__.__name__)
