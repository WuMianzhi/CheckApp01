<?php
// 连接数据库
include_once "./mysql.php";
$database = new Mysql();

$keywords = $_POST["keywords"];

$database->_select("users", "id, name", "name LIKE '%$keywords%'");

$result = $database->getMessage();

echo json_encode($result);