from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth.decorators import login_required
from Morningstar.models import User

# 导入自定义的模型
from .models.base import Player, Room
from .models.heros import 刘备


def get_available_rooms():
    rooms = [ room for room in Room.objects.filter(isLocked=False) if not room.isFull ]
    return rooms


def index(request):
    hero1 = 刘备()
    return HttpResponse(f"{hero1.skillList}")