<?php

class TargetController
{


  public function readAll($id)
  {


    require "../conf/conn_mysql.php";
    try {
      $consulta = $conn->prepare("SELECT * FROM targets WHERE id_user = :id");
      $consulta->bindParam(':id', $id);
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

  public function save($data, $idUser, $balanceAhorros)
  {

    require "../conf/conn_mysql.php";

    if (
      !isset($data['amount']) || !isset($data['currency']) ||
      !isset($data['name'])
    ) {
      return [
        'exito' => false,
        'mensaje' => "Solicitud Erronea: ",
        'err' => "sys",
      ];

    }

    $name = $data['name'];
    $amount = $data['amount'];
    $crcy = $data['currency'];


    if (!is_string($name) || empty($name) || strlen($name) > 30) {
      return [
        'exito' => false,
        'mensaje' => "Nombre no valido",
        'err' => 'name'
      ];
    }

    if (empty($crcy) || ($crcy !== "ARS" && $crcy !== "USD") || strlen($crcy) > 3) {
      return [
        'exito' => false,
        'mensaje' => "Moneda no valida",
        'err' => 'crcy' 
      ];
    }

    if (!is_numeric($amount) || $amount < 0 || !is_float($amount * 1.0)) {
      return [
        'exito' => false,
        'mensaje' => "Monto no valido",
        'err' => 'amount'
      ];

    }

    //valido si se puede cumplir o no
    if($amount < $balanceAhorros[$crcy]){
      $stat = 1;
    }else{
      $stat = 0;
    }

    $query = 'INSERT INTO targets(name, amount, currency , status, id_user) VALUES(?,?,?,?,?)';

    $consulta = $conn->prepare($query);

    $consulta->bindParam(1, $name, PDO::PARAM_STR);
    $consulta->bindParam(2, $amount, PDO::PARAM_STR);
    $consulta->bindParam(3, $crcy, PDO::PARAM_STR);
    $consulta->bindParam(4, $stat, PDO::PARAM_INT);
    $consulta->bindParam(5, $idUser, PDO::PARAM_INT);


    try {
      if($consulta->execute()){
        return [
          'exito' => true,
          'mensaje' => "OK",
        ];

      }else{
        return [
          'exito' => false,
          'mensaje' => "error al escribir el objetivo",
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

  }

  public function delete($id, $idUser)
  {

    require "../conf/conn_mysql.php";

    $query = 'DELETE FROM targets WHERE id = ?';

    $consulta = $conn->prepare($query);

    $consulta->bindParam(1, $id, PDO::PARAM_INT);


    try {
      $consulta->execute();
      return true;
    } catch (Exception $e) {
      return false;
    }

  }

  public function refreshTargetStatus ($balanceAhorros, $idUser){
    require "../conf/conn_mysql.php";

    $data = $this->readAll($idUser);

    if($data['exito']){
      
      foreach($data['data'] as $target){
        $ahorro = round($balanceAhorros[$target['currency']]);
        $monto = round($target['amount']);
        $status = $target['status'];
        
        if( $ahorro >= $monto){
          if($status == 0){
            $status = 1;
            $consulta = $conn->prepare('UPDATE targets SET
                                        status = ? WHERE id = ?');
            $consulta->bindParam(1, $status, PDO::PARAM_INT);
            $consulta->bindParam(2, $target['id'], PDO::PARAM_INT);

            $consulta->execute();
          }
        
        }else{
          if($status == 1){
            $status = 0;
            $consulta = $conn->prepare('UPDATE targets SET
                                        status = ? WHERE id = ?');
            $consulta->bindParam(1, $status, PDO::PARAM_INT);
            $consulta->bindParam(2, $target['id'], PDO::PARAM_INT);
            $consulta->execute();
          }
        }

      }
    return true;

    }else{
      return false;
    }



  }




}



?>