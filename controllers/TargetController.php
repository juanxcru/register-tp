<?php

class TargetController {


  public function readAll($id){

    
    require "../conf/conn_mysql.php";

    //ver relacion con user : cuentas de un usuario tabla accounts + id de user?
    $consulta = $conn->prepare("SELECT * FROM targets WHERE id_user = :id");
    $consulta->bindParam(':id', $id);
    $consulta->execute();
  
    $data = $consulta->fetchAll(PDO::FETCH_ASSOC);

    return $data;

  }

  public function saveTarget($data, $idUser) {

    require "../conf/conn_mysql.php";

      $query = 'INSERT INTO targets(name,amount,id_user) VALUES(?,?,?)';

      $consulta = $conn->prepare($query);

      $consulta->bindParam(1, $data['name'], PDO::PARAM_STR);
      $consulta->bindParam(2, $data['amount'], PDO::PARAM_STR);
      $consulta->bindParam(3, $idUser, PDO::PARAM_INT);
      // $consulta->bindParam(4, $data['currency'], PDO::PARAM_STR);


      try{
        $consulta->execute();
        return true;
      }catch(Exception $e){
        return false;
      }
      
    }

    public function deleteTarget($id, $idUser) {

      require "../conf/conn_mysql.php";
  
      $query = 'DELETE FROM targets WHERE id = ?';
  
        $consulta = $conn->prepare($query);
  
        $consulta->bindParam(1, $id, PDO::PARAM_INT);
  
  
        try{
          $consulta->execute();
          return true;
        }catch(Exception $e){
          return false;
        }
        
      }

}
      
        
 
?>