<?php

class PermissionController{


    public static function getRoleIdByidUser($idUsuario)
    {
        require_once "../conf/conn_mysql.php";

        $sql = "
            SELECT 
                roles.role
            FROM 
                roles
            INNER JOIN
                roles_usuarios
                    ON
                        roles_usuarios.id_role = roles.id
            WHERE 
                roles_usuarios.id_user= :idUsuario;
        ";
    
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':idUsuario', $idUsuario);
    
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if(isset($result['role'])){
            return $result['role'];
        }else{
            return null;
        }
    }


    public function getPermisosPoIdRol($rol)
{
    
    require_once "../conf/conn_mysql.php";


    $sql = "
        SELECT 
            permisos.permiso
        FROM 
            permisos
        INNER JOIN
            roles_permisos
                ON
                    roles_permisos.id_permiso = permisos.id
        WHERE 
            roles_permisos.id_role = :idRol;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':idRol', $rol); 

    $stmt->execute();
    $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

    return $result;
}


}



?>