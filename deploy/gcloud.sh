#!/bin/zsh

source secret.sh

function echo_important {
    echo "\033[47;31m$1\033[0m"
}

function area2zone {
    area=$1
    if [ $area = 'HK' ]; then # 香港
        zone='asia-east2-b'
    elif [ $area = 'TWN' ]; then # 台湾
        zone='asia-east1-b'
    elif [ $area = 'JP' ]; then # 日本
        zone='asia-northeast1-b'
    else # 默认, 美国(慢但有效)
        zone='us-east1-b'
    fi
    echo $zone
}

function zone2area {
    zone=$1
    if [ $zone = "asia-east2-a" ] || [ $zone = "asia-east2-b" ] || [ $zone = "asia-east2-c" ]; then # 香港
        area="HK"
    elif [ $zone = "asia-east1-a" ] || [ $zone = "asia-east1-b" ] || [ $zone = "asia-east1-c" ]; then # 台湾
        area="TWN"
    elif [ $zone = "asia-northeast1-a" ] || [ $zone = "asia-northeast1-b" ] || [ $zone = "asia-northeast1-c" ]; then # 日本
        area="JP"
    else # 默认, 美国(慢但有效)
        area="US"
    fi
    echo $area
}

function list {
    gcloud_list=$(gcloud compute instances list)
    # gcloud_list=$(cat gcloud_instances.txt)
    echo $gcloud_list >gcloud_instances.txt
    gcloud_zone_list=($(echo ${gcloud_list} | awk '{print $2}' | tr '\n' ' '))
    zone_list=${gcloud_zone_list[@]:1:${#gcloud_zone_list[@]}}
    area_str='AREA'
    for zone in $(echo ${zone_list}); do
        area_str=${area_str}"\n"$(zone2area $zone)
    done
    echo "${area_str[@]}" >_tmp.txt
    paste _tmp.txt gcloud_instances.txt | tee gcloud_instances.txt
    trash _tmp.txt
}

function create {
    # ===========================================================
    # instance_name: "instance-1" ; area: "HK" ; system: "centos" ;
    # compute_size: "tiny" ; disk_size: "10"
    # ===========================================================
    # 实例名称
    instance_name=$1

    # 实例地区
    area=$2
    zone=$(area2zone ${area})

    # 算力配置
    compute_size=$3
    if test -z ${compute_size}; then
        compute_size="tiny"
    fi
    if test $compute_size = "tiny"; then # 1,0.6
        machine_type="f1-micro"
    elif test $compute_size = "small"; then # 1,1.7
        machine_type="g1-small"
    elif test $compute_size = "medium"; then # 1,3.75
        machine_type="n1-standard-1"
    elif test $compute_size = "big"; then # 2,7.5
        machine_type="n1-standard-2"
    elif test $compute_size = "huge"; then # 4,15
        machine_type="n1-standard-4"
    else
        machine_type="custom-"$compute_size
    fi

    # 硬盘体积
    disk_size=$4
    if test -z ${disk_size}; then
        disk_size=10
    fi
    disk_size=${disk_size}"GB"
    gcloud compute addresses create ${instance_name} --region=${zone:0:-2}
    gcloud compute --project=${GCLOUD_PROJECT_ID} instances create ${instance_name} \
        --zone=${zone} --machine-type=${machine_type} --tags=http-server,https-server --boot-disk-size=${disk_size} \
        --address=${instance_name} --image-family="ubuntu-2004-lts" --image-project="ubuntu-os-cloud"
}

function stop {
    instance_name=$1

    # 实例地区
    area=$2
    zone=$(area2zone ${area})

    gcloud compute instances stop ${instance_name} --zone=$zone
}

function start {
    instance_name=$1
    # 实例地区
    area=$2
    zone=$(area2zone ${area})

    gcloud compute instances start ${instance_name} --zone=$zone
}

function ssh {
    instance_name=$1

    # 实例地区
    area=$2
    zone=$(area2zone ${area})

    command=$3
    if test -z ${command}; then
        gcloud compute ssh ${GCLOUD_USERNAME}@${instance_name} --zone=$zone
    else
        gcloud compute ssh ${GCLOUD_USERNAME}@${instance_name} --zone=$zone --command=$command
    fi
}

function scp {
    instance_name=$1

    # 实例地区
    area=$2
    zone=$(area2zone ${area})

    filename=$3
    if test -z ${filename}; then
        filename="deploy.sh"
    fi
    gcloud compute scp $filename ${GCLOUD_USERNAME}@${instance_name}:~ --zone=$zone

}

function delete {
    # 实例名称
    instance_name=$1

    # 实例地区
    area=$2
    zone=$(area2zone ${area})
    region=${zone:0:-2}
    gcloud compute instances delete $instance_name --zone=${zone}
    gcloud compute addresses delete $instance_name --region=${region}
}

function snapshot {
    # 实例/磁盘名称
    instance_name=$1
    # 实例地区
    area=$2
    zone=$(area2zone ${area})
    # 快照名
    snapshot_name=$3
    # 描述
    description=$4

    gcloud compute disks snapshot ${instance_name} --zone=${zone} --snapshot-names=${snapshot_name} --description=${description}
}

function deploy_v2ray {
    instance_name=$1

    area=$2
    echo "首先修改密码: "
    ssh ${instance_name} ${area} "sudo passwd root<<!
${GCLOUD_ROOT_PASSWORD}
${GCLOUD_ROOT_PASSWORD}
!"
    ssh ${instance_name} ${area} "sudo passwd ${GCLOUD_USERNAME}<<!
${GCLOUD_PASSWORD}
${GCLOUD_PASSWORD}
!"
    echo "进而部署v2ray: "
    command1="su - root <<!
${GCLOUD_ROOT_PASSWORD}
apt install -y wget && wget https://cdn.jsdelivr.net/gh/HenryJi529/OpenMorningstar@main/deploy/_install/v2ray.sh && bash v2ray.sh
!"
    command2="su - root <<!
${GCLOUD_ROOT_PASSWORD}
v2ray url
!"
    echo "step1:"
    echo "command1: ${command1}"
    ssh ${instance_name} ${area} ${command1}
    echo "step2:"
    echo "command2: ${command2}"
    ssh ${instance_name} ${area} ${command2}
}

function main {
    echo "执行操作: 
1. list();
2. create();
3. stop();
4. start();
5. ssh();
6. scp();
7. delete();
8. snapshot();
9 deploy_v2ray();
===============================
"
    read "order?输入序号(1-9): "

    case $order in
    1) list ;;
    2)
        cat ./gcloud_instances.txt
        read "instance_name?名称: "
        read "area?区域(HK, TWN, JP, [US]): "
        read "compute_size?算力([tiny], small, medium, big, huge): "
        read "disk_size?磁盘大小[/10G]: "
        create ${instance_name} ${area} ${compute_size} ${disk_size}
        list
        ;;
    3)
        cat ./gcloud_instances.txt
        read "instance_name?名称: "
        read "area?区域(HK, TWN, JP, [US]): "
        stop ${instance_name} ${area}
        list
        ;;
    4)
        cat ./gcloud_instances.txt
        read "instance_name?名称: "
        read "area?区域(HK, TWN, JP, [US]): "
        start ${instance_name} ${area}
        list
        ;;
    5)
        cat ./gcloud_instances.txt
        read "instance_name?名称: "
        read "area?区域(HK, TWN, JP, [US]): "
        read "command?命令[直接回车即shell]: "
        ssh ${instance_name} ${area} ${command}
        list
        ;;
    6)
        cat ./gcloud_instances.txt
        read "instance_name?名称: "
        read "area?区域(HK, TWN, JP, [US]): "
        read "filename?文件[只支持当前目录下的[deploy.sh]]: "
        scp ${instance_name} ${area} ${filename}
        ;;
    7)
        cat ./gcloud_instances.txt
        read "instance_name?名称: "
        read "area?区域(HK, TWN, JP, [US]): "
        delete ${instance_name} ${area}
        list
        ;;
    8)
        cat ./gcloud_instances.txt
        read "instance_name?实例/磁盘名: "
        read "area?区域(HK, TWN, JP, [US]): "
        read "snapshot_name?快照名[只接受小写字母、数字和连字符]: "
        read "description?快照描述: "
        snapshot ${instance_name} ${area} ${snapshot_name} ${description}
        list
        ;;
    9)
        cat ./gcloud_instances.txt
        read "instance_name?实例/磁盘名: "
        read "area?区域(HK, TWN, JP, [US]): "
        deploy_v2ray ${instance_name} ${area}
        ;;
    *)
        if [[ $(uname) == 'Darwin' ]]; then
            osascript -e \ "display notification \"输入错误...\"
set question to display dialog \"打开管理面板\" buttons {\"取消\", \"打开\"} giving up after 20
set answer to button returned of question
if answer is equal to \"打开\" then
    tell application \"Google Chrome\"
        open location \"https://morningstar529.com/admin/\"
    end tell
else
    display notification \"结束!\"
end if
"
        else
            echo "输入错误..."
        fi
        ;;

    esac

}

date "+%Y-%m-%d %H:%M:%S"
echo_important "相关配置:"
echo_important "service: "
echo_important "MORNINGSTAR_USERNAME: ${MORNINGSTAR_USERNAME}"
echo_important "MORNINGSTAR_PASSWORD: ${MORNINGSTAR_PASSWORD}"
echo_important "EMAIL: ${EMAIL}"
echo_important "gcloud: "
echo_important "GCLOUD_PROJECT_ID: ${GCLOUD_PROJECT_ID}"
echo_important "GCLOUD_USERNAME: ${GCLOUD_USERNAME}"
echo_important "GCLOUD_PASSWORD: ${GCLOUD_PASSWORD}"
echo_important "GCLOUD_ROOT_PASSWORD: ${GCLOUD_ROOT_PASSWORD}"
echo_important "git: "
echo_important "GIT_USER: ${GIT_USER}"
echo "
==============================="

main
echo "DONE! "
