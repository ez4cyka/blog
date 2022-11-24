# Mysql安装脚本


使用前先下载mysql二进制文件
mysql-8.0.30-linux-glibc2.12-x86_64.tar.xz,不同版本需要改下脚本里MYSQL变量.



```shell
#!/bin/bash
#
#*********************************************************
#Author:                   ez4cyka
#QQ:                       NULL
#Date:                     2022-11-06
#FileName:                 install_mysql.sh
#URL:                      https://www.google.com
#Description:              支持ubuntu2204和rocky86 安装完成后请重新登陆shell!!!!!
#Copyright:                2022 All rights reserved
#********************************************************
. /etc/init.d/functions
#把mysql二进制文件下载到当前文件夹(例mysql-8.0.30-linux-glibc2.12-x86_64.tar.xz)
#rock8.6

CURRDIR=`pwd`
MYSQL='mysql-8.0.30-linux-glibc2.12-x86_64.tar.xz'

COLOR='echo -e \E[01;31m'
END='\E[0m'

MYSQL_ROOT_PSSSWD=123456


check(){
	if [  $UID -ne 0 ];then
		action "不是root用户,安装失败" false
		exit 1 
	fi

	cd $CURRDIR
	if [ ! -e $MYSQL ];then
	   $COLOR"缺少${MYSQL}文件"$END
	   $COLOR"请将相关文件放在当前目录"$END
		exit 2
	elif  [ -e /usr/local/mysql ];then
	   action "数据库已存在,安装失败" false
	   exit 3
	else
	   return
	fi
	
}




install_mysql(){
	$COLOR"开始安装MYSQL数据库..."$END


	source /etc/os-release

	if [ "${ID,,}" = 'rocky' ] ;then
	#这四个包要提前安装
	yum -y  install libaio numactl-libs ncurses-compat-libs

	elif [ "${ID,,}" = 'ubuntu'  ]; then
		apt update
		apt install -y libaio1 libaio-dev libncurses5-dev numactl libncurses5

	fi

	cd $CURRDIR
	#mysql解压到/usr/local中
	tar -xvf ${CURRDIR}/$MYSQL -C /usr/local
	#去掉压缩包后缀
	MYSQLNAME=`echo $MYSQL |sed -nE 's|(.*[0-9]).*|\1|p' ` 
	#创建软链接,方便配置文件的目录引用,格式整洁,不带版本号
	ln -s /usr/local/$MYSQLNAME /usr/local/mysql
	chown -R root.root /usr/local/mysql


	if [ "${ID,,}" = 'rocky' ] ;then
	id mysql &> /dev/null || { groupadd -r -g 306 mysql; useradd  -r -g 306 -u 306 -d /data/mysql -s /bin/nologin mysql ; action "创建mysql用户"; }
        elif [ "${ID,,}" = 'ubuntu'  ]; then

	id mysql &> /dev/null || { groupadd -r -g 306 mysql; useradd  -r -g 306 -u 306 -d /data/mysql -s /bin/false mysql ; echo "创建mysql用户成功"; }
        fi




	#添加环境变量
	echo 'PATH=/usr/local/mysql/bin/:$PATH' > /etc/profile.d/mysql.sh
	sleep 1
	#立即生效
	source /etc/profile.d/mysql.sh
	# ?	
#	ln -s /usr/local/mysql/bin/* /usr/bin/

 node=`ip a show dev eth0 |awk -F'[./]' '/inet /{print $4}'`
	cat > /etc/my.cnf <<-EOF
[mysqld]
default-authentication-plugin = mysql_native_password
port=3306

server-id=$node
basedir=/usr/local/mysql
datadir=/data/mysql
socket=/data/mysql/mysql.sock
log_bin = /data/mysql/mybinlog
log-error=/data/mysql/mysql.log
pid-file=/data/mysql/mysql.pid
character_set_server = UTF8MB4

#启用admin_port，连接数爆满等紧急情况下给管理员留个后门
admin_address = '127.0.0.1'
admin_port = 33062

[client]
port = 3306
socket = /data/mysql/mysql.sock

[mysql]
prompt = "\u@mysqldb \R:\m:\s [\d]> "
no_auto_rehash
loose-skip-binary-as-hex


EOF

	[ -d /data ] || mkdir /data
	#用之前下载的4个工具进行初始化
	mysqld --initialize --user=mysql --datadir=/data/mysql
	#设置开机启动(基于systemd)
	cat > /etc/systemd/system/mysqld.service <<-EOF
[Unit]                                                                                                                  
Description=MySQL Server
Documentation=man:mysqld(8)
Documentation=http://dev.mysql.com/doc/refman/en/using-systemd.html
After=network.target
After=syslog.target
[Install]
WantedBy=multi-user.target
[Service]
User=mysql
Group=mysql
ExecStart=/usr/local/mysql/bin/mysqld --defaults-file=/etc/my.cnf
LimitNOFILE = 5000

EOF

	ln -s /etc/systemd/system/mysqld.service /etc/systemd/system/multi-user.target.wants/mysqld.service 
	
	systemctl daemon-reload
	systemctl start mysqld
	[ $? -ne 0 ] && { $COLOR"数据库启动失败,退出!"$END;exit; }
	sleep 3
	
	#MYSQL_OLDPASSWORD=`awk '/A temporary password/{print $NF}' /var/log/mysqld.log`
	MYSQL_OLDPASSWORD=`awk '/A temporary password/{print $NF}' /data/mysql/mysql.log`

	mysqladmin -uroot -p"$MYSQL_OLDPASSWORD" password $MYSQL_ROOT_PSSSWD &>/dev/null
	
	if [ "${ID,,}" = 'rocky' ] ;then
        action "数据库安装完成"
	
	elif [ "${ID,,}" = 'ubuntu'  ]; then
	echo "数据库安装完成"
        fi
	
}


check

install_mysql


```