from django.shortcuts import render, HttpResponse


def index(request):
	return HttpResponse("三国杀")