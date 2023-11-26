<?php

  require_once 'AccountController.php';
  require_once 'RegController.php';
  require_once 'TargetController.php';
  require_once 'PermissionController.php';

  session_start();

  $regController = new RegController();
  $accController = new AccountController();
  $targetController = new TargetController();
  $permissionController = new PermissionController();
  
  $typeReq  = $_SERVER['REQUEST_METHOD'];

  
  switch ($typeReq){
    case 'GET':
      if(isset($_GET['role'])){ // quiere decir que estamos consultando permisos 
        
        // en donde quiera que este, consulto con el rol que debiera tener (los permisos son fijos x rol x usuario)
        
        //traigo el rol del usuario
        if(isset($_SESSION['user_id'])){

          //$permisos = $permissionController->getPermisosPorRol($role);
          //$permissionController->tieneTodosLosPermisos($permisos, $_SESSION['user_id']);
          //los permisos  son fijos para los usuarios.(segun roles)
          // (todos los usuarios del mismo rol tienen los mismos permisos.)
          // entonces, si es de determinado rol, tiene determinados permisos.
          
          $role = $permissionController->getRoleIdByidUser($_SESSION['user_id']);
          
          if($_GET['role'] != $role){
            //header('Location: http://localhost/TP-LAB-PROG/register-tp/index.html');
             
            $respuesta = [
             "exito" => false,
             "mensaje" => "Usuario sin permiso"
            ];
    
            http_response_code(200);
    
            echo json_encode($respuesta);
            
          }else{

            $respuesta = [
              "exito" => true,
              "mensaje" => "Usuario con permiso"
            ];
    
            http_response_code(200);
            echo json_encode($respuesta);
            
          }
        }else{
          $respuesta = [
            "exito" => false,
            "mensaje" => "login"
           ];
   
           http_response_code(200);
   
           echo json_encode($respuesta);
        }

          break; 
      }
      if($_GET['type'] == 'account' && $_GET['id'] == 'all'){ // leer todas las cuentas
        
        if (isset($_SESSION['user_id'])){
        
          if($permissionController->tienePermiso('ver cuenta', $_SESSION['user_id'])){

            $data = $accController->readAll($_SESSION['user_id']);
            
            $jsonData = json_encode($data);
            header('Content-Type: application/json');
            http_response_code(200);
            echo $jsonData;
            break;
          }else{
            $respuesta = [
              "exito" => false,
              "mensaje" => "Unauthorized"
            ];
            http_response_code(401);
            echo json_encode($respuesta);
            break;
          }

        }else{
          $respuesta = [
            "exito" => false,
            "mensaje" => "Unlogged"
          ];
          http_response_code(403);
          echo json_encode($respuesta);
          break;
        }
      }
      if($_GET['type'] == 'account'){ // cuenta por id

        if (isset($_SESSION['user_id'])){
          if($permissionController->tienePermiso('ver cuenta', $_SESSION['user_id'])){
            
            $data = $accController->readOneById($_GET['id'],$_SESSION['user_id']);

            $jsonData = json_encode($data);
            header('Content-Type: application/json');
            echo $jsonData;
              
            break;
          }else{
            $respuesta = [
              "exito" => false,
              "mensaje" => "Unauthorized"
            ];
            http_response_code(401);
            echo json_encode($respuesta);
            break;
          }
      }else{
        $respuesta = [
          "exito" => false,
          "mensaje" => "Unlogged"
        ];
        http_response_code(403);
        echo json_encode($respuesta);
        break;
      }
      }
      if($_GET['type'] == 'target' & $_GET['id'] == 'all'){ // objetivos todos
        if (isset($_SESSION['user_id'])){
          if($permissionController->tienePermiso('ver objetivo', $_SESSION['user_id'])){
            
            $data = $targetController->readAll($_SESSION['user_id']);

            $jsonData = json_encode($data);
            header('Content-Type: application/json');
            http_response_code(200);
            echo $jsonData;
            break;
          }else{
            $respuesta = [
              "exito" => false,
              "mensaje" => "Unauthorized"
            ];
            http_response_code(401);
            echo json_encode($respuesta);
            break;
          }
      }else{
        $respuesta = [
          "exito" => false,
          "mensaje" => "Unlogged"
        ];
        http_response_code(403);
        echo json_encode($respuesta);
        break;
      }







      }
      break;
    case 'POST':
      if($_GET['type'] == 'register'){
        if (isset($_SESSION['user_id'])){
          if($permissionController->tienePermiso('crear registro', $_SESSION['user_id'])) {
            
            $data = json_decode(file_get_contents('php://input'), true);
            http_response_code(200);
            echo $regController->save($data, $_SESSION['user_id'] );
            break; 
          }else{
            $respuesta = [
              "exito" => false,
              "mensaje" => "Unauthorized"
            ];
            http_response_code(401);
            echo json_encode($respuesta);
            break;
        }
      }else{
        $respuesta = [
          "exito" => false,
          "mensaje" => "Unlogged"
        ];
        http_response_code(403);
        echo json_encode($respuesta);
        break;
      }
    }

      if($_GET['type'] == 'target'){
        $data = json_decode(file_get_contents('php://input'), true);
        
        echo $targetController->saveTarget($data); 
        break;
      }
      


  }


  ?>
    
