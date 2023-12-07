<?php

require_once "../controllers/AccountController.php";
require_once "../controllers/UsersController.php";
require_once "../controllers/PermissionController.php";

function saveAccountsAhorro($iduser, $accController){

    $accARS = [
        "name" => "Ahorros ARS",
        "description" => "Ahorro",
        "balance" => 0,
        "currency" => "ARS"
    ];
    $accUSD = [
        "name" => "Ahorros USD",
        "description" => "Ahorro",
        "balance" => 0,
        "currency" => "USD"
    ];

    $resAccArs = $accController->save($accARS, $iduser);
    $resAccUsd = $accController->save($accUSD, $iduser);

    if($resAccArs['exito'] && $resAccUsd['exito']){
        return [
            "exito" => true,
            "mensaje" => "Cuentas Ahorro creadas"
        ];
    }else if(!$resAccArs['exito']){
        return [
            "exito" => false,
            "mensaje" => "Cuenta Ahorro ARS no grabada : " . $resAccArs["mensaje"],
            "err" => $resAccArs["err"],
        ];
    }else{
        return [
            "exito" => false,
            "mensaje" => "Cuenta Ahorro USD no grabada : " . $resAccUsd["mensaje"],
            "err" => $resAccArs["err"],
        ];
    }


}

$accController = new AccountController();
$userController = new UsersController();
$permissionController = new PermissionController();

header("Content-Type: application/json");

session_start();


if ($_SERVER["REQUEST_METHOD"] == "POST") {
// ver permisos
    $objData = json_decode(file_get_contents('php://input'), true);
    if(isset($_SESSION['user_id'])){
        // es un usuario logueado
        if ($permissionController->tienePermiso('crear usuario', $_SESSION['user_id'])){
            //en relaidad solo los admin tienen permiso...
            // en objData ya tenemos el nombre del rol del usuario q se esta creando
            // si es admin o user. lo necesitamos para meterlo en la tabla roles_usuarios
            $resUser = $userController->save($objData);

            if($resUser['exito']){
                //creo el user ok. 
                //si es un usuario regular (no admin) tenemos que crear las cuentas.
                //podemos saber que tipode de user es preguntando el rol a partir del id generado
                //pero el front nos da el nombre del role, asi que pregunto por eso.
                if($objData['role'] == 'user'){

                    $resCuentasAhorro = saveAccountsAhorro($resUser['id'],$accController);
            
                    if($resCuentasAhorro['exito']){
                        $respuesta = [
                            "exito" => true,
                            "mensaje" => "Usuario y cuentas ahorro grabadas"
                        ];
                        http_response_code(200);
                        echo json_encode($respuesta);
                        exit();
                    }else{
                        //si dio error aca, quiere decir que se genero el user, pero no las cuentas.
                        //borramos el usuario para no tener usuarios sin cuentas ahorros.
                        if($userController->deleteUser($resUser['id'])){

                            $respuesta =[
                                "exito" => false,
                                "mensaje" => "Usuario no creado por: " . $resCuentasAhorro['mensaje'],
                                "err" => "sys"
                            ];
                            http_response_code(500);
                            echo json_encode($respuesta);
                            exit();

                        }else{
                        //si da false es porque no pudo borrar
                            $respuesta =[
                                "exito" => false,
                                "mensaje" => "Error de sistema",
                                "err" => "sys"
                            ];
                            http_response_code(500);
                            echo json_encode($respuesta);
                            exit();
                        }

                    }

                }else if($objData['role'] == 'admin' ){
                    //no necesitamos nada mas para el admin.
                    http_response_code(200);
                    echo json_encode($resUser);
                    exit();
                }// si vino un valor raro del role desde el frontend, se valido ya en el save.
            }else{
                // el save no pudo hacerse:
                http_response_code(400);
                echo json_encode($resUser);
                exit();
            }

        }else{
            $respuesta = [
                "exito" => false,
                "mensaje" => "Unauthorized"
              ];
              http_response_code(401);
              echo json_encode($respuesta);
              exit();
        }
    }else{
        //Si no esta logueado, es porque es un usuario sin registrar
        //aca adentro se valida si existe el user q se quiere crear y mas validaciones
        if ($objData['role'] == 'user'){

            $resUser = $userController->save($objData);
            
            if($resUser['exito']){
                // como es un usuario, agregamos las cuentas
                
                $resCuentasAhorro = saveAccountsAhorro($resUser['id'],$accController);
                
                if($resCuentasAhorro['exito']){
                    $respuesta = [
                        "exito" => true,
                        "mensaje" => "Usuario y cuentas ahorro grabadas"
                    ];
                    http_response_code(200);
                    echo json_encode($respuesta);
                    exit();
                }else{
                    //si dio error aca, quiere decir que se genero el user, pero no las cuentas.
                    //borramos el usuario para no tener usuarios sin cuentas ahorros.
                    if($userController->deleteUser($resUser['id'])){
                        
                        $respuesta =[
                            "exito" => false,
                            "mensaje" => "Usuario no creado por: " . $resCuentasAhorro['mensaje'],
                            "err" => "sys"
                        ];
                        http_response_code(400);
                        echo json_encode($respuesta);
                        exit();
                        
                    }else{
                        //si da false es porque no pudo borrar
                        $respuesta =[
                            "exito" => false,
                            "mensaje" => "Error de sistema",
                            "err" => "sys"
                        ];
                        http_response_code(500);
                        echo json_encode($respuesta);
                        exit();
                    }
                    
                }
                
            }else{ 
                http_response_code(400);
                echo json_encode($resUser);
                exit();
            }
        }else{

            $respuesta = [
                "exito" => false,
                "mensaje" => "Unauthorized"
              ];
              http_response_code(401);
              echo json_encode($respuesta);
              exit();

        }    
    }
    }else{
    $respuesta = [
        "exito" => false,
        "mensaje" => "ERROR"
    ];
    http_response_code(400);
    echo json_encode($respuesta);
    exit();
}   



?>