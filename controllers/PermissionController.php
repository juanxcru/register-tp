<?php

class PermissionController{


    public function getRoleIdByidUser($idUsuario)
    {
        require "../conf/conn_mysql.php";

        $sql = "
            SELECT 
                roles.id
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

        if(isset($result['id'])){
            return $result['id'];
        }else{
            return null;
        }
    }


    public function getPermisosById($idUsuario)
{
    $idRol = $this->getRoleIdByidUser($idUsuario);
    
    require "../conf/conn_mysql.php";

    if($idRol != null){

        
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
        $stmt->bindValue(':idRol', $idRol); 
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $permisos = [];
        
        foreach ($result as $row) {
            $permisos[] = $row['permiso'];
        }
        
        return $permisos;
    }else{
        return null;
    }

}


    public function tienePermiso($permiso, $idUsuario){

    $permisosUsuario = $this->getPermisosById($idUsuario); // Obtiene los permisos del usuario
    
    if ($permisosUsuario != null){ // si el us no existe devuelve null
        foreach ($permisosUsuario as $p) {
            if ($p === $permiso) {
                return true;
            }
        }
    }
        return false;
    
    }


    public function getRoleNameIdByidUser($idUsuario){

        require "../conf/conn_mysql.php";

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
    
    public function getRoleIdByRoleName($roleName){

        require "../conf/conn_mysql.php";
        
        $consulta = $conn->prepare("SELECT id FROM roles WHERE role = ?");
        $consulta->bindParam(1, $roleName, PDO::PARAM_STR);
        $consulta->execute();
        $user = $consulta->fetch(PDO::FETCH_ASSOC);
        if($user > 0){
            return $idRole;
        }else{
            return -1;
        }

    }

}



?>