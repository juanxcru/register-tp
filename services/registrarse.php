<?php

require_once "../conf/conn_mysql.php";
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $objData = json_decode(file_get_contents('php://input'), true);


    $password = $objData['password'];
    $email = $objData['email'];
    $name = $objData['name'];
    $lastname = $objData['lastname'];

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $consulta = $conn->prepare("SELECT id FROM user WHERE email = ?");
    $consulta->bindParam(1, $email, PDO::PARAM_STR);
    $consulta->execute();
    $user = $consulta->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $respuesta = [
            "exito" => false,
            "mensaje" => "Ya existe"
        ];
        http_response_code(200);

        echo json_encode($respuesta);
    
    } else {

        $consulta = $conn->prepare("INSERT INTO user (name, lastname, email, password) VALUES (?, ?, ?,?)");
        $consulta->bindParam(1, $name, PDO::PARAM_STR);
        $consulta->bindParam(2, $lastname, PDO::PARAM_STR);
        $consulta->bindParam(3, $email, PDO::PARAM_STR);
        $consulta->bindParam(4, $hash, PDO::PARAM_STR);

        if($consulta->execute()){
            $respuesta = [
                "exito" => true,
                "mensaje" => "Creado exitosamente"
            ];

            http_response_code(200);
            echo json_encode($respuesta);
        }else{
            $respuesta = [
                "exito" => false,
                "mensaje" => "ERROR"
            ];

            http_response_code(200);
            echo json_encode($respuesta);
        }   
    }
}



?>