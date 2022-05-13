#!/bin/bash

#备份保存路径
backup_dir="/var/lib/mysql-files/backup"
#日期
dd=`date +%Y-%m-%d-%H-%M-%S`
#备份工具
tool="mysqldump"
#用户名
username="root"
#密码
password="soilDB_2021"

#将要备份的数据库
database_name="geocode"

#如果文件夹不存在则创建
if [ ! -d $backup_dir ];
then
    mkdir -p $backup_dir;
fi

#简单写法 mysqldump -u root -p123456 users > /root/mysqlbackup/users-$filename.sql
$tool -u$username -p$password $database_name > $backup_dir/$database_name-$dd.sql.gz

#写创建备份日志
echo "create $backup_dir/$database_name-$dd.dupm" >> $backup_dir/log.txt

#删除七天之前的备份
find $backup_dir -name $database_name"*.sql.gz" -type f -mtime +7 -exec rm -rf {} \; > /dev/null 2>&1
