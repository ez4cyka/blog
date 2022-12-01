# CA 自签名证书生成脚本


:::tip
使用前把这些文件都放在同一个目录,在执行脚本
:::


自签发 CA 证书配置文件`ca-openssl.cnf`：


```  
[req]
distinguished_name  = req_distinguished_name
req_extensions = v3_req

[req_distinguished_name]
countryName           = Country Name (2 letter code)
countryName_default = CN
stateOrProvinceName   = State or Province Name (full name)
stateOrProvinceName_default = Some-State
organizationName          = Organization Name (eg, company)
organizationName_default = Internet Widgits Pty Ltd
commonName            = Common Name (eg, YOUR name)
commonName_default = testca

[v3_req]
basicConstraints = CA:true
keyUsage = critical, keyCertSign

```


服务端证书配置文件 `server-openssl.cnf`：
```
[req]
distinguished_name  = req_distinguished_name
req_extensions     = v3_req

[req_distinguished_name]
countryName           = Country Name (2 letter code)
countryName_default   = CN
stateOrProvinceName   = State or Province Name (full name)
stateOrProvinceName_default = Beijing
localityName          = Locality Name (eg, city)
localityName_default  = Beijing
organizationName          = Organization Name (eg, company)
organizationName_default  = Example, Co.
commonName            = Common Name (eg, YOUR name)
commonName_max        = 64

####################################################################
[ ca ]
default_ca  = CA_default        # The default ca section

####################################################################
[ CA_default ]

dir     = . # Where everything is kept
certs       = $dir # Where the issued certs are kept
crl_dir     = $dir      # Where the issued crl are kept
database    = $dir/index.txt    # database index file.
#unique_subject = no            # Set to 'no' to allow creation of
                    # several ctificates with same subject.
new_certs_dir   = $dir      # default place for new certs.

certificate = $dir/ca.pem   # The CA certificate
serial      = $dir/serial       # The current serial number
crlnumber   = $dir/crlnumber    # the current crl number
                    # must be commented out to leave a V1 CRL
crl     = $dir/crl.pem      # The current CRL
private_key = $dir/private/cakey.pem# The private key
RANDFILE    = $dir/private/.rand    # private random number file

x509_extensions = usr_cert      # The extentions to add to the cert

# Comment out the following two lines for the "traditional"
# (and highly broken) format.
name_opt    = ca_default        # Subject Name options
cert_opt    = ca_default        # Certificate field options

# Extension copying option: use with caution.
# copy_extensions = copy

# Extensions to add to a CRL. Note: Netscape communicator chokes on V2 CRLs
# so this is commented out by default to leave a V1 CRL.
# crlnumber must also be commented out to leave a V1 CRL.
# crl_extensions    = crl_ext

default_days    = 365           # how long to certify for
default_crl_days= 30            # how long before next CRL
default_md  = default       # use public key default MD
preserve    = no            # keep passed DN ordering


# A few difference way of specifying how similar the request should look
# For type CA, the listed attributes must be the same, and the optional
# and supplied fields are just that :-)
policy      = policy_anything
[ policy_anything ]
countryName     = optional
stateOrProvinceName = optional
localityName        = optional
organizationName    = optional
organizationalUnitName  = optional
commonName      = supplied
emailAddress        = optional

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 =  kuku.org
DNS.2   = www.kuku.org
DNS.3  = *.kuku.org

```


这里的 `alt_names` 域中即为我们需要指定的 subjectAltName，可以配置多个 IP，DNS 或其他值。



下面是cert_gen.sh 脚本,输出ca服务器证书和私钥:`ca.key`,`ca.crt`和给服务器的证书和私钥:`www.kuku.org.key`,`www.kuku.org.crt`.

最后还会把服务器证书和ca证书输出到一个文件中`www.kuku.org.pem`,把这个文件和服务器私钥`www.kuku.org.key` 放在对应的nginx 目录中就可以实现443端口的访问不警告了

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
echo "INFO: 清理环境"
rm *.rsa
rm *.jks
rm *.p12
rm *.key
rm *.csr
rm *.srl


ca_subject="/O=kuku/CN=ca.kuku.org"
subject="/C=CN/ST=Shanghai/L=Shanghai/O=kuku/CN=www.kuku.org"
serial=34
file=www.kuku.org



echo "INFO: 生成自签发证书"
openssl req -x509  -newkey rsa:2048 -config ca-openssl.cnf -subj $ca_subject -nodes -keyout ca.key -out ca.crt  -days 3650 -extensions v3_req


echo "INFO: 签发服务端证书"
read -p "请输入服务器的根域名(例如kuku.org这样的):" server
old_server=`awk -F"=| " '/DNS.1/{print $NF}' server-openssl.cnf `
echo "将原来的${old_server}替换成${server}"
sed  -ri  "/DNS/s|${old_server}|${server}|" server-openssl.cnf

openssl req  -newkey rsa:2048 -nodes -out $file.csr -subj $subject -config server-openssl.cnf -keyout $file.key
openssl x509 -req -CA ca.crt -CAkey ca.key -set_serial $serial  -in $file.csr -out $file.crt -extensions v3_req -extfile server-openssl.cnf   -days 3650


cat $file.crt ca.crt > $file.pem


echo "INFO：清理无用的文件"
rm *.rsa
rm *.csr
rm ca.srl


```





运行脚本前的结构目录:
```
cert
├── ca-openssl.cnf
├── cert-gen.sh
└── server-openssl.cnf

```

