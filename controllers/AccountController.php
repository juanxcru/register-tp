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

    try{
    
    if( !isset($data['name'])  || !isset($data['description']) || 
        !isset($data['balance']) || !isset($data['currency'])){
      return [
        'exito' => false,
        'mensaje' => "Solicitud Erronea",
        'err' => 'sys'
      ];

    }
    
    $name = $data['name'];
    $description = $data['description'];
    $balance = $data['balance'];
    $crcy = $data['currency']; 

    if (!is_string($name) || empty($name)){
      return [
        'exito' => false,
        'mensaje' => "Nombre no valido",
        'err' => 'name'
      ];
    }

    if (!is_string($description) || empty($description)){
      return [
        'exito' => false,
        'mensaje' => "Descripcion no valida",
        'err' => 'descr'
      ];
    }
    // la moneda, solo en ARS

    if(empty($crcy) || $crcy !== "ARS"){
      return [
        'exito' => false,
        'mensaje' => "Moneda no valida",
        'err' => 'sys' // va de sys porque no es input de usuario
      ];
    }

    if(empty($balance) || !is_numeric($balance) || $balance <= 0 || !is_float($balance * 1.0) ){
      return [
        'exito' => false,
        'mensaje' => "Balance no valido ",
        'err' => 'balance'
      ];

    }


    // si llego aca, porque ta ok

    $consulta = $conn->prepare("INSERT INTO accounts (name, description, currency, balance, id_user) VALUES (?, ?, ?, ?, ?);");
    
    $consulta->bindParam(1, $name,PDO::PARAM_STR);
    $consulta->bindParam(2, $description,PDO::PARAM_STR);
    $consulta->bindParam(3, $crcy ,PDO::PARAM_STR);
    $consulta->bindParam(4, $balance,PDO::PARAM_STR);
    $consulta->bindParam(5, $idUser,PDO::PARAM_INT);

    $consulta->execute();
    // uso last insert id que me devuleve el id de la ultima insercion 
    $id = $conn->lastInsertId();
    return [
      'exito' => true,
      'mensaje' => "Cuenta Guardada",
      'id' => $id
    ];
    }catch(Exception $e){
      return [
        'exito' => false,
        'mensaje' => $e->getMessage(),
        'err' => 'db'
      ];
    }

  }




}

?>