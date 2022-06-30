#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#define PACKAGE_NUM 80
#define LINE_SIZE 128
#define NAME_SIZE 32
#define VERSION_SIZE 16
#define NOTE_SIZE 128
#define PACKAGES_OUTDATED_SIZE 8196
#define ENVIRONMENT_FILE "environment.yml"
#define BREAK "#----------------------------\n"

struct Package
{
	char *info;
	char name[NAME_SIZE];
	char version[VERSION_SIZE];
	int flag; // 标记是否可以自动更新
	char note[NOTE_SIZE];
};

int display_packages(struct Package *packages, int length)
{
	for (int i = 0; i < length; i++)
	{
		printf("序号: %d | ", i);
		printf("标记: %d | ", packages[i].flag);
		printf("包名: %s | ", packages[i].name);
		printf("版本: %s | ", packages[i].version);
		printf("笔记: %s", packages[i].note);
		printf("\n");
	}
	return 0;
}

void *routine(void *arg)
{
	FILE *stream;
	char command[80];
	char version[VERSION_SIZE];
	char *packageName = (char *)arg;

	strcpy(command, "pip install --upgrade ");
	strcat(command, packageName);
	strcat(command, " > /dev/null");
	popen(command, "w");

	strcpy(command, "cat pip_list_outdated.txt | grep ");
	strcat(command, packageName);
	strcat(command, " | awk '{print $3}'");
	memset(version, '\0', sizeof(version));
	stream = popen(command, "r");
	fread(version, sizeof(char), sizeof(version), stream);
	pclose(stream);
	printf("%s: %s", packageName, version);
	return NULL;
}

int update_outdated_packages(struct Package *packages, int length)
{
	FILE *stream;
	char command[80];
	char version[VERSION_SIZE];
	char packages_outdated[PACKAGES_OUTDATED_SIZE];
	memset(packages_outdated, '\0', sizeof(packages_outdated));
	stream = popen("pip list --outdated | tee pip_list_outdated.txt | awk '{print $1}'", "r");
	fread(packages_outdated, sizeof(char), sizeof(packages_outdated), stream);
	pclose(stream);

	// 定义线程的id变量，多个变量使用数组
	pthread_t tids[length];

	char not_empty_flag = 0;

	for (int i = 0; i < length; i++)
	{
		if (packages[i].flag == 0)
		{
			continue;
		}
		if (strstr(packages_outdated, packages[i].name) != NULL)
		{
			if (not_empty_flag == 0)
			{
				// 显示开头
				printf("更新列表: \n");
				printf("==============================\n");
				not_empty_flag = 1;
			}
			if (pthread_create(&tids[i], NULL, routine, packages[i].name) != 0)
			{
				perror("pthread_create error");
			}
			if (pthread_join(tids[i], NULL) != 0)
			{
				perror("pthread_join error");
			}
		}
	}

	if (not_empty_flag == 0)
	{
		printf("没有待更新的Python包...\n");
	}
	else
	{
		// 显示结尾
		printf("==============================\n");
	}

	// 删除中间产物
	system("rm pip_list_outdated.txt");
	return 0;
}

void trim(char *str1, int length)
{
	for (int i = length - 1; i >= 0; i--)
	{
		if (*(str1 + i) == ' ')
		{
			*(str1 + i) = '\0';
		}
	}
}

int process_line(char *line, int flag, struct Package *packages, int index)
{
	if (!(*line == '#' || *line == '\n' || strcmp(line, "") == 0))
	{
		packages[index].flag = flag;
		char *startP = line;
		char *versionP = strchr(line, ':');
		char *noteP = strchr(line, '#');

		int packageInfoLen = strlen(line);
		int packageNameLen = (int)(versionP - startP);
		int packageVersionLen = noteP != NULL ? (int)(noteP - versionP) : packageInfoLen - packageNameLen - 1;
		int packageNoteLen = noteP != NULL ? packageInfoLen - packageVersionLen - packageNameLen - 1 : 0;

		// 拷贝包名
		strncpy(packages[index].name, line, packageNameLen);
		*(packages[index].name + packageNameLen) = '\0';
		trim(packages[index].name, packageNameLen);
		// 拷贝版本号
		strncpy(packages[index].version, line + packageNameLen + 2, packageVersionLen - 2);
		*(packages[index].version + packageVersionLen - 2) = '\0';
		trim(packages[index].version, packageVersionLen - 2);
		// 拷贝笔记
		if (noteP != NULL)
		{
			strncpy(packages[index].note, line + packageNameLen + packageVersionLen + 2, packageNoteLen - 2);
			*(packages[index].note + packageNoteLen - 2) = '\0';
			trim(packages[index].note, packageNoteLen - 2);
		}
		else
		{
			char str1[] = "暂无笔记";
			strcpy(packages[index].note, str1);
		}

		index++;
	}
	return index;
}

int main(void)
{
	FILE *fp;
	struct Package packages[PACKAGE_NUM];
	int index = 0;
	char line[LINE_SIZE];
	int flag = 0;
	fp = fopen(ENVIRONMENT_FILE, "r");
	if (fp == NULL)
	{
		printf("文件打不开");
	}
	else
	{
		while (!feof(fp))
		{
			fgets(line, LINE_SIZE, fp);

			// 判断是否为分界线
			if (strcmp(line, BREAK) == 0)
			{
				flag = 1;
			}

			index = process_line(line, flag, packages, index);
		}
	}
	fclose(fp);
	int length = index;
	// display_packages(packages, length);
	update_outdated_packages(packages, length);
}
