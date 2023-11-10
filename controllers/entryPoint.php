<?php

   // todo ok con el origen del liveserver 
  require_once 'AccountController.php';
  require_once 'RegController.php';
  require_once 'TargetController.php';

  $regController = new RegController();
  $accController = new AccountController();
  $targetController = new TargetController();
  
  
  $typeReq  = $_SERVER['REQUEST_METHOD'];

  
  switch ($typeReq){
    case 'GET':
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

      }
      break;
    case 'POST':
      if($_GET['type'] == 'register'){

        // print('post' . $_POST['type']);
        // echo 'get' . $_GET['type'];

        $data = json_decode(file_get_contents('php://input'), true);
        
        echo $regController->save($data);
        break; 
      }

      if($_GET['type'] == 'target'){
        $data = json_decode(file_get_contents('php://input'), true);
        
        echo $targetController->saveTarget($data); 
      }
      


  }

  ?>
    
