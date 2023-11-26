<?php
session_start();
$_SESSION = [];
session_destroy();
header("Location: http://localhost/TP-LAB-PROG/register-tp/index.html");
exit();
?>