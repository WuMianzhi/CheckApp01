<?php
// 连接数据库
include_once "./mysql.php";
$database = new Mysql();

// 接收前端信息
$lon = $_POST['lon'];
$lat = $_POST['lat'];
$code = $_POST['code'];
$isHandle = $_POST['isHandle'];
$table = $_POST['table'];
$checked = 1;

$updatedInfo = array(
  'lon' => $lon,
  'lat' => $lat,
  'checked' => $checked,
  'isHandle' => $isHandle,
  'warn' => 0
);

$database->_update($table, $updatedInfo, "code = $code");

$result = $database->getMessage();

echo json_encode($result);
