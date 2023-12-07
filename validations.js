const resetFeedback = () => {
    let valid = document.getElementsByClassName("is-valid");
    let invalid = document.getElementsByClassName("is-invalid");
  
    while (valid.length > 0) {
      valid[0].classList.remove("is-valid");
    }
  
    while (invalid.length > 0) {
      invalid[0].classList.remove("is-invalid");
    }
  };

  const messageValidation = (container, containerFeedback, isValid) => {
    if (isValid === true) {
      if (container.classList.contains("is-invalid")) {
        container.classList.remove("is-invalid");
      }
      container.classList.add("is-valid");
    } else {
      if (container.classList.contains("is-valid")) {
        container.classList.remove("is-valid");
      }
      container.classList.add("is-invalid");
      containerFeedback.innerHTML = isValid;
    }
  };


  const validateEmail = (email) => {
    let rgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // flag global x defecto?
    // 1 o mas no espacio ni el @, lo mismo despues del @ y del .
  
    if (rgx.test(email)) {
      let [primeraParte, dominio] = email.split('@');
      let [nombreDom, extension] = dominio.split('.');
      if (primeraParte.length <= 64 && nombreDom.length <= 255 && extension.length <= 63) {
        return true; 
      }
    }
  
    return "Direccion de email invalida"; 
  }
  
  const validatePassword = (pwd) => {
  
    let rgx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]+$/;
    // primer grupo - cualquiera caracter mayus
    // sgundo grupo - cualquer caracter minus
    // tercer grupo - cualquier caracter numero
    //todo debe contener mayus, minus numero
  
      if (pwd.length < 4 || pwd.length > 12) {
        return "La contraseña debe tener entre 4 y 12 caracteres.";
      }
      if (!rgx.test(pwd)) {
        return "La contraseña debe tener 1 mayus, 1 minus, 1 numero";
      }
    
      return true;
    
  }

  const validateField = (field, long) => {
    if (field == "") {
      return "Tiene que completar este campo";
    }else if (long){
      if( field.length > long){
        return `Debe tener como maximo ${long} caracteres`;
      }
    }
  
    return true;
  };

  const validateNombre = (nombre) => {
    let rgx = /[\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(nombre.length < 2 || nombre.length > 30 ){
        return "Debe tener entre 2 y 30 caracteres";
    }else if (rgx.test()) {
        return "No debe contener numeros ni simbolos"
    }else if(nombre.split(' ').length > 3){
        return "Solo se admiten dos espacios"
    }
    
    return true;


  };
