from django.contrib.auth import authenticate, login
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q
from ..models import User

def authenticate(identity=None, password=None):
	try:
		user = User.objects.get(Q(username=identity)|Q(email=identity)|Q(phone=identity))
		if user.check_password(password):
			return user
	except Exception as e:
		return None
