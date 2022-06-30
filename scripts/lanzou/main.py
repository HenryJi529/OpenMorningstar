from lanzou.api import LanZouCloud
import os

from dotenv import load_dotenv
env_path = os.getcwd() + "/.env"
load_dotenv(dotenv_path=env_path, verbose=True)

YLOGIN= os.getenv("YLOGIN")
PHPDISK_INFO = os.environ["PHPDISK_INFO"]
COOKIE = {'ylogin': YLOGIN, 'phpdisk_info': PHPDISK_INFO}

"""
File(name='纳什均衡与博弈论.epub', id=61631838, time='2022-02-06', size='377.5 K', type='epub', downs=0, has_pwd=False, has_des=False)
"""


class LanZouController:
	def __init__(self):
		self.lzy = LanZouCloud()
		self.lzy.login_by_cookie(COOKIE)
		self.download_path = os.getcwd() + "/Download"
		self.upload_path = os.getcwd() + "/Upload"

	def __download_file_by_id(self, id):
		self.lzy.down_file_by_id(id, save_path=self.download_path, overwrite=True)

	def __upload_file_by_name(self, name):
		file_path = self.upload_path + "/" + name
		code = self.lzy.upload_file(file_path)
		if code != LanZouCloud.SUCCESS:
			raise Exception("上传失败")

	def __get_id_from_from(self, name):
		files = self.lzy.get_file_list()
		for file in files:
			if file.name == name:
				return file.id
		return None

	def download_file(self, identity):
		if type(identity) == int:
			self.__download_file_by_id(identity)
		else:
			id = self.__get_id_from_from(identity)
			if id is not None:
				self.__download_file_by_id(id)
			else:
				raise Exception("文件不存在")

	def upload_file(self, identity):
		self.__upload_file_by_name(identity)
	
	def delete_file(self, identity):
		if type(identity) == int:
			self.lzy.delete(identity)
		else:
			id = self.__get_id_from_from(identity)
			if id is not None:
				self.lzy.delete(id)
			else:
				raise Exception("文件不存在")


	def display_files(self):
		files = self.lzy.get_file_list()
		for file in files:
			print(file)


def main():
	controller = LanZouController()
	# controller.delete_file("requirements.txt")
	controller.display_files()
	# controller.download_file("思维的乐趣.epub")
	# controller.download_file(61631696)
	

if __name__ == '__main__':
	main()