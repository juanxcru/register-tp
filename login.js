


const begin = () => {
    document.getElementById('btn-login').addEventListener('click', checkLogin);
}

const checkLogin = async (event) => {
    event.preventDefault();
   
    let emailContainer = document.getElementById("email");
    let passwordContainer = document.getElementById("password");

    let emailFdbk = document.getElementById("emailFeedback");
    let passwordFdbk = document.getElementById("passwordFeedback");

    let obj = {
        email : document.getElementById('email').value,
        password : document.getElementById('password').value
    }


    let isValidEmail = validateEmail(obj.email);
    let isValidPassword = validatePassword(obj.password);

    messageValidation(emailContainer, emailFdbk, isValidEmail);
    messageValidation(passwordContainer,passwordFdbk, isValidPassword);

    // encriptar en el viaje la pwd?
    if( isValidEmail === true && isValidPassword === true){
      let res = await fetch("./services/login.php",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj)
          
        });

        let resjson = await res.json();

      if(resjson.exito){
        resetFeedback();
        console.log(resjson.mensaje);
        if(resjson.role == 'admin'){
          //location.assign("./admin.html")
        }else if(resjson.role == 'user'){
          location.assign("./app.html")
        } alert("ERROR")// si el role no es uno de estos, se tuvo que haber ido antes por el resjson.exito = false.
       }else{
        resetFeedback();
        if (resjson.err == 'password'){
          messageValidation(passwordContainer, passwordFdbk, resjson.mensaje);
        }else if(resjson.err == 'email'){
          messageValidation(emailContainer, emailFdbk, resjson.mensaje);
        }else{
          alert("Error: " + resjson.mensaje)
        }
        console.error("Error: ", resjson.mensaje);
       
       }

    }
      



}


window.onload = begin;