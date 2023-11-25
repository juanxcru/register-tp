<?php

require_once "../conf/conn_mysql.php";


if ($_SERVER["REQUEST_METHOD"] == "POST") {


  $password = $_POST['password'];
  $email = $_POST['email'];

  $hash = password_hash($password, PASSWORD_DEFAULT);

  $consulta = $conn->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
  $consulta->execute([$username]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

}
