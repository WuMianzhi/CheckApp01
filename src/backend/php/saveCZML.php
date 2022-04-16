<?php
// 连接数据库
include_once "./mysql.php";
$database = new Mysql();

// 接收前端信息
$czml = $_POST['czml'];
$author = $_POST['author'];
$shared = $_POST['shared'];
$public = $_POST['public'];
$projectName = $_POST['projectName'];

// 创建文件
$filePath = substr(hash('md5', $czml), 0, 32);
$parentsPath = "../czml";

// 创建文件夹
if (!file_exists($parentsPath . '/' . $filePath)) {
  mkdir($parentsPath . '/' . $filePath);
}

// 写入文件
if (!file_exists($filePath)) {
  $fileRes = file_put_contents($parentsPath . '/' . $filePath . '/' . $filePath . '.czml', $czml);

  if ($fileRes) {
    // 存入文件路径、作者、分享情况等数据库信息
    $czmlifo = array(
      'author' => $author,
      'createuser' => $author,
      'projectname' => $projectName,
      'filepath' => $filePath . '/' . $filePath . '.czml',
      'shareduser' => $shared,
      'public' => $public,
      'hashToken' => $filePath
    );
    $database->_insert('czml', $czmlifo);
    $result = $database->getMessage();
    if ($result['success']) {
      $czmlifo['success'] = true;
      echo json_encode($czmlifo);
    } else {
      echo json_encode($result);
    }
  } else {
    echo json_encode(array('status:' => 'error', 'errorIfo' => '存储失败', 'detail' => '$fileRes'));
  }
}
