<?php

require_once "../conf/conn_mysql.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $objData = json_decode(file_get_contents('php://input'), true);


    $password = $objData['password'];
    $email = $objData['email'];
    $name = $objData['name'];


    $hash = password_hash($password, PASSWORD_DEFAULT);



$consulta = $conn->prepare("INSERT INTO user (name, lastname, email, password) VALUES (?, ?, ?,?)");

$consulta->execute();

$data = $consulta->fetch(PDO::FETCH_ASSOC);
}
if () {

};


?>