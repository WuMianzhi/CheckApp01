<?php
// 连接数据库
include_once "./mysql.php";
$database = new Mysql();

// 接收前端信息
$status = $_POST['status'];
$code = (int)$_POST['code'];
$table = $_POST['table'];

$updatedInfo = array(
  'status' => $status,
);

$database->_update($table, $updatedInfo, "code = $code");

$result = $database->getMessage();

echo json_encode($result);
