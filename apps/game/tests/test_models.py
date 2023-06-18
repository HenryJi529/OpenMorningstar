from django.test import TestCase

from Morningstar.models import User

from ..models.base import Player, Room


class PlayerTest(TestCase):
    def setUp(self):
        # 生成测试用户列表
        usernameList = ["username" + str(ind) for ind in range(0, 7)]
        passwordList = ["password" + str(ind) for ind in range(0, 7)]
        self.userList = [
            User.objects.create(username=username, password=password)
            for username, password in zip(usernameList, passwordList)
        ]
        # 创建测试玩家列表
        self.playerList = [Player.objects.create(user=user) for user in self.userList]

    def test_str_representation(self):
        self.playerList[0].create_room()
        self.assertEqual(self.playerList[0].__str__(), "username0 in Room 1")

    def test_create_room(self):
        room1 = self.playerList[0].create_room()
        self.assertEqual(room1, self.playerList[0].room)
        self.assertTrue(self.playerList[0].isOwnRoom)

    def test_join_room(self):
        room1 = self.playerList[0].create_room()
        self.assertEqual(self.playerList[1].room, None)
        self.playerList[1].join_room(room1)
        self.assertEqual(self.playerList[1].room, room1)

    def test_leave_room(self):
        # player1创建room1，player2加入room1，此时房间总数为1，room1中的玩家数为2
        room1 = self.playerList[0].create_room()
        self.playerList[1].join_room(room1)
        self.assertEqual(room1.playerNum, 2)
        self.assertEqual(Room.objects.count(), 1)
        # player1离开room1，player2变为房主，此时房间总数为1，room1中的玩家数为1
        self.playerList[0].leave_room()
        self.assertEqual(room1.owner, self.playerList[1])
        self.assertEqual(Room.objects.count(), 1)
        # player2也离开room1，房间自毁，此时房间总数为0
        self.playerList[1].leave_room()
        self.assertEqual(Room.objects.count(), 0)
