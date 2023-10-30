<?php

   // todo ok con el origen del liveserver 
  require_once 'AccountController.php';
  require_once 'RegController.php';

  header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
  $regController = new RegController();
  $accController = new AccountController();

  
  
  $typeReq  = $_SERVER['REQUEST_METHOD'];

  
  switch ($typeReq){
    case 'GET':
      if( $_GET['type'] == 'account' && $_GET['id'] == 'all'){
        $data = $accController->readAll($_GET['iduser']);

        $jsonData = json_encode($data);
        header('Content-Type: application/json');
        echo $jsonData;

      }
      break;
    case 'POST':
      if($type == 'register'){
        $data = json_decode(file_get_contents('php://input'), true);
        
        echo $regController->save($data);

        

      }


  }
    
