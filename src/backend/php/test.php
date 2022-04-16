<?php
// 连接数据库
include_once "./mysql.php";
$database = new Mysql();

$database->_select('czml', 'id', "id = 1");

$queryResult = $database->getMessage();

var_dump($queryResult);