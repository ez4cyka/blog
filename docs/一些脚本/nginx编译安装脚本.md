# Nginx安装脚本 
:::tip
适用于ubuntu2204 rock86

里面的color函数可以复用 color <信息> [0,1,2]    可以输出绿红黄的<信息>
:::


```shell

#!/bin/bash
#
#*********************************************************
#Author:                   Ez4cyka
#QQ:                       NULL
#Date:                     2022-11-24
#FileName:                 nginx_install.sh
#URL:                      https://www.google.com
#Description:              TODO
#Copyright:                2022 All rights reserved
#********************************************************

cd /usr/local/src/

nginx='nginx-1.22.1.tar.gz'
cpu=`lscpu |awk  '/^CPU\(s\)/{print $2}'`
installDir='/apps/nginx'



color(){

resCol=60
#使输出文字向右边移动六十个空格
moveToCol="\E[${resCol}G"
#绿色
successCol="\E[1;32m"
#红色
failCol="\E[1;31m"
#黄色
warnCol="\E[1;33m"
end="\E[0m"
out=${1}$moveToCol
case $2 in
0)	out=${out}'['${successCol}' OK '
;;
1)	out=${out}'['${failCol}' FAILD '
;;	
*)	out=${out}'['${warnCol}' WARNING '
;;
esac
    echo -e ${out}${end}']'
}



check(){

 [ -e $installDir ] && { color "nginx 已安装,请卸载后安装" 1;exit;  }

	[ -e $nginx ] && color "相关文件已准备好" 0||{
	color "开始下载nginx源码包" 2;
	wget http://nginx.org/download/${nginx};
	[ $? -ne 0 ] && { color "下载 $nginx 文件失败" 1; exit;}
}

}



install(){
tar -xf $nginx

#从右往左删除,匹配两次. 将.tar.gz删除
dirname="${nginx%.*.*}"

cd $dirname

. /etc/os-release

if [ $ID == "rocky" ] ;then



#安装依赖包
yum -y install gcc make gcc-c++ libtool pcre pcre-devel zlib zlib-devel openssl openssl-devel perl-ExtUtils-Embed	


elif [ $ID == "ubuntu" ];then
apt update
apt -y install gcc make libpcre3 libpcre3-dev openssl libssl-dev zlib1g-dev


fi
#创建nginx 用户
useradd -s /sbin/nologin -r nginx


./configure --prefix=/apps/nginx \
--user=nginx \
--group=nginx \
--with-http_ssl_module \
--with-http_v2_module \
--with-http_realip_module \
--with-http_stub_status_module \
--with-http_gzip_static_module \
--with-pcre \
--with-stream \
--with-stream_ssl_module \
--with-stream_realip_module

make && make install


chown -R nginx.nginx /apps/nginx


#任意目录运行nginx命令
ln -s /apps/nginx/sbin/nginx  /usr/sbin/

 cat > /lib/systemd/system/nginx.service <<-EOF

[Unit]
Description=The nginx HTTP and reverse proxy server
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=${installDir}/logs/nginx.pid
ExecStartPre=/bin/rm -f ${installDir}/logs/nginx.pid
ExecStartPre=${installDir}/sbin/nginx -t
ExecStart=${installDir}/sbin/nginx
ExecReload=/bin/kill -s HUP \$MAINPID
KillSignal=SIGQUIT
TimeoutStopSec=5
KillMode=process
PrivateTmp=true
LimitNOFILE=100000

[Install]
WantedBy=multi-user.target

EOF

systemctl daemon-reload
systemctl enable --now nginx

systemctl is-active nginx || { color "nginx 启动失败" 1;exit;}
color "nginx 安装完成" 0
}

check
install
exec bash


```



