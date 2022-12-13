# 推送本机的公钥到多台主机


:::tip
sshpass 工具可以保证历史命令里不暴露密码
:::


```shell
#*********************************************************
#Author:                   ez4cyka
#QQ:                       NULL
#Date:                     2022-11-23
#FileName:                 lvs_dr_vs.sh
#URL:                      https://www.google.com
#Description:              推送捏
#Copyright:                2022 All rights reserved
#********************************************************
iplist="
10.0.100.8
10.0.100.18
10.0.100.28
10.0.100.38
10.0.100.48
10.0.100.58
"
check_os(){
. /etc/os-release
if [ $ID == "rocky" ] ;then
#安装sshpass  一个ssh连接工具可以让命令历史记录面没有带有暴露密码的命令
        rpm -qi sshpass || yum -y install sshpass
elif [ $ID == "ubuntu" ];then
        apt update
        dpkg -I sshpass || apt -y install sshpass
fi
}

check_rsa_key(){
 [ -f /root/.ssh/id_rsa ] || ssh-keygen -f /root/.ssh/id_rsa -P ''

}

push_pub_key(){
        export SSHPASS=123456
        for ip in $iplist;do
                { sshpass -e ssh-copy-id -o StrictHostkeyChecking=no $ip; }&
        done
        wait

}

check_os
check_rsa_key
push_pub_key

```