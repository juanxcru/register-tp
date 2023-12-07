<?php

class UsersController {


  public function save($data){
    require "../conf/conn_mysql.php";

    if( !isset($data['name'])  || !isset($data['lastname']) || 
        !isset($data['email']) || !isset($data['password']) || !isset($data['role'])){
      return [
        'exito' => false,
        'mensaje' => "Solicitud Erronea" . $data,
        'err' => 'sys'
      ];
    }

  
    $name = $data['name'];
    $lastname = $data['lastname'];
    $email = $data['email']; 
    $role = $data['role'];
    
    if (!is_string($name) || empty($name) || strlen($name) > 30){
      return [
        'exito' => false,
        'mensaje' => "Nombre no valido",
        'err' => 'name'
      ];
    }
    
    if (!is_string($lastname) || empty($lastname) || strlen($lastname) > 30){
      return [
        'exito' => false,
        'mensaje' => "Apellido no valido",
        'err' => 'lastname'
      ];
    }
    if (!is_string($email) || empty($email) || strlen($email) > 255 ){
      return [
        'exito' => false,
        'mensaje' => "Email no valido",
        'err' => 'email'
      ];
    }
    
    if (!is_string($data['password']) || empty($data['password']) || strlen($data['password']) > 255 ){
      return [
        'exito' => false,
        'mensaje' => "Password no valida",
        'err' => 'password'
      ];
    }
    
    if (!is_string($role) || empty($role) || strlen($role) > 6 || ($role != 'admin' && $role != 'user') ){
      return [
        'exito' => false,
        'mensaje' => "role no valido",
        'err' => 'sys'
      ];
    }


    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    
    

    try {

      $consulta = $conn->prepare("SELECT id FROM user WHERE email = ?");
      $consulta->bindParam(1, $email, PDO::PARAM_STR);
      $consulta->execute();
      $user = $consulta->fetch(PDO::FETCH_ASSOC);
      if ($user) {
        return [
            "exito" => false,
            "mensaje" => "Email ya registrado",
            "err" => "email"
        ];
      }else{

        $consulta = $conn->prepare("INSERT INTO user (name, lastname, email, password) VALUES (?, ?, ?, ?)");
        $consulta->bindParam(1, $name, PDO::PARAM_STR);
        $consulta->bindParam(2, $lastname, PDO::PARAM_STR);
        $consulta->bindParam(3, $email, PDO::PARAM_STR);
        $consulta->bindParam(4, $password, PDO::PARAM_STR);

        // creamos el usuario
        $consulta->execute();

        //creamos el registro en latabla roles_usuarios
        // no a hardcodeamos id del rol, lo traemos de afuera a partir del nombre del rol

        $iduser = $conn->lastInsertId(); // id del ultimo insert (podria devolverlo en la query anteriro tamb)
        
        $consulta = $conn->prepare("INSERT INTO roles_usuarios (id_user, id_role) VALUES (? ,(SELECT id FROM roles WHERE role = ?))");
        $consulta->bindParam(1, $iduser, PDO::PARAM_INT);
        $consulta->bindParam(2, $role, PDO::PARAM_STR);
        $consulta->execute();

        return [
          "exito" => true,
          "id" => $iduser,
          "mensaje" => "Usuario creado"
        ];
        

      } 

      
    }catch(Exception $e){
      return [
        "exito" => false,
        "mensaje" => $e->getMessage(),
        "err" => "sys"
      ];
    }







  }


  public function readAllUsers(){

    
    require "../conf/conn_mysql.php";

    //ver relacion con user : cuentas de un usuario tabla accounts + id de user?
    $consulta = $conn->prepare("SELECT * FROM user");
    $consulta->execute();
  
    $data = $consulta->fetchAll(PDO::FETCH_ASSOC);

    return $data;

  }

    public function deleteUser($id) {

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