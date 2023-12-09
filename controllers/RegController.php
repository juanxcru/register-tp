<?php

class RegController
{

  public function save($data, $idUser)
  {

    require "../conf/conn_mysql.php";

    if ( // lasc uetnas tan verfi
      // !isset($data['accTo']) || !isset($data['accFrom']) ||
      !isset($data['amount']) || 
      !isset($data['regDate']) || !isset($data['category'])
    ) {
      return [
        'exito' => false,
        'mensaje' => "Solicitud Erronea: ",
        'err' => "sys",
      ];

    }


    $type = $data['type'];
    $accFrom = $data['accFrom'];
    $accTo = $data['accTo'];
    $regDate = $data['regDate'];
    $amount = $data['amount'];
    $category = $data['category'];

    if (
      !is_string($type) || empty($type) || strlen($type) > 15 ||
      ($type != 'Income' && $type != 'Move' && $type != 'Spent')
    ) {
      return [
        'exito' => false,
        'mensaje' => "type no valido",
        'err' => 'type'
      ];
    }

    // las cuentas sevalidan en el entry point.

    if (!is_numeric($amount) || $amount < 0 || !is_float($amount * 1.0)) {
      return [
        'exito' => false,
        'mensaje' => "Monto no valido",
        'err' => 'amount'
      ];

    }

    if (
      !is_string($category) || $category == null || strlen($type) > 30
    ) { //puede venir vacia
      return [
        'exito' => false,
        'mensaje' => "categoria no valida",
        'err' => 'sys'
      ];
    }





    if ($this->refreshBalance($data['accTo'], $data['accFrom'], $data['amount'], $idUser)) {

      //$consulta = $conn->prepare("CALL insert_rec_segun_type(?, ?, ?, ?, ?, ?,?)");

      $consulta = $conn->prepare("INSERT INTO reg 
                                  (type, id_acc_from, id_acc_to, 
                                  reg_date, amount, category, id_user_reg) VALUES 
                                  (?,?,?,?,?,?,?);");

      $consulta->bindParam(1, $type, PDO::PARAM_STR);
      $consulta->bindParam(2, $accFrom, PDO::PARAM_INT);
      $consulta->bindParam(3, $accTo, PDO::PARAM_INT);
      $consulta->bindParam(4, $regDate, PDO::PARAM_STR);
      $consulta->bindParam(5, $amount, PDO::PARAM_STR);
      $consulta->bindParam(6, $category, PDO::PARAM_STR);
      $consulta->bindParam(7, $idUser, PDO::PARAM_INT);


      try {

        if(!$consulta->execute()){
          return [
            "exito" => false,
            "mensaje" => "Error al intentar grabar registro",
            "err" => "sys"
          ];
        }
        // uso last insert id que me devuleve el id de la ultima insercion 
        // como uso el sp, no me funciona el metodo de pdo

        $consulta = $conn->prepare("SELECT LAST_INSERT_ID() AS id");
        $consulta->execute();
        $res = $consulta->fetch(PDO::FETCH_ASSOC);
        if($res){
          return [
            "exito" => true,
            "id" => $id
          ];
        }else{
          return [
            "exito" => false,
            "mensaje" => "Error al intentar recuperar id de nuevo registro",
            "err" => "sys"
          ];
        }
      } catch (Exception $e) {
        return [
          "exito" => false,
          "id" => $e->getMessage(),
          "err" => "sys"
        ];
      }
    } else {
      return [
        "exito" => false,
        "mensaje" => "Error al intentar impactar sobre los fondos en la base de datos",
        "err" => "sys"
      ];
    }


  }

  public function readAllFromAllUsers()
  {

    require "../conf/conn_mysql.php";

    $consulta = $conn->prepare("SELECT type, amount FROM reg");

    $consulta->execute();

    $data = $consulta->fetchAll(PDO::FETCH_ASSOC);

    return $data;
  }

  public function delete($id, $idUser)
  {

    require "../conf/conn_mysql.php";


    $actualReg = $this->readOneByIdAccName($id, $idUser);
    if ($this->reverseReg($actualReg['id_acc_to'], $actualReg['id_acc_from'], $actualReg['amount'], $idUser)) {
      $query = 'DELETE FROM reg WHERE id = ?';


      $consulta = $conn->prepare($query);

      $consulta->bindParam(1, $id, PDO::PARAM_INT);


      try {
        $consulta->execute();
        return true;
      } catch (Exception $e) {
        return false;
      }

    }






  }


  private function refreshBalance($accTo, $accFrom, $amount, $iduser)
  {

    require "../conf/conn_mysql.php";


    if ($accTo === null && $accFrom === null) {
      return false;
    }

    $stringTo = "UPDATE accounts SET balance = ((SELECT balance FROM accounts WHERE id = ? AND id_user = ?) + ?) WHERE id = ? AND id_user = ?";
    $stringFrom = "UPDATE accounts SET balance = ((SELECT balance FROM accounts WHERE id = ? AND id_user = ?) - ?) WHERE id = ? AND id_user = ?";

    $consultaTo = $conn->prepare($stringTo);
    $consultaFrom = $conn->prepare($stringFrom);

    if ($accTo !== null) {
      $consultaTo->bindParam(1, $accTo, PDO::PARAM_STR);
      $consultaTo->bindParam(2, $iduser, PDO::PARAM_INT);
      $consultaTo->bindParam(3, $amount, PDO::PARAM_STR);
      $consultaTo->bindParam(4, $accTo, PDO::PARAM_INT);
      $consultaTo->bindParam(5, $iduser, PDO::PARAM_INT);
      $consultaTo->execute();
    }
    if ($accFrom !== null) {
      $consultaFrom->bindParam(1, $accFrom, PDO::PARAM_STR);
      $consultaFrom->bindParam(2, $iduser, PDO::PARAM_INT);
      $consultaFrom->bindParam(3, $amount, PDO::PARAM_STR);
      $consultaFrom->bindParam(4, $accFrom, PDO::PARAM_INT);
      $consultaFrom->bindParam(5, $iduser, PDO::PARAM_INT);
      $consultaFrom->execute();
    }

    return true;


  }


  public function readOneByIdAccName($id, $iduser)
  {

    require "../conf/conn_mysql.php";
    try {
      $consulta = $conn->prepare("SELECT reg.id,
                                    accounts_to.name AS name_acc_to,
                                    accounts_from.name AS name_acc_from,
                                    reg.category,
                                    reg.amount,
                                    reg.reg_date,
                                    reg.type,
                                    reg.id_acc_to,
                                    reg.id_acc_from
                                FROM reg
                                LEFT JOIN accounts AS accounts_to ON reg.id_acc_to = accounts_to.id
                                LEFT JOIN accounts AS accounts_from ON reg.id_acc_from = accounts_from.id
                                WHERE reg.id_user_reg = :iduser AND reg.id = :id ;");
      $consulta->bindParam(':iduser', $iduser);
      $consulta->bindParam(':id', $id);

      $consulta->execute();

      $data = $consulta->fetch(PDO::FETCH_ASSOC);

      return $data;
    } catch (Exception $e) {
      return false;
    }
  }


  public function readAll($iduser)
  {

    require "../conf/conn_mysql.php";
    try {

      $consulta = $conn->prepare("SELECT reg.id,
                                      accounts_to.name AS name_acc_to,
                                      accounts_from.name AS name_acc_from,
                                      reg.category,
                                      reg.amount,
                                      reg.reg_date,
                                      reg.type
                                  FROM reg
                                  LEFT JOIN accounts AS accounts_to ON reg.id_acc_to = accounts_to.id
                                  LEFT JOIN accounts AS accounts_from ON reg.id_acc_from = accounts_from.id
                                  WHERE reg.id_user_reg = :iduser;");

      $consulta->bindParam(':iduser', $iduser);

      $consulta->execute();

      $data = $consulta->fetchAll(PDO::FETCH_ASSOC);

      return [
        'exito' => true,
        'mensaje' => "ok",
        'data' => $data
      ];

    } catch (Exception $e) {
      return [
        'exito' => false,
        'mensaje' => $e->getMessage(),
        'err' => 'sys'
      ];
    }

  }

  // public function readOneById($idReg, $iduser){

  //   require "../conf/conn_mysql.php";

  //   $consulta = $conn->prepare("SELECT * FROM reg
  //                               WHERE id_user_reg = :iduser AND id = :id ;");
  //   $consulta->bindParam(':iduser', $iduser);
  //   $consulta->bindParam(':id', $id);

  //   $consulta->execute();

  //   $data = $consulta->fetch(PDO::FETCH_ASSOC);

  //   return $data;

  // }
  public function update($updReg, $iduser, $idReg)
  {

    require "../conf/conn_mysql.php";

    if (
      !isset($data['accTo']) || !isset($data['accFrom']) ||
      !isset($data['amount']) || !isset($data['currency']) ||
      !isset($data['regDate']) || !isset($data['category'])
    ) {
      return [
        'exito' => false,
        'mensaje' => "Solicitud Erronea",
        'err' => 'sys'
      ];

    }


    $type = $data['type'];
    $accFrom = $data['accFrom'];
    $accTo = $data['accTo'];
    $regDate = $data['regDate'];
    $amount = $data['amount'];
    $category = $data['category'];


    if (
      !is_string($type) || empty($type) || strlen($type) > 15 ||
      ($type != 'Income' && $type != 'Move' && $type != 'Spent')
    ) {
      return [
        'exito' => false,
        'mensaje' => "type no valido",
        'err' => 'type'
      ];
    }

    // las cuentas sevalidan en el entry point.

    if (!is_numeric($amount) || $amount < 0 || !is_float($amount * 1.0)) {
      return [
        'exito' => false,
        'mensaje' => "Monto no valido",
        'err' => 'amount'
      ];

    }

    if (
      !is_string($category) || $category == null || strlen($type) > 30
    ) { //puede venir vacia
      return [
        'exito' => false,
        'mensaje' => "categoria no valida",
        'err' => 'sys'
      ];
    }

    $actualReg = $this->readOneByIdAccName($idReg, $iduser);
    if ($actualReg) {
      try {
        if ($this->reverseReg($actualReg['id_acc_to'], $actualReg['id_acc_from'], $actualReg['amount'], $iduser)) {

          if ($this->refreshBalance($updReg['accTo'], $updReg['accFrom'], $updReg['amount'], $iduser)) {

            $consulta = $conn->prepare("UPDATE reg SET type = ? , 
                                      reg_date = ? , 
                                      amount = ? , 
                                      category = ? , 
                                      id_acc_from = ? ,
                                      id_acc_to = ?
                                      WHERE id = ? AND id_user_reg = ?");

            $consulta->bindParam(1, $updReg['type'], PDO::PARAM_STR);
            $consulta->bindParam(2, $updReg['regDate'], PDO::PARAM_STR);
            $consulta->bindParam(3, $updReg['amount'], PDO::PARAM_STR);
            $consulta->bindParam(4, $updReg['category'], PDO::PARAM_STR);
            $consulta->bindParam(5, $updReg['accFrom'], PDO::PARAM_INT);
            $consulta->bindParam(6, $updReg['accTo'], PDO::PARAM_INT);
            $consulta->bindParam(7, $idReg, PDO::PARAM_INT);
            $consulta->bindParam(8, $iduser, PDO::PARAM_INT);

            if ($consulta->execute()) {
              return [
                'exito' => true,
                'mensaje' => "Ok",
              ];
            } else {
              return [
                'exito' => false,
                'mensaje' => "Error al actualizar registro",
                'err' => 'sys'
              ];
            }

          } else {
            return [
              'exito' => false,
              'mensaje' => "Error al actualizar el balance al actualizar registro",
              'err' => 'sys'
            ];
          }
        } else {
          return [
            'exito' => false,
            'mensaje' => "Error al reversar el balance al actualizar el registro",
            'err' => 'sys'
          ];
        }

      } catch (Exception $e) {
        return [
          'exito' => false,
          'mensaje' => $e->getMessage(),
          'err' => 'sys'
        ];
      }

    }else{
      return [
        'exito' => false,
        'mensaje' => "Error al leer el registro previo",
        'err' => 'sys'
      ];
    }
  }


  private function reverseReg($accTo, $accFrom, $amount, $iduser)
  {

    if ($accTo != null && $accFrom != null) {
      //                            to         from
      return $this->refreshBalance($accFrom, $accTo, $amount, $iduser);
    } else if ($accTo == null) {
      // es un spent a reversar, entonces
      // tengo que usarla como cuenta to la cuenta from
      return $this->refreshBalance($accFrom, null, $amount, $iduser);
    } else if ($accFrom == null) {
      //este es un income 
      return $this->refreshBalance(null, $accTo, $amount, $iduser);
    }

    return false;
  }

}




?>