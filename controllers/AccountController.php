<?php


class AccountController {

  public function readAll($id){

    
    require_once "../conf/conn_mysql.php";

    //ver relacion con user : cuentas de un usuario tabla accounts + id de user?
    $consulta = $conn->prepare("SELECT * FROM accounts WHERE id_user = :id");
    $consulta->bindParam(':id', $id);
    $consulta->execute();

    $data = $consulta->fetchAll(PDO::FETCH_ASSOC);

    return $data;

  }

  public function readOneById($id,$iduser){

    
    require_once "../conf/conn_mysql.php";

    //ver relacion con user : cuentas de un usuario tabla accounts + id de user?
     $consulta = $conn->prepare("SELECT * FROM accounts WHERE id_user = :iduser AND id = :id");
     $consulta->bindParam(':iduser', $iduser);
     $consulta->bindParam(':id', $id);

    // $consulta = $conn->prepare("SELECT * FROM accounts WHERE id_user = ? AND id = ?");
    // $consulta->bindParam('1', $iduser, PDO::PARAM_INT);
    // $consulta->bindParam('2', $id, PDO::PARAM_INT);
    $consulta->execute();

    $data = $consulta->fetchAll(PDO::FETCH_ASSOC);

    return $data;

  }

  public function save($data){
    


  }

}

?>