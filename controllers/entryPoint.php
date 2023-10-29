<?php

   // todo ok con el origen del liveserver 
  require_once 'AccountController.php';
  //require_once 'RegController.php';

  header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
  //$regBuff = new RegController();
  $accController = new AccountController();

  $type     = $_GET['type'];
  $idparam  = $_GET['id'];
  $typeReq  = $_SERVER['REQUEST_METHOD'];

  
  switch ($typeReq){
    case 'GET':
      if( $type == 'account' && $idparam == 'all'){
        $data = $accController->readAll();
        $jsonData = json_encode($data);

        header('Content-Type: application/json');
        echo $jsonData;

      }
  }
    
