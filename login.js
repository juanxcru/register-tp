
const begin = () => {
    document.getElementById('btn-login').addEventListener('click', checkLogin);
}

const checkLogin = (event) => {
    event.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    (email && password) ? window.location.assign("/register-tp/app.html") : console.log('Debe completar los campos')   
}


window.onload = begin;