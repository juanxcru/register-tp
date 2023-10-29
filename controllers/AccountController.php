<?php


class AccountController {

  public function readAll(){

    
    require_once "../conf/conn_mysql.php";

    //ver relacion con user : cuentas de un usuario tabla accounts + id de user?
    $consulta = $conn->prepare("SELECT * FROM accounts");
    $consulta->execute();

    $data = $consulta->fetchAll(PDO::FETCH_ASSOC);

    return $data;


   


  }

}