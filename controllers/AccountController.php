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

  public function save($data, $idUser){
    
    require "../conf/conn_mysql.php";
    $crcy = "ARS";
    
    $consulta = $conn->prepare("INSERT INTO accounts (name, description, currency, balance, id_user) VALUES (?, ?, ?, ?, ?);");
    
    $consulta->bindParam(1, $data['name'],PDO::PARAM_STR);
    $consulta->bindParam(2, $data['description'],PDO::PARAM_STR);
    $consulta->bindParam(3, $crcy ,PDO::PARAM_STR);
    $consulta->bindParam(4, $data['balance'],PDO::PARAM_STR);
    $consulta->bindParam(5, $idUser,PDO::PARAM_INT);


    try{

      $consulta->execute();
      // uso last insert id que me devuleve el id de la ultima insercion 
     
      $id = $conn->lastInsertId();

      return $id;
    }catch(Exception $e){
      return false;
    }

  }




}

?>