<?php
// CONEXIÓN A LA BASE DE DATOS

$servername = "localhost";
$username = "root";
$password = "";
$db = "register";

try {
    $conexion = new PDO(
        "mysql:host=$servername;dbname=" . $db . ";charset=utf8",
        $username,
        $password
    );
    // set the PDO error mode to exception
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo "Conectado correctamente";
} catch (PDOException $e) {
    echo "Conexión fallida: " . $e->getMessage();
    die(); //SI FALLA exit()
}

//REGISTRO LOS DATOS DE USUARIO
$nombreUsuario = $_POST['nombre'];
$apellidoUsuario = $_POST['apellido'];
$emailUsuario = $_POST['emailRegistro'];
$passwordUsuario = $_POST['passwordRegistro'];

//VALIDAR QUE EL EMAIL NO ESTÉ REGISTRADO YA


//INSERTO LOS DATOS EN LA BBDD
$query = "INSERT INTO user(name, lastname, email, password)
            VALUES('$nombreUsuario', '$apellidoUsuario', '$emailUsuario', '$passwordUsuario')";

$conexion->exec($query);
if ($conexion) {
    echo 'USUARIO CREADO!
    <script type="text/javascript"> 
        alert("Nuevo usuario creado exitosamente");
        window.location = "app.html";
    </script>';
};

//CIERRO LA CONEXIÓN CON LA BBDD
$conexion = null;
?>