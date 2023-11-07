<?php

$servername = "127.0.0.1";
$username = "root";
$password = "";
$port = 3306;
$db = "register";

try {
    $conn = new \PDO("mysql:host=$servername;port=$port;dbname=" . $db . ";charset=utf8", $username, $password);

    $conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    //echo "Conectado!";
  } catch (Exception $e) {
    echo "Fallo!" . $e->getMessage();
    die(); 
}

?>