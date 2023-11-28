<?php


class AccountController {

  public function readAll($id){

    
    require "../conf/conn_mysql.php";

    //ver relacion con user : cuentas de un usuario tabla accounts + id de user?
    $consulta = $conn->prepare("SELECT * FROM accounts WHERE id_user = :id");
    $consulta->bindParam(':id', $id);
    $data = $consulta->execute();
  
    $data = $consulta->fetchAll(PDO::FETCH_ASSOC);

    
    return $data;
  }

  public function readOneById($id,$iduser){

    
    require "../conf/conn_mysql.php";

     $consulta = $conn->prepare("SELECT * FROM accounts WHERE id_user = :iduser AND id = :id");
     $consulta->bindParam(':iduser', $iduser);
     $consulta->bindParam(':id', $id);

    $consulta->execute();

    $data = $consulta->fetch(PDO::FETCH_ASSOC);

    return $data;

  }

  public function save($data){
    


  }

}

?>