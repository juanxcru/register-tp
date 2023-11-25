
const begin = () => {
    document.getElementById('btn-login').addEventListener('click', checkLogin);
}

const checkLogin = async (event) => {
    event.preventDefault();
   
    
    
    let obj = {
        email : document.getElementById('email').value,
        password : document.getElementById('password').value
    }

    let res = await fetch("http://localhost/TP-LAB-PROG/register-tp/controllers/login.php",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj)
        
      });

      if (!res.ok){
        console.log("error")
      }



}


window.onload = begin;