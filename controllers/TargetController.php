<?php

class TargetController {


private function saveTarget($data) {

  require "../conf/conn_mysql.php";

    // $query = "INSERT INTO targets($data['name'], ) VALUES()";
    $query = 'INSERT INTO targets(name,amount,currency) VALUES("proyector",20,"ARS")';
    $consulta = $conn->prepare($query);

    if($consulta->execute()){
      return true;
    }else{
      return false;
    }
    
  }

}
      
        
 
?>