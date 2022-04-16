<?php

//数据库连接类
class Mysql
{
  // 静态属性，所有数据库实例共用，避免重复连接数据库
  protected static $_dbh = null;
  // 数据库连接信息
  private $db_type;
  private $db_host;
  private $db_port;
  private $db_name;

  // 用户登录信息
  private $db_user;       //数据库登陆名
  private $db_pwd;        //数据库登陆密码

  // 数据库连接参数
  private $db_charset;    //数据库字符编码
  private $db_pconn;      //长连接标识位
  private $debug;         //调试开启
  // private $conn;          //数据库连接标识

  //数据库操纵信息
  private $state = array();

  //待执行的SQL语句
  private $sql = "";


  public function __construct()
  {
    class_exists('PDO') or die("PDO: class not exists.");
    $this->db_type = 'mysql';
    $this->db_host = '127.0.0.1';
    $this->db_name = 'geocode';

    $this->db_user = "root";
    $this->db_pwd = "soilDB_2021";

    $this->db_charset = 'utf8';
    $this->db_pconn = true;
    $this->result = '';
    $this->debug = false;

    if (is_null(self::$_dbh)) {
      $this->initConnect();
    }
  }

  // 连接数据库
  public function initConnect()
  {
    // 为什么这里空格都会有影响？
    // 不然连不上服务器或者连不上数据库（而且不报错！
    // 气死我了QAQ
    $dsn = "$this->db_type:host =$this->db_host;dbname=$this->db_name";
    // 判断连接数据库的方式 长连接 OR 短连接
    $options = $this->db_pconn ? array(PDO::ATTR_PERSISTENT => true) : array();

    // 连接数据库
    try {
      $dbh = new PDO($dsn, $this->db_user, $this->db_pwd, $options);
      // 如果sql语句执行错误则抛出异常，事务会自动回滚
      $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // 禁用 prepared statement 的仿真效果，防止 SQL 注入
      $dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    } catch (PDOException $e) {
      die('Connect Failed:' . $e->getMessage());
    }

    $dbh->exec('SET NAMES utf8');
    self::$_dbh = $dbh;
  }

  /**
   * 字段和表名添加 `符号
   * 保证指令中使用关键字不出错 针对mysql
   * @param string $value
   * @return string
   */
  protected function _addChar($value)
  {
    if ('*' == $value || false !== strpos($value, '(') || false !== strpos($value, '.') || false !== strpos($value, '`')) {
      //如果包含* 或者 使用了sql方法 则不作处理
    } elseif (false === strpos($value, '`')) {
      $value = '`' . trim($value) . '`';
    }
    return $value;
  }

  /**
   * 取得数据表的字段信息
   * @param string $tbName 表名
   * @return array
   */
  public function _tbFields($tbName)
  {
    $sql = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME= '$tbName' ";
    $stmt = self::$_dbh->query($sql);

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $ret = array();
    foreach ($result as $key => $value) {
      $ret[$value['COLUMN_NAME']] = 1;
    }
    return $ret;
  }

  /**
   * 过滤并格式化数据表字段
   * @param string $tbName 数据表名
   * @param array $data POST提交数据
   * @return array $newdata
   */
  protected function _dataFormat($tbName, $data)
  {
    if (!is_array($data)) return array();
    $table_column = $this->_tbFields($tbName);
    $ret = array();
    foreach ($data as $key => $val) {
      if (!is_scalar($val)) continue; //值不是标量则跳过
      if (array_key_exists($key, $table_column)) {
        $key = $this->_addChar($key);
        if (is_int($val)) {
          $val = intval($val);
        } elseif (is_float($val)) {
          $val = floatval($val);
        } elseif (preg_match('/^\(\w*(\+|\-|\*|\/)?\w*\)$/i', $val)) {
          // 支持在字段的值里面直接使用其它字段 ,例如 (score+1) (name) 必须包含括号
          $val = $val;
        } elseif (is_string($val)) {
          //将字符串中的单引号（'）、双引号（"）、反斜线（\）与 NUL（NULL 字符转义
          $val = '"' . addslashes($val) . '"';
        }
        $ret[$key] = $val;
      }
    }
    return $ret;
  }

  /**
   * 执行查询 主要针对 SELECT, SHOW 等指令
   * @param string $sql sql指令
   * @return mixed
   */

  public function _query($sql = '')
  {
    $this->sql = $sql;
    try {
      // prepare 或者 query 返回一个 PDOStatement
      $stmt = self::$_dbh->query($sql);

      $this->result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $this->state['success'] = true;
      $this->state['affected_rows'] = $this->result;
    } catch (PDOException $e) {
      $this->state['success'] = false;
      $this->state['msg'] = "<hr>sql执行出错，错误原因：" . '<br>' . $e->getMessage() . '<br>'  . "错误语句：" . $sql;
    }
  }

  /**
   * 
   * 执行语句 针对 INSERT, UPDATE 以及DELETE,exec结果返回受影响的行数
   * @param string $sql sql指令
   * @return integer
   * 
   */
  public function _doExec($sql = '')
  {
    $this->_sql = $sql;
    try {
      $stmt = self::$_dbh->exec($sql);
      $this->state['success'] = true;
      $this->state['affected_rows'] = $stmt;
    } catch (PDOException $e) {
      $this->state['success'] = false;
      $this->state['msg'] = "<hr>sql执行出错，错误原因：" . '<br>' . $e->getMessage() . '<br>'  . "错误语句：" . '<br>'  . $sql;
    }
  }

  /**
   * 
   * 插入函数，操作示例
   * $userInfo = array('username'=>'system', 'password' => md5("system"));
   * $db->_insert("user", $userInfo);
   * dump($db->printMessage());
   * 
   */

  public function _insert($tableName, array $column)
  {
    $data = $this->_dataFormat($tableName, $column);
    if (!$data) return;
    $sql = "insert into " . $tableName . "(" . implode(',', array_keys($data)) . ") values(" . implode(',', array_values($data)) . ")";
    return $this->_doExec($sql);
  }

  /**
   * 
   * 删除函数，操作示例
   * $db->delete("user", "id = 1");
   * dump($db->printMessage());
   * 
   */

  public function _delete($tableName, $where = "")
  {
    $sql = "DELETE FROM $tableName";
    $sql .= $where ? " WHERE $where" : null;
    return $this->_doExec($sql);
  }

  /**
   * 
   * 查找函数，操作示例
   * $db->_select("user", "*", "username = 'system'");
   * 
   */
  public function _select($tableName, $columnName = "*", $where = "")
  {
    $sql = "SELECT " . $columnName . " FROM " . $tableName;
    $sql .= $where ? " WHERE " . $where : null  . " ORDER BY code ASC";
    return $this->_query($sql);
  }

  /**
   * 
   * 更新函数，操作示例
   * $userInfo = array('password' => md5("123456"));
   * $db->update("user", $userInfo, "id = 2");
   * dump($db->printMessage());
   * 
   */

  public function _update($tableName, $column = array(), $where = "")
  {
    $updateValue = "";
    foreach ($column as $key => $value) {
      $updateValue .= $key . "='" . $value . "',";
    }
    // 这里可能要改
    $updateValue = substr($updateValue, 0, strlen($updateValue) - 1);
    $sql = "UPDATE $tableName SET $updateValue";
    $sql .= $where ? " WHERE $where" : null;
    return $this->_doExec($sql);
  }

  // $state中包含操作成功状态，错误提示、操作结果
  public function getMessage()
  {
    return $this->state;
  }
}
 

 /* 操作示例
 //findAll   查询全部
 $db->findAll("user");
 $result = $db->fetchArray();
 dump($result);
 */