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
      if(isset($_GET['role'])){ 
        // quiere decir que estamos consultando permisos 
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
            $mensaje = "Usuario sin permiso" . " role " . $role . " role get " . $_GET['role'] . $_SESSION['user_id'];
            $respuesta = [
             "exito" => false,
             "mensaje" => $mensaje
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
      if( $_GET['type'] == 'account' && $_GET['id'] == 'all'){
        $data = $accController->readAll($_GET['iduser']);

        $jsonData = json_encode($data);
        header('Content-Type: application/json');
        echo $jsonData;
        break;

      }
      if($_GET['type'] == 'account'){
          $data = $accController->readOneById($_GET['id'],$_GET['iduser']);

          $jsonData = json_encode($data);
          header('Content-Type: application/json');
          echo $jsonData;
          break;
      }
      if($_GET['type'] == 'target' & $_GET['id'] == 'all'){
        $data = $targetController->readAll($_GET['iduser']);

        $jsonData = json_encode($data);
        header('Content-Type: application/json');
        echo $jsonData;
        break;
      }
      
      break;
    case 'POST':
      if($_GET['type'] == 'register'){


        $data = json_decode(file_get_contents('php://input'), true);
        
        echo $regController->save($data);
        break; 
      }

      if($_GET['type'] == 'target'){
        $data = json_decode(file_get_contents('php://input'), true);
        
        echo $targetController->saveTarget($data); 
        break;
      }
      


  }


  ?>
    
