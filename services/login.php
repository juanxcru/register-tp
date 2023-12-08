<?php

require_once "../conf/conn_mysql.php";
require_once "../controllers/PermissionController.php";
header("Content-Type: application/json");

session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

  $permissionController = new PermissionController();

  $objData = json_decode(file_get_contents('php://input'), true);


  $password = $objData['password'];
  $email = $objData['email'];

  $consulta = $conn->prepare("SELECT id, email, name, lastname, password FROM user WHERE email = ?");
  $consulta->bindParam(1, $email, PDO::PARAM_STR);
  $consulta->execute();
  $user = $consulta->fetch(PDO::FETCH_ASSOC);


  if ($user){ 
    
    if(password_verify($password, $user['password'])) {
    
      
      
      $role = $permissionController->getRoleNameIdByidUser($user['id']);
      
      if($role){

        
        $_SESSION['user_id'] = $user['id'];
        
        $respuesta = [
          "exito" => true,
          "mensaje" => "Login OK",
          "role" => $role,
        ];
        
        http_response_code(200);
        echo json_encode($respuesta);
      }else{
        $respuesta = [
          "exito" => false,
          "mensaje" => "Rol invalido",
          "err" => "role",
        ];
          http_response_code(400);
          echo json_encode($respuesta);
      }
    }else {

      $respuesta = [
        "exito" => false,
        "mensaje" => "Contraseña invalida",
        "err" => "password",
      ];
        http_response_code(400);

        echo json_encode($respuesta);

    }
  }else{
    $respuesta = [
      "exito" => false,
      "mensaje" => "Email no registrado",
      "err" => "email"
    ];
      http_response_code(400);

      echo json_encode($respuesta);
  }
}
