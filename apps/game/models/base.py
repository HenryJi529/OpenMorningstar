from typing import Tuple, Dict, List
import time
from django.db import models

from Morningstar.models import User

MAX_PLAYER_NUM = 9
MIN_PLAYER_NUM = 5


class Room(models.Model):
    players = models.ManyToManyField("Player", related_name="room_joined", blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    isLocked = models.BooleanField(default=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.game = Game()

    @property
    def owner(self):
        return self.players.first()

    def __str__(self):
        return f"Room {self.id}"

    @property
    def playerNum(self):
        return self.players.count()

    @property
    def isFull(self):
        return self.playerNum >= MAX_PLAYER_NUM

    def add_player(self, player):
        if self.isFull:
            raise Exception("The room is full.")
        if self.isLocked:
            raise Exception("The room is locked.")
        self.players.add(player)

        self.save()

    def remove_player(self, player):
        if player not in self.players.all():
            raise Exception("Player is not in room.")
        self.players.remove(player)

        if not self.players.exists():
            self.delete()
        else:
            self.save()

    def start_game(self):
        if self.players.count() < MIN_PLAYER_NUM:
            raise Exception("Need more players.")
        self.game.start()


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    room = models.ForeignKey("Room", on_delete=models.SET_NULL, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} in {self.room}"

    @property
    def isOwnRoom(self):
        if not self.room:
            return False

        return self.room.owner == self

    def create_room(self):
        if self.room:
            raise Exception("You already own a room!")

        self.room = Room()
        self.room.save()  # 只有先保存才能增加player
        self.room.add_player(self)
        self.save()

        return self.room

    def join_room(self, room: "Room"):
        if self.room:
            raise Exception("You already have a room!")

        self.room = room
        self.room.add_player(self)

        self.save()

    def leave_room(self):
        if not self.room:
            raise Exception("You are not in a room!")
        else:
            self.room.remove_player(self)
            self.room = None
            self.save()

    def switch_room(self, room: "Room"):
        # 退出上一个房间，并保存上一个房间的信息
        self.room.remove_player(self)
        # 加入下一个房间，并保存下一个房间的信息
        self.room = room
        self.save()
        self.room.add_player(self)

    def kick_player(self, player1: "Player"):
        if not self.isOwnRoom:
            raise Exception("You are not the owner of the room!")
        self.room.remove_player(self)
        player1.room = None
        player1.save()

    def start_game(self):
        if self.isOwnRoom:
            self.room.start_game()
        else:
            raise Exception("You are not the owner of the room!")


class Game:
    def start(self):
        time.sleep(2)
        print("Game Over")


class Card:
    def __init__(self, suit: str, rank: str, name):
        self._suit = suit
        self._rank = rank
        self._name = name

    @property
    def suit(self):
        return self._suit

    @property
    def rank(self):
        return self._rank

    @property
    def name(self):
        return self._name


class Hero:
    def __init__(self, country: str, health: int, sex: bool):
        self._country = country
        self._health = health
        self._sex = sex
        self._skillList = []
        self._lordSkillList = []
        self._currentSkillList = []

    @property
    def country(self):
        return self._country

    @property
    def health(self):
        return self._health

    @property
    def sex(self):
        return self._sex

    @property
    def skillList(self):
        return self._skillList

    @property
    def lordSkillList(self):
        return self._lordSkillList

    @property
    def currentSkillList(self):
        return self._currentSkillList
