const begin = async () => {
    let usersData = await read();
    reloadTable2(usersData);
    document.getElementById('table-reg').addEventListener('click',deleditReg)
    document.getElementById('crearReg').addEventListener('click',crearReg)
};


const deleditReg = async (event) => {

    const targetBtn = event.target;
    if (targetBtn.classList.contains('crear-btn')) {
      const regId = targetBtn.dataset.id;
    //   crearReg(regId)
    } else if (targetBtn.classList.contains('delete-btn')) {
      const regId = targetBtn.dataset.id;
      deleteReg(regId)
    }
     
  };

const saveUser = async () => {
    console.log('SAVED')

    let inputIdValue = document.getElementById('input-id').value
    let inputNameValue = document.getElementById('input-name').value
    let inputLastNameValue = document.getElementById('input-lastname').value
    let inputEmailValue = document.getElementById('input-mail').value

    let obj = {
        id: inputIdValue,
        name : inputNameValue,
        lastname : inputLastNameValue,
        email : inputEmailValue,
        password : 'password',
    }

        let res = await fetch("http://localhost/TP-LAB-PROG/register-tp/services/registrarse.php",{
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(obj)
      });

      let resjson = await res.json();

      if(resjson.exito){
        // location.assign("http://localhost/TP-LAB-PROG/register-tp/login.html");
        window.location.reload(true)
      }else{
        //invalids feedback
        console.log(resjson.mensaje)
      }
}

const crearReg = (id) => {
    const table = document.querySelector("table");
    const tbody = table.querySelector("tbody");


        let row = document.createElement("tr");
        row.innerHTML = `
            <th><input id="input-id"/></th>
            <td><input id="input-name"/></td>
            <td><input id="input-lastname"/></td>
            <td><input id="input-mail"/></td>
            <td>
                
                <button class="btn btn-danger text-white aceptar-btn" id="btn-aceptar">Aceptar</button>
            </td>`;

        tbody.append(row);

    document.getElementById('btn-aceptar').addEventListener('click', saveUser);

}

const deleteReg = async (id) => {
  
    // const recordInfo = await read("register",id);
  
    // const url = `${backendServer}/controllers/entryPoint.php?type=register&id=${id}`;
    const url = `http://localhost/TP-LAB-PROG/register-tp/controllers/entryPoint.php/?type=users&id=${id}`;
  
    const response = await fetch(url,{
      method: "DELETE",
    });
    console.log('res',response)
    if (response.ok) {
      console.log('Target deleted successfully');
     window.location.reload(true)
    } else {
      console.error('Failed to delete target:', response.status, response.statusText);
    }
  
  
  }
    
const read = async () => {
    const url = "http://localhost/TP-LAB-PROG/register-tp/controllers/entryPoint.php/?type=users&id=adm";

    const response = await fetch(url);

    if (response.status === 200) {
        let data = await response.json();
        return data;
    }
};

const reloadTable2 = async (usersBuffer) => {
    const table = document.querySelector("table");
    const tbody = table.querySelector("tbody");

    tbody.innerHTML = "";

    for (let user of usersBuffer) {
        let row = document.createElement("tr");
        row.innerHTML = `
            <th>${user.id}</th>
            <td>${user.name}</td>
            <td>${user.lastname}</td>
            <td>${user.email}</td>
            <td>
                
                <button class="btn btn-danger text-white delete-btn" data-id="${user.id}">Delete</button>
            </td>`;

        tbody.append(row);
    }

    // <button class="btn btn-dark text-white edit-btn" data-id="${user.id}">Edit</button>
};

window.onload = begin;
