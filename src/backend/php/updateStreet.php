<?php
// 连接数据库
include_once "./mysql.php";
$database = new Mysql();

// 接收前端信息
$strt = $_POST['strt'];
$table = $_POST['table'];

$database->_doExec("UPDATE $table SET checked = checked+1 WHERE strtCode = $strt");

$result = $database->getMessage();

echo json_encode($result);
