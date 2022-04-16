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

// 获取原本文件路径
$czmlData = json_decode($czml, true);

$parentsPath = "../czml";

// 如果有 hashToken 查找数据库里有没有对应的记录，
// 有则删除原来的文件，记录新的文件信息，hash值保持不变
// 没有则创建新文件
$has_Record = false;
if (array_key_exists('hashToken', $czmlData)) {
  $hashToken = $czmlData[0]['hashToken'];
  $database->_select('czml', 'id', "hashToken = '$hashToken'");
  $queryResult = $database->getMessage();

  if ($queryResult['success']) {
    if (count($queryResult['affected_rows'])) {
      $has_Record = true;
    }
  }
}

if ($has_Record) {
  // 查到相关记录删除原始文件并保存新文件
  $pre_czml_ifo = $queryResult['affected_rows'];
  $pre_file_path = $parentsPath . '/' . $hashToken . '/' . $hashToken . '.czml';
  // 删除原始文件
  unlink($pre_file_path);
  // 保存新文件
  $new_filepath = $pre_file_path;
  $fileRes = file_put_contents($new_filepath, $czml);
  if ($fileRes) {
    // 更新数据库信息
    // 更新文件分享情况与名字数据库信息
    $czmlifo = array(
      'createuser' => $author,
      'projectname' => $projectName,
      'filepath' =>  $new_filepath,
      'shareduser' => $shared,
      'public' => $public,
      'hashToken' => $hashToken
    );

    $database->_update('czml', $czmlifo, "id = $author");
  } else {
    $czmlifo = array(
      'success' => false,
      'errorIfo' => '文件写入失败',
    );
  }
} else {
  // 新建文件
  $filePath = substr(hash('md5', $czml), 0, 32);

  // 创建文件夹
  if (!file_exists($parentsPath . '/' . $filePath)) {
    mkdir($parentsPath . '/' . $filePath);
  }

  $new_filepath = $parentsPath . '/' . $filePath . '/' . $filePath . '.czml';
  $fileRes = file_put_contents($new_filepath, $czml);

  if ($fileRes) {
    $czmlifo = array(
      'createuser' => $author,
      'projectname' => $projectName,
      'filepath' =>  $new_filepath,
      'shareduser' => $shared,
      'public' => $public,
      'hashToken' => $filePath
    );
    // 插入数据
    $database->_insert('czml', $czmlifo);
  } else {
    $saveifo = array(
      'success' => false,
      'errorIfo' => '文件写入失败',
    );
  }
}

$result = $database->getMessage();
if ($result['success']) {
  $czmlifo['success'] = true;
} else {
  $czmlifo['success'] = false;
  $czmlifo['errorIfo'] = $result['msg'];
}

echo json_encode($czmlifo);
