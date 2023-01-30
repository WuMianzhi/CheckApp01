<?php
$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://localhost:8080") {
  header("Access-Control-Allow-Origin: $http_origin");
}

// 连接数据库
include_once "./mysql.php";
$database = new Mysql();

$tableName = $_POST["provinceCode"];
$code = $_POST["code"];

$database->_select($tableName = "$tableName", $columnName = "*", $where = "code = '$code'");

$result = $database->getMessage();

echo json_encode($result);
