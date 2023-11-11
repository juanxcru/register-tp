<?php

class RegController {

public function save($data){

  require_once "../conf/conn_mysql.php";


  if($this->refreshBalance($data['accTo'], $data['accFrom'], $data['amount'])){

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
  }else{
    return "NO OK REFRESH";
  }


}

private function refreshBalance($accTo, $accFrom, $amount) : bool {

  require "../conf/conn_mysql.php";


  if ($accTo === null && $accFrom === null) {
      return false;
  }

  $stringTo = "UPDATE accounts SET balance = (SELECT balance FROM accounts WHERE id = ?) WHERE id = ?";
  $stringFrom = "UPDATE accounts SET balance = (SELECT balance FROM accounts WHERE id = ?) WHERE id = ?";

  $consultaTo = $conn->prepare($stringTo);
  $consultaFrom = $conn->prepare($stringFrom);

  if ($accTo !== null) {
      $consultaTo->bindParam(1, $amount, PDO::PARAM_STR);
      $consultaTo->bindParam(2, $accTo, PDO::PARAM_INT);
      $consultaTo->execute();
  }

  if ($accFrom !== null) {
      $consultaFrom->bindParam(1, $amount, PDO::PARAM_STR);
      $consultaFrom->bindParam(2, $accFrom, PDO::PARAM_INT);
      $consultaFrom->execute();
  }

  return true;

    
  }


}
      
        
 
?>








