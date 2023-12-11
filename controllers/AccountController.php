<?php


class AccountController {

  public function readAll($id){

    
    require "../conf/conn_mysql.php";

    try{

      $consulta = $conn->prepare("SELECT * FROM accounts WHERE id_user = :id");
      $consulta->bindParam(':id', $id);
      $data = $consulta->execute();
      
      $data = $consulta->fetchAll(PDO::FETCH_ASSOC);
      
      // si esta vacio, envio un array vacio en data, asi lo identifico en el front
      return [
        'exito' => true,
        'mensaje' => "ok",
        'data' => $data
      ];
      
    }catch(Exception $e){
      return [
        'exito' => false,
        'mensaje' => $e->getMessage(),
        'err' => 'sys'
      ];
    }
  }

  public function readOneById($id){

    
      require "../conf/conn_mysql.php";
      try{
        $consulta = $conn->prepare("SELECT * FROM accounts WHERE id = :id");
        //$consulta->bindParam(':iduser', $iduser);
        $consulta->bindParam(':id', $id);

        $consulta->execute();

        $data = $consulta->fetch(PDO::FETCH_ASSOC);
        
        return $data; 
      }catch(Exception $e){
        return false;
      }
    
  }
  
  public function save($data, $idUser){
    
    require "../conf/conn_mysql.php";

    
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
    
    if (!is_string($name) || empty($name) || strlen($name) > 12){
      return [
        'exito' => false,
        'mensaje' => "Nombre no valido",
        'err' => 'name'
      ];
    }
    
    if (!is_string($description) || empty($description) || strlen($description) > 50){
      return [
        'exito' => false,
        'mensaje' => "Descripcion no valida",
        'err' => 'descr'
      ];
    }
    // la moneda, solo en ARS o USD (solamente para ahorro) no es userinput
    
    if(empty($crcy) || ($crcy !== "ARS" && $crcy !== "USD") || strlen($crcy) > 3){
      return [
        'exito' => false,
        'mensaje' => "Moneda no valida",
        'err' => 'sys' // va de sys porque no es input de usuario
      ];
    }
    
    if(!is_numeric($balance) || $balance < 0 || !is_float($balance * 1.0) ){
      return [
        'exito' => false,
        'mensaje' => "Balance no valido ",
        'err' => 'balance'
      ];
      
    }
    
    
    try{
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
        'err' => 'sys'
      ];
    }

  }

  public function update($updAcc, $iduser, $idAcc){

    require "../conf/conn_mysql.php";
    try{

      if( !isset($updAcc['name'])  || !isset($updAcc['description']) || 
          !isset($updAcc['balance']) || !isset($updAcc['currency'])){
      return [
        'exito' => false,
        'mensaje' => "Solicitud Erronea",
        'err' => 'sys'
      ];

    }

    $name = $updAcc['name'];
    $description = $updAcc['description'];
    $balance = $updAcc['balance'];
    $crcy = $updAcc['currency']; 



    if (!is_string($name) || empty($name) || strlen($name) > 12 || $name == "Ahorros USD" || $name == "Ahorros ARS"){
      return [
        'exito' => false,
        'mensaje' => "Nombre no valido",
        'err' => 'name'
      ];
    }
    
    if (!is_string($description) || empty($description) || strlen($description) > 50){
      return [
        'exito' => false,
        'mensaje' => "Descripcion no valida",
        'err' => 'descr'
      ];
    }
    // la moneda, solo en ARS o USD (solamente para ahorro) no es userinput
    
    if(empty($crcy) || ($crcy !== "ARS" && $crcy !== "USD") || strlen($crcy) > 3){
      return [
        'exito' => false,
        'mensaje' => "Moneda no valida",
        'err' => 'sys' // va de sys porque no es input de usuario
      ];
    }
    
    if(!is_numeric($balance) || $balance < 0 || !is_float($balance * 1.0) ){
      return [
        'exito' => false,
        'mensaje' => "Balance no valido ",
        'err' => 'balance'
      ];
      
    }

      $consulta = $conn->prepare("UPDATE accounts SET 
                                    name = ?,
                                    description = ?,
                                    currency = ?,
                                    balance = ?
                                    WHERE id = ? AND id_user = ?");
        
        $consulta->bindParam(1, $name, PDO::PARAM_STR);
        $consulta->bindParam(2, $description, PDO::PARAM_STR);
        $consulta->bindParam(3, $crcy, PDO::PARAM_STR);
        $consulta->bindParam(4, $balance, PDO::PARAM_STR);
        $consulta->bindParam(5, $idAcc, PDO::PARAM_INT);
        $consulta->bindParam(6, $iduser, PDO::PARAM_INT);
        
        if ($consulta->execute()) {
          return [
            'exito' => true,
            'mensaje' => "Ok",
          ];
        } else {
          return [
            'exito' => false,
            'mensaje' => "Error al actualizar cuenta",
            'err' => 'sys'
          ];
        }
        
      }catch(Exception $e){
        return [
          'exito' => false,
          'mensaje' => $e->getMessage(),
          'err' => 'sys'
        ];
        
      }

  }

  public function delete($id){
    require "../conf/conn_mysql.php";
    
    try {

      if($this->readOneById($id)){
        $consulta = $conn->prepare("DELETE FROM accounts WHERE id = ?;");
        $consulta->bindParam(1, $id, PDO::PARAM_INT);
        
        if($consulta->execute()){
          return [
            "exito" => true,
            "mensaje" => "Ok"
          ];
        }else{
          return [
            "exito" => false,
            "mensaje" => "Error al intentar borrar",
            "err" => "sys"
          ];
        }
      }else{
        return [
          "exito" => false,
          "mensaje" => "La cuenta que quiere borrar no existe",
          "err" => "sys"
        ];
      }
  } catch (Exception $e) {
    return [
      "exito" => false,
      "mensaje" => $e->getMessage(),
      "err" => "sys"
    ];
    }
  
  
  
  
  }

  public function getBalanceAhorros($iduser){

    require "../conf/conn_mysql.php";

    try {
      
      $consulta = $conn->prepare("SELECT balance FROM accounts WHERE name = 'Ahorros USD' AND id_user = ?");
      $consulta->bindParam(1, $iduser, PDO::PARAM_INT);
      if($consulta->execute()){
        $usd = $consulta->fetch(PDO::FETCH_ASSOC);
      }else{
        return [
          "exito"=> false,
          "mensaje" => "Error al leer Ahorros USD"
        ];
      }

      $consulta = $conn->prepare("SELECT balance FROM accounts WHERE name = 'Ahorros ARS' AND id_user = ?");
      $consulta->bindParam(1, $iduser, PDO::PARAM_INT);
      if($consulta->execute()){
        $ars = $consulta->fetch(PDO::FETCH_ASSOC);
      }else{
        return [
          "exito"=> false,
          "mensaje" => "Error al leer Ahorros ARS"
        ];
      }

      return [
        "exito"=> true,
        "USD" => $usd['balance'],
        "ARS" => $ars['balance']
      ];
      

    
    } catch (Exception $e) {
      return [
        "exito"=> false,
        "mensaje" => $e->getMessage()
      ];
    }



  }




   

}

?>