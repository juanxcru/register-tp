
const begin = () => {
    document.getElementById('btn-login').addEventListener('click', checkLogin);
}

const checkLogin = async (event) => {
    event.preventDefault();
   
    console.log('ASD')
    
    
    let obj = {
        email : document.getElementById('email').value,
        password : document.getElementById('password').value
    }


    let res = await fetch("http://localhost/TP-LAB-PROG/register-tp/services/login.php",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj)
        
      });

      let resjson = await res.json();

      console.log('rej',resjson)

      resjson.role == 'admin' ? location.assign("http://localhost/TP-LAB-PROG/register-tp/estadisticas.html") : location.assign("http://localhost/TP-LAB-PROG/register-tp/app.html")

      // if(resjson.exito){
      //   console.log(resjson.mensaje);
      //   location.assign("http://localhost/TP-LAB-PROG/register-tp/app.html")
      // }else{
      //   console.log(resjson.mensaje)
      // }



}


window.onload = begin;