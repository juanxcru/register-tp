
const begin = () => {
    document.getElementById('btn-registrarse').addEventListener('click', sendForm);
}



const sendForm = async (event) => {
    event.preventDefault();

    let nombreContainer = document.getElementById('nombre');
    let apellidoContainer = document.getElementById('apellido');
    let emailContainer = document.getElementById('emailRegistro');
    let passwordContainer = document.getElementById('passwordRegistro');

    let nombreFdbk = document.getElementById("nombreFeedback")
    let apellidoFdbk = document.getElementById("apellidoFeedback")
    let emailFdbk  = document.getElementById("emailFeedback")
    let passwordFdbk = document.getElementById("passwordFeedback")

    let obj = {
        name : nombreContainer.value,
        lastname : apellidoContainer.value,
        email : emailContainer.value,
        password : passwordContainer.value,
        role: 'user'
    }


    let isValidEmail = validateEmail(obj.email);
    let isValidPassword = validatePassword(obj.password);
    let isValidNombre = validateNombre(obj.name);
    let isValidApellido = validateNombre(obj.lastname);

    messageValidation(emailContainer, emailFdbk, isValidEmail);
    messageValidation(passwordContainer, passwordFdbk, isValidPassword);
    messageValidation(nombreContainer, nombreFdbk, isValidNombre);
    messageValidation(apellidoContainer, apellidoFdbk, isValidApellido);


    if( isValidEmail === true && isValidPassword === true &&
        isValidApellido === true && isValidNombre === true){
        let res = await fetch("./services/registrarse.php",{
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
        resetFeedback();
        console.log(resjson)
        if(resjson.err == 'sys'){
          alert("Error de sistema: " + resjson.mensaje)
        }else if(resjson.err == 'name'){
          messageValidation(nombreContainer, nombreFdbk, resjson.mensaje);
        }else if(resjson.err == 'lastname'){
          messageValidation(apellidoContainer, apellidoFdbk, resjson.mensaje);
        }else if (resjson.err == 'password'){
          messageValidation(passwordContainer, passwordFdbk, resjson.mensaje);
        }else if(resjson.err == 'email'){
          messageValidation(emailContainer, emailFdbk, resjson.mensaje);
        }else{
          alert("Error: " + resjson.mensaje)
        }
        console.error(resjson.mensaje)
      }
    }

}


window.onload = begin;