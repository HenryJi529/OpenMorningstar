from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import os
import io
from PIL import Image
import numpy as np
import matplotlib
from Morningstar.settings.common import MEDIA_ROOT
from random import randint


def __get_random_image():
	def get_image_list(image_dir):
		items = os.listdir(image_dir)
		image_list = []
		for item in items:
			ext = item.split('.')[1]
			if ext in ["png", "jpg", "jpeg"]:
				image_list.append(os.path.join(image_dir, item))
		return image_list

	image_dir = os.path.join(MEDIA_ROOT, 'lover')
	image_list = get_image_list(image_dir)
	image_num = len(image_list)
	image_ind = randint(0, image_num-1)
	image = Image.open(image_list[image_ind])
	return image


def show(request):
    image = __get_random_image()
    stream = io.BytesIO()
    image.save(stream, 'png')
    return HttpResponse(stream.getvalue(),"image/png")


def api(request):
	if request.method == "GET":
		# 读取客户端参数
		is_mobile = request.GET.get('isMobile')

		# 生成适配客户端的图片
		# 适配图片：1280x1706 600x800 3456x4608 1080x1440
		origin_image = __get_random_image()

		# if is_mobile == 'true':
		# 	image_width = 768
		# 	image_height = 1024
		# else:
		# 	image_width = 384
		# 	image_height = 512
		image_width = 384
		image_height = 512
		new_image = origin_image.resize((image_width,image_height))  # (width, height)

		# 数据处理
		array = np.asarray(new_image)  # (height,width,3)
		result = {
			"status": "success",
			"fills": [
			]
		}

		for i in range(0,image_height-4+1,4):
			for j in range(0,image_width-3+1,3):
				r = array[i+1,j+1,0]/2 + array[i+2,j+1,0]/2
				g = array[i+1,j+1,1]/2 + array[i+2,j+1,1]/2
				b = array[i+1,j+1,2]/2 + array[i+2,j+1,2]/2
				rgb = matplotlib.colors.rgb2hex([r/255,g/255,b/255])
				result["fills"].append(rgb)
		return JsonResponse(result)


def index(request):
	return render(request, 'lover/index.html')


def origin(request):
	return redirect("http://www.koalastothemax.com/")
