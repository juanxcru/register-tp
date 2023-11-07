<?php

class RegController {

public function save($data){

  require_once "../conf/conn_mysql.php";

    
  $consulta = $conn->prepare("CALL insert_rec_segun_type(?, ?, ?, ?, ?, ?)");

  $consulta->bindParam(1, $data['type'], PDO::PARAM_STR);
  $consulta->bindParam(2, $data['accFrom'], PDO::PARAM_INT);
  $consulta->bindParam(3, $data['accTo'], PDO::PARAM_INT);
  $consulta->bindParam(4, $data['regDate'], PDO::PARAM_STR);
  $consulta->bindParam(5, $data['amount'], PDO::PARAM_STR);
  $consulta->bindParam(6, $data['category'], PDO::PARAM_STR);
  
  if($consulta->execute()){
    return "OK";
  }else{
    return "NO OK";
  }

}



}


