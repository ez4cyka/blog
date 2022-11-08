```
sed [OPTION]... {script-only-if-no-other-script} [input-file]...
#常用选项
-n|--quiet|--silent  #不输出模式空间内容到屏幕，即不自动打印 
-e script|--expression=script #多个script，or 的关系 
-f script-file|--file=script-file  #从指定文件中读取编辑脚本
-i[SUFFIX]|--in-place[=SUFFIX]     #-i 直接修改文件，-i.bak 以.bak后缀
备份原文件
-c|--copy                    #配合i一起使用，保留原文件 
-l N|--line-length=N          #指定每行长度，如果过长，就拆分成多行，要加 `l'

--posix                    #禁用GNU扩展
-E|-r|--regexp-extended   #扩展正则表达式
-s|--separate         #将多个文件视为独立文件，而不是单个连续的长文件流

-ir    #此组合不支持
-ri     #支持
-i -r  #支持 
-ni   #此组合危险，会清空文件




```

```
N #具体行号
$ #最后一行
/pattern/ #能被匹配到的每一行
M,N #第M行到第N行
M,+N #第M行到第M+N行 3,+4 表示从第3行到第7行
/pattern1/,/pattern2/ #从第一个匹配行开始，到第二个匹配行中间的行
M,/pattern/ #行号开始，匹配结束
/pattern/,N #匹配开始，行号结束

#步长
1~2 #奇数行
2~2 #偶数行


```

命令
```
p  #打印当前模式空间内容，追加到默认输出之后

Ip  #忽略大小写输出

d #删除模式空间匹配的行，并立即启用下一轮循环

a [\]text #在指定行后面追加文本，支持使用\n实现多行追加

i [\]text         #在行前面插入文本

c [\]text   #替换行为单行或多行文本

w file #保存模式匹配的行至指定文件

r file #读取指定文件的文本至模式空间中匹配到的行后

= #为模式空间中的行打印行号

! #模式空间中匹配行取反处理

q  #结束或退出sed
```

查找和替代

```
s/pattern/replace/修饰符   #查找替换,支持使用其它分隔符，可以是其它形式:s@@@，s###

#修饰符
g        #行内全局替换
p #显示替换成功的行
w file #将替换成功的行保存至文件中
I|i #忽略大小写

#后向引用
\1   #第一个分组
\2 #第二个分组
\N #第N个分组
& #所有搜索内容
```



例子:

```sh
#正则匹配，输出以root开头的行
sed -n '/^root/p' /etc/passwd


#正则匹配，显示注释行行号
sed n '/^#/=' /etc/fstab

#第8行开始到正则结束
sed -n '8,/kuku/p' /etc/passwd

#匹配行后插入 (a\ 的反斜杠可以让后面的空格有效)

[00:57:53 root@rocky8 0926]#cat test
aaa
bbb
ccc
bbb


[00:57:47 root@rocky8 0926]#sed  '/bbb/a\    ---' test
aaa
bbb
    ---
ccc
bbb
    ---


#第二行前插入
sed '2i----' test


#第一行替换成两行 
sed '1c\-----\n++++++' test

#多行替换成一行

sed '1,2c\-------' test



#命令展开
sed -n "/$(whoami)/p" /etc/passwd

#倒数第二行
sed -n "$[`cat /etc/passwd |wc -l |bc` -1]p" /etc/passwd


#变量展开 

sed -n "/$USER/p" /etc/passwd

#变量+命令展开
sed -n "`echo $UID+1|bc`p " /etc/passwd


sed -n "$(echo $UID+1|bc),$(echo $UID+3|bc)p" /etc/passwd


#删除奇数行 

seq 10 |sed '1~2d'

#删除2和4行

seq 10 | sed -e '2d' -e '4d'
#多条写一起
seq 10 |sed '2d;4d'

#获取IP
 ifconfig ens160 | sed -rn '2s/(.*inet )([0-9].*)(
netmask.*)/\2/p'
```