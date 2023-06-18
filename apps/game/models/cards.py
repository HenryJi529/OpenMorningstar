"""
游戏牌分为基本牌、锦囊牌、装备牌三种类型；
其中，锦囊牌分为延时类锦囊牌和及时类锦囊牌，
装备牌分为武器牌、防具牌、坐骑牌、宝物牌。
"""

from .base import Card


class EquipmentCard(Card):
    pass


class BasicCard(Card):
    pass


class TacticCard(Card):
    pass


class InstantTacticsCard(TacticCard):
    pass


class DelayedTacticsCard(TacticCard):
    pass


class WeaponCard(EquipmentCard):
    pass


class ArmorCard(EquipmentCard):
    pass


class MountCard(EquipmentCard):
    pass


class OffensiveHorse(MountCard):
    pass


class DefensiveHorse(MountCard):
    pass


class TreasureCard(EquipmentCard):
    pass


# ==================================================


""" 
基本牌: 闪，杀，桃，酒
"""


class 闪(BasicCard):
    pass


class 杀(BasicCard):
    pass


class 桃(BasicCard):
    pass


class 酒(BasicCard):
    pass


"""
锦囊牌:
- 延时锦囊: 乐不思蜀，兵粮寸断，闪电
- 即时锦囊: 无中生有，过河拆桥，顺手牵羊，无懈可击，万箭齐发，南蛮入侵，桃园结义，决斗，借刀杀人，五谷丰登，铁索连环
"""


class 乐不思蜀(DelayedTacticsCard):
    pass


class 兵粮寸断(DelayedTacticsCard):
    pass


class 闪电(DelayedTacticsCard):
    pass


class 无中生有(InstantTacticsCard):
    pass


class 过河拆桥(InstantTacticsCard):
    pass


class 顺手牵羊(InstantTacticsCard):
    pass


class 无懈可击(InstantTacticsCard):
    pass


class 万箭齐发(InstantTacticsCard):
    pass


class 南蛮入侵(InstantTacticsCard):
    pass


class 桃园结义(InstantTacticsCard):
    pass


class 决斗(InstantTacticsCard):
    pass


class 借刀杀人(InstantTacticsCard):
    pass


class 五谷丰登(InstantTacticsCard):
    pass


class 铁索连环(InstantTacticsCard):
    pass


"""
装备牌:
- 武器牌: 雌雄双股剑，方天画戟，丈八蛇矛，青釭剑，贯石斧，古锭刀，寒冰剑，青龙偃月刀，朱雀羽扇，麒麟弓
- 防具牌: 八卦阵，仁王盾，白银狮子，藤甲
- 坐骑牌: 
    - 防御马: 的卢，绝影，爪黄飞电
    - 进攻马: 赤兔，大宛
- 宝物牌: 木牛流马，定澜夜明珠
"""


class 雌雄双股剑(WeaponCard):
    pass


class 方天画戟(WeaponCard):
    pass


class 丈八蛇矛(WeaponCard):
    pass


class 青釭剑(WeaponCard):
    pass


class 贯石斧(WeaponCard):
    pass


class 古锭刀(WeaponCard):
    pass


class 寒冰剑(WeaponCard):
    pass


class 青龙偃月刀(WeaponCard):
    pass


class 朱雀羽扇(WeaponCard):
    pass


class 麒麟弓(WeaponCard):
    pass


# ---------------------------------------------------


class 八卦阵(ArmorCard):
    pass


class 仁王盾(ArmorCard):
    pass


class 白银狮子(ArmorCard):
    pass


class 藤甲(ArmorCard):
    pass


# --------------------------------------------------


class 的卢(DefensiveHorse):
    pass


class 绝影(DefensiveHorse):
    pass


class 爪黄飞电(DefensiveHorse):
    pass


class 赤兔(OffensiveHorse):
    pass


class 大宛(OffensiveHorse):
    pass


# --------------------------------------------------


class 木牛流马(TreasureCard):
    pass


class 定澜夜明珠(TreasureCard):
    pass
