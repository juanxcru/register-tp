<?php

require_once "../conf/conn_mysql.php";
header("Content-Type: application/json");

session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

  $objData = json_decode(file_get_contents('php://input'), true);


  $password = $objData['password'];
  $email = $objData['email'];

  $consulta = $conn->prepare("SELECT id, email, name, lastname, password FROM user WHERE email = ?");
  $consulta->bindParam(1, $email, PDO::PARAM_STR);
  $consulta->execute();
  $user = $consulta->fetch(PDO::FETCH_ASSOC);


  if ($user && password_verify($password, $user['password'])) {
    
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['name'] = $user['lastname'];
        $_SESSION['lastname'] = $user['lastname'];
          
        $respuesta = [
          "exito" => true,
          "mensaje" => "Login OK",
      ];
      http_response_code(200);

      echo json_encode($respuesta);
  }else {

    $respuesta = [
      "exito" => false,
      "mensaje" => "Usuario o contraseña invalidos"
  ];
      http_response_code(400);

      echo json_encode($respuesta);

  }
}
