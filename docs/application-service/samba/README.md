# samba 服务-File Service

- SMB: service message block 
- CIFS: command internet file system

- Linux Server(Samba Server)
- Windows Server(Cifs Server)

- Andrew Tridgell, smb -> samba

## samba 功能

- 文件系统共享
- 打印机共享
- NetBIOS协议(网络邻居)

## peer/peer/(wordgroup model), domain model

## 服务端程序包：samba

``` shell
# man nmbdc
# man smbd
```

- mmbd: NetBIOS name service (与Windows网上邻居互相访问，与Windows共享时开启)
- smbd: SMB/CIFS services 文件共享服务
- 主配置文件：`/etc/samba/smb.conf`
- systemd unit file:
  - nmbd: `nmb.service`
  - smbd: `smb.service`

## 客户端程序包：samba-client

- `smbclient`: 交互式的命令行客户端(ftp客户端命令相似)
- `mount -t cifs`

## 安装配置samba

``` shell
# yum list all | grep samba
  samba-client
  smaba-client-libs
  samba-common 公共库
  samba-common-tool 公共工具
  samba-libs 服务库
  samba 服务程序
# yum info samba
# yum -y install samba
# rpm -ql samba
  /usr/sbin/nmbd 名称服务
  /usr/sbin/smbd 文件共享服务
  /etc/pamd./samba
  nmb.service
  smb.servie
```

## 启动服务

``` shell
# systemctl start nmb.service
# systemctl start smb.service
```

## 监听端口

- NetBIOS服务: **137/udp,138/udp**
- SMB/CIFS服务: **139/tcp, 445/tcp**
  
## samba配置

``` shell
# vim /etc/samba/smb.conf

两类配置段：
  全局配置：
    [global]
  每共享的专用配置:
    [shared name of shared resource]

directive=value

[ftp]
  comment = Home Directories
  path = /var/ftp 共享路径
  browseable = yes no:自己能看到，别人不能浏览
  guest ok = yes 来宾用户
  writeable = yes 是否可以写入
  valid users = %S 是指登陆用户可以访问
  valid users = MYDOMAIN\%S\

  valid users = user(@group) 设定能够使用该共享服务的用户和组，其值的格式与user选项一样
  invalid users = user(@group) 设定不能够使用该共享服务的用户和组，其值的格式与user选项一样


# systemctl reload smb.service

语法检查配置信息(samba-common-tools)
# testparm /etc/samba/smb.conf
```

## 访问samba共享

- Linux:
  - smbclient：交互式命令行客户端
  - `mount -t cifs`：挂载文件系统
- Windows:
  - `\\HOST OR IP\SHARED_DIR`    (unc路径)

``` shell
# smbclient //server/ftp -u username -P
```

## 查看（网络邻居）

`# smbclient -L server`

## samba详细配置

- 全局配置：
  - workgroup = MYGROUP 主机所属的工作组名称
  - server string = Samba Server Version %v 主机注释(version)
  - netbios name = MYSERVER 网上邻居看到MYSERVER主机名
  - display charset = 当前samba服务所用字符集
  - unix charset = 当前Linux主机所使用的字符集
  - dos charset = Windows端的字符集

  - interfaces = lo eth0 192.168.12.2/24 samba服务监听的IP地址或网络接口
  - hosts allow = 127. 192.168.12. 客户端来源的白名单

  - log file = /var/log/samba/log.%m 日志文件,%m：主机名后IP地址
  - max log size = 50 日志文件的体积上线, 50kb

- Standalone Serer Options
  - security = user 设定安全级别；取值为一下三者之一
    - share：匿名共享
    - user：使用SAMBA服务自我管理的账号和密码进行用户认证;用户必须是操作系统用户，但密码非为OS用户的密码，而是访问samba服务的专用密码
    - domain：使用DC进行用户认证

- passdb backend = tdbsam 密码库文件的格式

## 将系统用户田杰为samba用户

``` shell
# smbpasswd [option] USERNAME`
  -a : add
  -x : delete
  -d : disable
  -e : enable
```

## centos系统用户

``` shell
# samba -a centos
# smbclient //server -U centos -P
# smbclient -L 172.16.0.3 -U testuser -P

匿名登录，看不到browseable的No的共享信息
# smbclient -L 172.16.0.3
```

## 共享配置

``` shell
[共享名称] 某共享的服务名
comment 注释信息
path 共享对应本地文件系统路径
browseable 是否可浏览，是否可被所有用户看到
  no：只有用户或属组内的用户可以看到
writable 是否对于所有用户可写
read only 与writable只能使用一个，是否为只读
writelist 可写用户或组列表
  用户名
  @组名
  +组名
  用户与访问目录权限
guest ok 是否允许来宾账号访问；
public 是否是公开的服务；是否允许匿名用户访问
  writeable 和 write list 不应该同时使用

可用的宏列表：
  %m：客户端的主机的NetBIOS名称
  %M：客户端的internet主机名，即HOSTNAME
  %H：当前用户的家目录
  %U：当前用户的用户名
  %g：当前用户的所属组名
  %h：当前SAMBA主机的HOSTNAME
  %i：客户端主机IP
  %T：当前的日期时间

# vim /etc/samba/smb.conf
[mysqldata]
comment = Home Directory %H

# smbclient -L 172.18.100.67 -U centos
# smbclient -L 172.18.100.67 -U gentoo

```

``` shell
# ls /mydata/data/
# vim /etc/samba/sms.conf
[mysqldata]
  comment = mysql data dir
  path = /mydata/data
  browseable = yes 允许所有人访问
  writeable = yes 允许可写
  write list = @dbaadmins 只有dba组可写
# groupadd dbadmins
# testparm 测试配置samba配置文件
# useradd centos
# useradd gentoo
# man smbpasswd
# smbpasswd -a centos
# smbpasswd -a gentoo
# usermod -aG dbadmins centos
# cp /etc/resolv.conf /mydata/data/

在客户端172.18.100.68访问
# smbclient //172.18.10.67/mysqldata -U centos
smb: /> ls
smb: /> lcd /tmp
smb: \> get resolve.conf
smb: /> exit
# ls /tmp
# smbclient //172.18.10.67/mysqldata -U centos
smb: /> lcd /etc
smb: /> put issue 上传文件
  dbadmins 组用户对 /mydata/data没有写权限
# ls -ld /mydata/data
# setfactl -m g:dbadmins:rwx /mydata/data
# getfactl /mydata/data

在客户端172.18.100.68访问
# smbclient //172.18.10.67/mysqldata -U centos
smb: /> lcd /etc
smb: /> put issue

# usermod -aG dbadmins gentoo

在客户端172.18.100.68访问
# smbclient //172.18.10.67/mysqldata -U gentoo
smb: \> lcd /etc
smb: \> put fstab

# useradd hbase
# smbpasswd -a hbase

在客户端172.18.100.68访问
# smbclient -L 172.18.100.67 -U hbase

hbase对文件系统有写权限
# setfacl -m u:hbase:rwx /mydata/data/

在客户端172.18.100.68访问
# smbclient -L 172.18.100.67 -U hbase
smb: \> lcd /etc
smb: \> put grub2.cfg 可以上传，为什么？

# vim /etc/samba/smb.conf
[mysqldata]
  #writeable = yes
# systemctl reload smb.serivce

在客户端172.18.100.68访问
# smbclient -L 172.18.100.67 -U hbase
smb: \> lcd /etc
smb: \> put inputrc 不能上传
smb: \> exit

在客户端172.18.100.68访问
# smbclient -L 172.18.100.67 -U centos
smb: \> lcd /etc
smb: \> put inputrc 可以上传
smb: \> exit
```

## 交互式访问

- 查看共享：`# smbclient -L SAMBA_SERVER -U USERNAME`
- 访问共享：`# smbclient //SAMBA_SERVER/SERVICE_NAME -U USERNAME`

## 挂载访问方式

``` shell
# mount -t cifs -o username=USERNAME,password=PASSWORD //SERVER/SERVICE /MOUNT

# mkdir /mydata/data -pv
# mount -t cifs //172.18.100.67/mysqldata -o username=centos /mydata/data
# mount
# ls /mydata/data/
```

## 练习

- 创建一个共享data，路径为/ftp/data;
- 要求仅cenos和gentoo能上传文件；
- 此路径对其他用户不可见

``` shell
- 服务端 172.18.100.67
# mkdir -pv /ftp/data
# vim /etc/samba/smb.conf
  [data]
  comment = data
  path = /ftp/data
  write list = centos,gentoo
  public = no
# setfact -m u:centos:rwx /ftp/data
# setfact -m u:gentoo:rwx /ftp/data
# testparm

- 客户端访问
# man smbstats
# smbclient -L //172.18.100.67
# smbclient //172.18.100.67/data -U centos
smb: \> lcd /etc/pam.d/
smb: \> put cups
smb: \> exit
```

## pdbedit命令

> 类似于smbpasswd，用于管理smb用户

``` shell
pdbedit [options]
  -L：列出所有的smb用户
    -v：verbose
  -a：添加用户
    -u USERNAME
  -x：删除指定用户
  -u USENRAME
  -r：修改用户的相关信息
```

``` shell
# pdbedit -L
# useradd hadoop
# pdbedit -a -u hadoop
# pdbedit -L

```

## smbstatus命令

> 显示samba server相关共享的访问状态；正在被那些客户端访问

``` shell
# man smbstatus
  -b 简要格式信息
  -v verbose
```

``` shell
# smbstatus -b 简要格式
# smbstatus -v 详细格式
```

## 预习

- IPv4报文首部格式
- tcp 报文首部格式
- tcp finite machine

## 错误
Mar 08 14:07:22 localhost.localdomain smbd[7329]: [2018/03/08 14:07:22.202527,  0] ../lib/util/become_daemon.c:124(daemon_ready)
Mar 08 14:07:22 localhost.localdomain systemd[1]: Started Samba SMB Daemon.
Mar 08 14:07:22 localhost.localdomain smbd[7329]:   STATUS=daemon 'smbd' finished starting up and ready to serve connections

`$ getsebool -a | grep samba`

#显示出工具状态，有这一行samba_enable_home_dirs --> off，就是将它on就行了

`$ setsebool -P samba_enable_home_dirs on`
