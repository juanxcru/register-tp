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

    
    $query = "UPDATE accounts SET balance = ((SELECT balance FROM accounts WHERE id = ?) "; // + ? ) WHERE id = ? 

    if ($accTo !== NULL) {
        $query .= "+ ?";
    } else if ($accFrom !== NULL) {
        $query .= "- ?";
    } else {
        return false;
    }

    $query .= ") WHERE id = ?";
    $consulta = $conn->prepare($query);

    if ($accTo !== NULL) {
        $consulta->bindParam(1, $accTo, PDO::PARAM_INT);
        $consulta->bindParam(2, $amount, PDO::PARAM_STR);
        $consulta->bindParam(3, $accTo, PDO::PARAM_INT);
    } else if ($accFrom !== NULL) {
        $consulta->bindParam(1, $accFrom, PDO::PARAM_INT);
        $consulta->bindParam(2, $amount, PDO::PARAM_STR);
        $consulta->bindParam(3, $accFrom, PDO::PARAM_INT);
    }

    if($consulta->execute()){
      return true;
    }else{
      return false;
    }

    
  }


}
      
        
 
?>








