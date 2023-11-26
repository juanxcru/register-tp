
const begin = () => {
    document.getElementById('btn-registrarse').addEventListener('click', sendForm);
    let formulario = document.getElementById('formularioRegistro');
}

const checkRegister = (nombre, apellido, email, password) => {
    
   
    return (nombre && apellido && email && password)
    //invalids feedback
    
}

const sendForm = async (event) => {
    event.preventDefault();
    let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let email = document.getElementById('emailRegistro').value;
    let password = document.getElementById('passwordRegistro').value;

    let obj = {
        name : nombre,
        lastname : apellido,
        email : email,
        password : password
    }

    if(checkRegister(nombre, apellido, email, password)){
        let res = await fetch("http://localhost/TP-LAB-PROG/register-tp/services/registrarse.php",{
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(obj)
      });

      let resjson = await res.json();

      if(resjson.exito){
        location.assign("http://localhost/TP-LAB-PROG/register-tp/login.html");
      }else{
        //invalids feedback
        console.log(resjson.mensaje)
      }

       
    }
}


window.onload = begin;