
const begin = () => {
    document.getElementById('btn-registrarse').addEventListener('click', checkRegister);
    let formulario = document.getElementById('formularioRegistro');
    formulario.addEventListener('submit', checkRegister);
}

const checkRegister = (event) => {
    //event.preventDefault();
    let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let email = document.getElementById('emailRegistro').value;
    let password = document.getElementById('passwordRegistro').value;
    (nombre && apellido && email && password) ? console.log(nombre, apellido, email) : console.log('Debe completar los campos')
    if(nombre && apellido && email && password){
        return true;
    }else{return false}
}

const sendForm = () => {
    if(checkRegister()){
        console.log('Se envio bien el formulario')
    }
}


window.onload = begin;