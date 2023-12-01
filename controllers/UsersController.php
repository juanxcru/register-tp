<?php

class UsersController {


  public function readAllUsers(){

    
    require "../conf/conn_mysql.php";

    //ver relacion con user : cuentas de un usuario tabla accounts + id de user?
    $consulta = $conn->prepare("SELECT * FROM user");
    $consulta->execute();
  
    $data = $consulta->fetchAll(PDO::FETCH_ASSOC);

    return $data;

  }

    public function deleteUser($id, $idUser) {

      require "../conf/conn_mysql.php";
  
      $query = 'DELETE FROM user WHERE id = ?';
  
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