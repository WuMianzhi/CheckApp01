<?php
// 连接数据库
include_once "./mysql.php";
$database = new Mysql();

// 接收前端信息
$code = $_POST['code'];
$table = $_POST['table'];
$checked = 1;

$updatedInfo = array(
  'warn' => $checked
);

$database->_update($table, $updatedInfo, "code = $code");

$result = $database->getMessage();

echo json_encode($result);
