const backendServer = "http://localhost/TP-LAB-PROG/register-tp";
const ARS_USD = 1000;
let modalEditFlag = false;
let modalEditAccFlag = false;
let idRegAux = 0;
let idAccAux = 0;

//obj modal target
let modalTarget = new bootstrap.Modal(document.getElementById("modalTarget"));
//obj modal reg
let modalReg = new bootstrap.Modal(document.getElementById("modal-add-reg"));
// obj modal-add-acc
let modalAcc = new bootstrap.Modal(document.getElementById("modal-add-acc"));

const begin = async () => {
  let aut = await checkPermission();

  if (aut === true) {
    document
      .getElementById("type")
      .addEventListener("change", handleAccountToFrom);

    document
      .getElementById("btn-save-acc-modal")
      .addEventListener("click", addAccount);
    document
      .getElementById("btn-close-modal")
      .addEventListener("click", closeModal);
    document
      .getElementById("btn-save-modal")
      .addEventListener("click", addRecord);

    document
      .getElementById("div-categoria")
      .addEventListener("click", selectCategory);

    document
      .getElementById("btn-show-objetive")
      .addEventListener("mouseover", handleShowObjetiveHover);
    document
      .getElementById("btn-show-objetive")
      .addEventListener("mouseleave", handleHideObjetiveHover);
    document
      .getElementById("objetivos")
      .addEventListener("mouseover", handleShowObjetiveHover);
    document
      .getElementById("objetivos")
      .addEventListener("mouseleave", handleHideObjetiveHover);
    //this
    document
      .getElementById("btn-show-objetive")
      .addEventListener("click", handleObjetiveModal);
    // document
    //   .getElementById("btn-show-record")
    //   .addEventListener("click", handleReminderModal);

    document
      .getElementById("btn-close-obj-modal")
      .addEventListener("click", handleCloseObjModal);
    document
      .getElementById("btn-save-obj-modal")
      .addEventListener("click", handleSaveObjModal);
    document
      .getElementById("table-reg")
      .addEventListener("click", editDeleteReg);

    document
      .getElementById("balance-scroll")
      .addEventListener("click", editDeleteAcc);

    document.getElementById("btn-p-new-acc").addEventListener("click", () => {
      let btnDeleteAccount = document.getElementById("btn-del-acc-modal");
      let accNameContainer = document.getElementById("acc-name");
      let accBalanceContainer = document.getElementById("acc-init-balance");

      document.getElementById("form-add-acc").reset();
      modalEditAccFlag = false;
      accNameContainer.disabled = false;
      accBalanceContainer.disabled = false;
      if (!btnDeleteAccount.classList.contains("d-none")) {
        btnDeleteAccount.classList.add("d-none");
      }  
    });

    document.getElementById("btn-new-reg").addEventListener("click", () => {
      modalEditFlag = false;
    });

    document.getElementById("btn-del-acc-modal").addEventListener("click", deleteAccount);

    //document.getElementById("objetivos").addEventListener("click", editDeleteTarget)

    await loadRegisters();
    await loadAccounts();
    // if (accountsLoaded) {
    await loadTargets();
    // }

    // if (targetsLoaded) {
    // document
    //   .getElementById("btn-target")
    //   .addEventListener("click", handleDeleteTarget);
    // }

    // if (regLoaded) {

    // }
  } else if (aut === "login") {
    location.assign(
      "http://localhost/TP-LAB-PROG/register-tp/registrarse.html"
    );
  } else if (aut === false) {
    location.assign("http://localhost/TP-LAB-PROG/register-tp/login.html");
  }
};

const checkPermission = async () => {
  let res = await fetch(
    backendServer + "/controllers/entryPoint.php?role=user"
  );

  let resjson = await res.json();

  if (resjson.mensaje == "login") {
    return "login";
  } else if (resjson.exito) {
    return true;
  } else {
    return false;
  }
};

const addAccount = async (event) => {
  event.preventDefault();

  let accName = document.getElementById("acc-name").value;
  let accDescr = document.getElementById("acc-descrip").value;
  let accBalance = document.getElementById("acc-init-balance").value;

  let accNameContainer = document.getElementById("acc-name");
  let accDescrContainer = document.getElementById("acc-descrip");
  let accBalanceContainer = document.getElementById("acc-init-balance");
  //valudar campos:
  // nombre: 12 ch
  // balance: numero
  // descr: 50

  let accNameFdbk = document.getElementById("accNameFeedback");
  let accDescrFdbk = document.getElementById("accDescrFeedback");
  let accBalanceFdbk = document.getElementById("accInitBalanceFeedback");

  if (accBalance.includes(",")) {
    accBalance = accBalance.split(",").join(".");
  }

  let isValidName = validateField(accName, 12);
  let isValidDescr = validateField(accDescr, 50);
  let isValidBalance = await validateAmount(accBalance); // anda porque el arg3 depende del arg2 en la fun.

  messageValidation(accNameContainer, accNameFdbk, isValidName);
  messageValidation(accDescrContainer, accDescrFdbk, isValidDescr);
  messageValidation(accBalanceContainer, accBalanceFdbk, isValidBalance);

  if (isValidBalance == true && isValidName == true && isValidDescr == true) {
    let obj = {
      name: accName,
      description: accDescr,
      balance: parseFloat(accBalance),
      currency: "", //
    };

    if (!modalEditAccFlag) {
      // es save
      obj.currency = "ARS";  //va hardcode porque no es userinput
      console.log(obj);
      let resjson = await save(obj, "account");
      if (resjson.exito) {
        objNuevo = await read("account", resjson.id);
        if (!objNuevo) {
          alert("Error en lectura de cuenta nueva");
        } else if (objNuevo.mensaje) {
          alert(objNuevo.mensaje);
        } else {
          insertAccount(objNuevo);
          document.getElementById("form-add-acc").reset();
          modalAcc.hide();
        }
      } else {
        resetFeedback();
        if (resjson.err == "name") {
          messageValidation(accNameContainer, accNameFdbk, resjson.mensaje);
        } else if (resjson.err == "descr") {
          messageValidation(accDescrContainer, accDescrFdbk, resjson.mensaje);
        } else if (resjson.err == "balance") {
          messageValidation(accBalanceContainer, accBalanceFdbk, resjson.mensaje);
        } else if (resjson.err == "sys") {
          alert("Error de sistema :" + resjson.mensaje);
        } else {
          alert("Error: " + resjson.mensaje);
        }
        console.error(resjson.mensaje);
      }

    } else { // es update
      obj.currency = (obj.name == "Ahorros USD") ? "USD" : "ARS";

      res = await update(obj, "account", idAccAux);

      if (res.exito) {
        resetFeedback();
        modalEditAccFlag = false;
        document.getElementById("form-add-acc").reset();
        modalAcc.hide();
        let pBotonBalance = document.querySelector(`[data-id='${idAccAux}']`);
        let valorPrevio = parseInt(pBotonBalance.innerText);
        console.log(valorPrevio);
        pBotonBalance.innerText = obj.balance; 
        //cuando refactorice los targets mejorara lo siguiente, por ahora queda asi:
        let pNameAcc = pBotonBalance.closest('.pill-div').querySelector('.pill-p-title')
        pNameAcc.innerText = obj.name;

        let balanceContainer = document.getElementById("balance");
        let balance = 0;
        if (balanceContainer.innerText != "0") {
          balance = parseInt(balanceContainer.innerHTML);
        }
        if (obj.currency.toUpperCase() == "USD") {
          balance = balance - valorPrevio * ARS_USD;
          balance = balance + obj.balance * ARS_USD;
        } else if (obj.currency.toUpperCase() == "ARS") {
          balance = balance - valorPrevio;
          balance += obj.balance;
        }
        balanceContainer.innerText = balance.toFixed(0);
        
        // por ahora actualizo todo con lo del front...
      } else {
        resetFeedback();
        if (res.err == "name") {
          messageValidation(accNameContainer, accNameFdbk, res.mensaje);
        } else if (res.err == "descr") {
          messageValidation(accDescrContainer, accDescrFdbk, res.mensaje);
        } else if (res.err == "balance") {
          messageValidation(accBalanceContainer, accBalanceFdbk, res.mensaje);
        } else if (res.err == "sys") {
          alert("Error de sistema :" + res.mensaje);
        } else {
          alert("Error: " + res.mensaje);
        }
        console.error(res.mensaje);
      }



    }
  }
};

const deleteAccount = async () => {

  let confDel = confirm("¿Estas segurx de eliminar la cuenta? Se eliminaran todos los regsitros asociados a ella.")
  if(confDel){

    let resjson = await del("account", idAccAux);

    if(resjson.exito){
      //remover la pill
      window.location.reload();
    }else{
      alert("Error: " + resjson.mensaje)
    }

  }




}


const del = async (type, id) => {

  let res = await fetch(`./controllers/entryPoint.php?type=${type}&id=${id}`,
    {
      method: "DELETE",
    });
  
    let resjson = await res.json();

    return resjson;
  



}

const loadBalance = (acc) => {
  let balanceScroll = document.getElementById("balance-scroll");

  let divPill = document.createElement("div");
  divPill.classList.add("pill-div", "col-2");

  let pTitle = document.createElement("p");
  pTitle.classList.add("pill-p-title");
  pTitle.append(acc.name);
  divPill.appendChild(pTitle);

  let divAccountBalance = document.createElement("div");
  divAccountBalance.classList.add(
    "account-balance-div",
    "text-white",
    "bg-dark"
  );

  let pBalance = document.createElement("p");
  pBalance.classList.add("account-balance-p", "text-center");
  pBalance.setAttribute("id", "acc-balance-p-" + acc.name.split(" ").join(""));
  pBalance.setAttribute("role", "button");
  // pBalance.setAttribute("data-bs-toggle", "modal");
  // pBalance.setAttribute("data-bs-target", "#modal-new-acc");
  pBalance.setAttribute("data-id", acc.id);
  pBalance.append(acc.balance.toFixed(0));

  divAccountBalance.appendChild(pBalance);
  divPill.appendChild(divAccountBalance);
  balanceScroll.appendChild(divPill);

  let balanceContainer = document.getElementById("balance");
  let balance = 0;
  if (balanceContainer.innerText != "0") {
    balance = parseInt(balanceContainer.innerHTML);
  }
  if (acc.currency.toUpperCase() == "USD") {
    balance = balance + acc.balance * ARS_USD;
  } else if (acc.currency.toUpperCase() == "ARS") {
    balance += acc.balance;
  }

  balanceContainer.innerText = balance.toFixed(0);
};

const editDeleteReg = async (event) => {
  const targetBtn = event.target;
  if (targetBtn.classList.contains("edit-btn")) {
    const regId = targetBtn.dataset.id;
    editReg(regId);
  } else if (targetBtn.classList.contains("delete-btn")) {
    const regId = targetBtn.dataset.id;
    deleteReg(regId);
  }
};

const editReg = async (id) => {
  let moveTypeContainer = document.getElementById("type");
  let accValueContainer = document.getElementById("account");
  let accToValueContainer = document.getElementById("account-to");
  let enteredAmountInput = document.getElementById("amount");

  const recordInfo = await read("register", id);
  if(recordInfo.exito){

    if (recordInfo.data.category != "") {
      let selectedCategory = document.getElementById(recordInfo.data.category);
      selectedCategory.classList.add("pressed");
      disableCategories();
    }
    
    moveTypeContainer.value = recordInfo.data.type;
    enteredAmountInput.value = recordInfo.data.amount;
    
    if (recordInfo.data.id_acc_to && recordInfo.data.id_acc_from) {
      // move
      for (let i = 0; i < accToValueContainer.options.length; i++) {
        if (accToValueContainer.options[i].value == recordInfo.data.id_acc_to) {
          accToValueContainer.options[i].selected = true;
          
          break;
        }
      }
      for (let i = 0; i < accValueContainer.options.length; i++) {
        if (accValueContainer.options[i].value == recordInfo.data.id_acc_from) {
          accValueContainer.options[i].selected = true;
          break;
        }
      }
    } else if (recordInfo.data.id_acc_to) {
      // income
      for (let i = 0; i < accValueContainer.options.length; i++) {
        if (accValueContainer.options[i].value == recordInfo.data.id_acc_to) {
          accValueContainer.options[i].selected = true;
          break;
        }
      }
    } else {
      // spent
      for (let i = 0; i < accValueContainer.options.length; i++) {
        if (accValueContainer.options[i].value == recordInfo.data.id_acc_from) {
          accValueContainer.options[i].selected = true;
          break;
        }
      }
    }
    handleAccountToFrom();
    
    modalReg.show();
    modalEditFlag = true;
    idRegAux = id;
  }else{
    alert("Error al leer el registro seleccionado: " + recordInfo.mensaje);
  }
  };

const editDeleteAcc = async (e) => {
  // el data-id solo lo tienen las pills dinamicas. otra manera de hacer lo de editDeleteReg
  if (e.target.hasAttribute("data-id")) {

    let idAcc = e.target.getAttribute("data-id");

    let accNameContainer = document.getElementById("acc-name");
    let accDescrContainer = document.getElementById("acc-descrip");
    let accBalanceContainer = document.getElementById("acc-init-balance");
    let btnDeleteAccount = document.getElementById("btn-del-acc-modal");
    
    
    let accActual = await read("account", idAcc);
    
    if(accActual.name == "Ahorros USD" || accActual.name == "Ahorros ARS"){
      accNameContainer.disabled = true;
      accBalanceContainer.disabled = true;
      if (!btnDeleteAccount.classList.contains("d-none")) {
        btnDeleteAccount.classList.add("d-none");
      }
    }else{
        accNameContainer.disabled = false;
        accBalanceContainer.disabled = false;
      if (btnDeleteAccount.classList.contains("d-none")) {
        accNameContainer.disabled = false;
        accBalanceContainer.disabled = false;
        btnDeleteAccount.classList.remove("d-none");
      }
    }
    
    accNameContainer.value = accActual.name;
    
    
    accDescrContainer.value = accActual.description;
    accBalanceContainer.value = accActual.balance;

    modalAcc.show();
    modalEditAccFlag = true;
    idAccAux = idAcc;


  }
}


const update = async (recordBuffer, type, id) => {
  let full =
    backendServer + "/controllers/entryPoint.php?type=" + type + "&id=" + id;
  let res = await fetch(full, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recordBuffer),
  });

  // modalEditFlag = modalEditFlag ? false : modalEditFlag;
  // modalEditAccFlag = modalEditAccFlag ? false : modalEditFlag;
  let resjson = await res.json();
  console.log(resjson)
  return resjson;
};

const deleteReg = async (id) => {
  let moveTypeContainer = document.getElementById("type");
  let accValueContainer = document.getElementById("account");
  let accToValueContainer = document.getElementById("account-to");
  let enteredAmountInput = document.getElementById("amount");

  let confDel = confirm("¿Estas segurx de eliminar el registro?.")
  if(confDel){
    let resjson = await del("register", id);

    if(resjson.exito){
      window.location.reload();
      //sacar de la tabla
    }else{
      alert("Error: " + resjson.mensaje)
    }
  
  }
};

const read = async (type, id) => {
  /*
  Esperamos         type    ='account'  -->  cuentas
                            ='reg'      -->  registers
                            ='target'   -->  objetivos
                            ='reminder' -->  recordatorios
  en request GET
                    id      = 'all'     -->  traer todos
                    id      = '1'       -->  traer id especificado

                    
  */

  const params = new URLSearchParams();
  params.append("type", type);
  params.append("id", id);
  const queryString = params.toString();

  const full =
    backendServer +
    "/controllers/entryPoint.php/" +
    (queryString ? `?${queryString}` : "");
  // backend/?type=tipo&id=all
  try {
    const response = await fetch(full);

    resjson = await response.json();

    return resjson;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
};

const save = async (obj, type) => {
  const full = backendServer + "/controllers/entryPoint.php?type=" + type;

  try {
    const response = await fetch(full, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    resjson = await response.json();

    return resjson;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const loadAccounts = async () => {
  const accountsBuffer = await read("account", "all");
  if (accountsBuffer != null) {
    if (!accountsBuffer.exito) {
      alert(accountsBuffer.mensaje);
    } else if (accountsBuffer.data.length != 0) {
      // la info leida viene en un array en campo data del json, si ta vacio mostramos que no hay nada.
      for (let acc of accountsBuffer.data) {
        // cargar el drop del modal
        // cargar las pills
        insertAccount(acc);
      }
    } else {
      alert("No hay cuentas para el usuario");
    }
  } else {
    alert("Error del sistema");
  }
};

const insertAccount = (acc) => {
  let accountContainer = document.getElementById("account");
  let accountToContainer = document.getElementById("account-to");

  //cargamos el drop del modal
  let opt = document.createElement("option");
  opt.value = acc.id; //alambre pero sirve: en el value dejamos el id de la cuenta.
  opt.appendChild(document.createTextNode(acc.name));
  accountToContainer.appendChild(opt.cloneNode(true));
  accountContainer.appendChild(opt);

  //se cargan las pills
  loadBalance(acc);
};

const editDeleteTarget = (e) =>{
 
}


const insertTarget = (target) => {
  let targetDiv = document.getElementById("objetivos");

  let rowDiv = document.createElement("div");
  rowDiv.classList.add("row");
  rowDiv.style.padding = "15px";
  rowDiv.style.borderTop = "1px solid white";
  rowDiv.style.borderBottom = "1px solid white";
  rowDiv.style.textAlign = "center";
  rowDiv.setAttribute(
    "id",
    `target-${targetsBuffer.data.indexOf(target)}`
  );
  rowDiv.setAttribute("key", target.id);

  let nameDiv = document.createElement("div");
  nameDiv.classList.add("col-md-4");

  let amountDiv = document.createElement("div");
  amountDiv.classList.add("col-md-4");

  let deleteDiv = document.createElement("div");
  deleteDiv.classList.add("col-md-4");

  let deleteButton = document.createElement("button");
  deleteButton.setAttribute("id", "btn-target");

  let deleteButtonIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  let path1 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  let path2 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  deleteButton.style.backgroundColor = "white";
  deleteButton.style.width = "40px";
  deleteButton.style.height = "40px";
  deleteButton.style.borderRadius = "50px";

  deleteButtonIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  deleteButtonIcon.setAttribute("width", "16");
  deleteButtonIcon.setAttribute("height", "16");
  deleteButtonIcon.setAttribute("fill", "currentColor");
  deleteButtonIcon.setAttribute("class", "bi bi-trash");
  deleteButtonIcon.setAttribute("viewBox", "0 0 16 16");

  path1.setAttribute(
    "d",
    "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
  );
  path2.setAttribute(
    "d",
    "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
  );

  deleteButtonIcon.appendChild(path1);
  deleteButtonIcon.appendChild(path2);

  deleteButton.appendChild(deleteButtonIcon);
  deleteDiv.appendChild(deleteButton);

  //ver si ahorros usd es más alto que algún target

  // revisar si refactorizar para que lo haga el be.

  let ahorrosUsdElement = document.getElementById(
    "acc-balance-p-AhorrosUSD"
  );
  let ahorrosUsdValue = ahorrosUsdElement.textContent;

  let tgName = document.createElement("p");
  tgName.appendChild(document.createTextNode(target.name));

  let tgAmount = document.createElement("p");
  tgAmount.appendChild(document.createTextNode(target.amount));

  if (target.amount > ahorrosUsdValue) {
    tgName.style.color = "green";
    tgAmount.style.color = "green";
  } else {
    tgName.style.color = "red";
    tgAmount.style.color = "red";
  }

  nameDiv.appendChild(tgName);
  amountDiv.appendChild(tgAmount);

  rowDiv.appendChild(nameDiv);
  rowDiv.appendChild(amountDiv);
  rowDiv.appendChild(deleteDiv);

  targetDiv.appendChild(rowDiv);
}

const loadTargets = async () => {
  try {
    const targetsBuffer = await read("target", "all");

    if (targetsBuffer != null) {
      if (!targetsBuffer.exito) {
        alert(targetsBuffer.mensaje);
      } else if (targetsBuffer.data.length != 0) {
        // si hay targets:
        for (let target of targetsBuffer.data) {
          // mete los targets
          let targetDiv = document.getElementById("objetivos");

          let rowDiv = document.createElement("div");
          rowDiv.classList.add("row");
          rowDiv.style.padding = "15px";
          rowDiv.style.borderTop = "1px solid white";
          rowDiv.style.borderBottom = "1px solid white";
          rowDiv.style.textAlign = "center";

          // rowDiv.setAttribute(
          //   "id",
          //   `target-${targetsBuffer.data.indexOf(target)}`
          // );
          // rowDiv.setAttribute("key", target.id);

          let nameDiv = document.createElement("div");
          nameDiv.classList.add("col-md-4");

          let amountDiv = document.createElement("div");
          amountDiv.classList.add("col-md-4");

          let deleteDiv = document.createElement("div");
          deleteDiv.classList.add("col-md-4");

          let deleteButton = document.createElement("button");
          deleteButton.setAttribute("id", "btn-target");

          let deleteButtonIcon = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );

          let path1 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          let path2 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );

          deleteButton.style.backgroundColor = "white";
          deleteButton.style.width = "40px";
          deleteButton.style.height = "40px";
          deleteButton.style.borderRadius = "50px";

          deleteButtonIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          deleteButtonIcon.setAttribute("width", "16");
          deleteButtonIcon.setAttribute("height", "16");
          deleteButtonIcon.setAttribute("fill", "currentColor");
          deleteButtonIcon.setAttribute("class", "bi bi-trash");
          deleteButtonIcon.setAttribute("viewBox", "0 0 16 16");

          path1.setAttribute(
            "d",
            "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
          );
          path2.setAttribute(
            "d",
            "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
          );

          deleteButtonIcon.appendChild(path1);
          deleteButtonIcon.appendChild(path2);

          deleteButton.appendChild(deleteButtonIcon);
          deleteDiv.appendChild(deleteButton);

          //ver si ahorros usd es más alto que algún target

          // revisar si refactorizar para que lo haga el be.

          let ahorrosUsdElement = document.getElementById(
            "acc-balance-p-AhorrosUSD"
          );
          let ahorrosUsdValue = ahorrosUsdElement.textContent;

          let tgName = document.createElement("p");
          tgName.appendChild(document.createTextNode(target.name));

          let tgAmount = document.createElement("p");
          tgAmount.appendChild(document.createTextNode(target.amount));

          if (target.status) {
            deleteButton.disabled = false;
            tgName.style.color = "green";
            tgAmount.style.color = "green";
          } else {
            deleteButton.disabled = true;
            tgName.style.color = "red";
            tgAmount.style.color = "red";
          }

          nameDiv.appendChild(tgName);
          amountDiv.appendChild(tgAmount);

          rowDiv.appendChild(nameDiv);
          rowDiv.appendChild(amountDiv);
          rowDiv.appendChild(deleteDiv);

          targetDiv.appendChild(rowDiv);
        }
        document
          .getElementById("btn-target")
          .addEventListener("click", handleDeleteTarget);
      } else {
        //si no hay targets
        alert("No hay targets para el usuario");
      }
    } else {
      alert("Error de sistema");
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const loadRegisters = async () => {
  try {
    const regsBuffer = await read("register", "all");

    if (!regsBuffer.exito) {
      alert(regsBuffer.mensaje);
    } else if (regsBuffer.data.length != 0) {
      // si hay registross
      for (let reg of regsBuffer.data) {
        await reloadTable(reg);
      }
      return true;
    } else {
      //si no hay
      alert("No hay registros para le usario");
    }
  } catch (error) {
    console.error(error);
  }
};

// const loadReminders = () => {

//   read("reminder", "all", "1").then((accountsBuffer) => {
//     //hay que traer el id usuario, lo dehjamos en la session?
//     for (let acc of accountsBuffer) {
//       //cargamos el drop del modal
//       let opt = document.createElement("option");
//       opt.value = acc.id; //alambre pero sirve: en el value dejamos el id de la cuenta.
//       opt.appendChild(document.createTextNode(acc.name));
//       accountToContainer.appendChild(opt.cloneNode(true));
//       accountContainer.appendChild(opt);
//     }
//     //se cargan las pills
//     loadBalance(accountsBuffer);
//   });
// };

//-----------------------------LOAD FIRST TIME---------------------

const handleAccountToFrom = () => {
  console.log("A");
  let accountToDiv = document.getElementById("account-to-div");
  let type = document.getElementById("type").value;

  if (type === "Move") {
    if (accountToDiv.classList.contains("d-none")) {
      accountToDiv.classList.remove("d-none");
    }
  } else {
    if (!accountToDiv.classList.contains("d-none")) {
      accountToDiv.classList.add("d-none");
    }
  }
};

const selectCategory = (event) => {
  let clickedElement;
  //Detecta de otra manera los clicks en svg / button. No lo toma como 1 solo --fixed

  if (event.target.classList.contains("cat")) {
    clickedElement = event.target;
    if (clickedElement.classList.contains("pressed")) {
      clickedElement.classList.remove("pressed");
      enableCategories();
    } else {
      clickedElement.classList.add("pressed");
      disableCategories();
    }
  }
};

const enableCategories = () => {
  let allCategoryButtons = document.querySelectorAll(".cat");
  allCategoryButtons.forEach(function (button) {
    let isCatPressed = button.classList;
    if (isCatPressed[isCatPressed.length - 1] == "pressed") {
      button.classList.remove("pressed");
    }
    button.disabled = false;
  });
};

const disableCategories = () => {
  let allCategoryButtons = document.querySelectorAll(".cat");
  allCategoryButtons.forEach(function (button) {
    let isCatPressed = button.classList;

    isCatPressed[isCatPressed.length - 1] == "pressed"
      ? null
      : (button.disabled = true);
  });
};

const addRecord = async (event) => {
  event.preventDefault();

  let moveTypeContainer = document.getElementById("type");
  let moveTypeFeedback = document.getElementById("typeFeedback");
  let enteredAmountInput = document.getElementById("amount");
  let enteredAmountFeedback = document.getElementById("amountFeedback");
  let accValueContainer = document.getElementById("account");
  let accFeedback = document.getElementById("accountFeedback");

  let accToValueContainer = document.getElementById("account-to");
  let accToFeedback = document.getElementById("accountToFeedback");

  let recordBuffer = {
    type: "",
    regDate: "",
    amount: 0,
    category: "",
    accFrom: "",
    accTo: "",
  };

  let fecha = new Date();
  let fechaSegundosIso = new Date(new Date(fecha).toISOString());
  // diferencia entre utc/iso y local. milis - (minOfset*60000)
  let milisLocal = new Date(
    fechaSegundosIso.getTime() - fecha.getTimezoneOffset() * 60000
  );
  let formateoMysql = milisLocal.toISOString().slice(0, 19).replace("T", " ");
  recordBuffer.regDate = formateoMysql;

  //sea save o update, le actualizo la fecha.

  let verif = await checkData(recordBuffer);

  if (verif == true) {
    if (!modalEditFlag) {
      let res = await save(recordBuffer, "register");
      if (res.exito) {
        let objNuevo = await read("register", res.id);
        if (!objNuevo.exito) {
          alert("Error en lectura de registro nuevo");
        } else if (objNuevo.err) {
          alert(objNuevo.mensaje);
        } else {
          console.log("Se grabo");
          await reloadTable(objNuevo.data);
          enableCategories();
          resetFeedback();
          await refreshMoveBalance(
            recordBuffer.accTo,
            recordBuffer.accFrom,
            recordBuffer.amount
          );
          document.getElementById("form-add-reg").reset();
          modalReg.hide();
          //va esto porque no actualizamos dinamicamente el estado de los target
          if(res.target){
            window.location.reload();
          }
        }
      } else {

        resetFeedback();
        if (res.err == 'type') {
          messageValidation(moveTypeContainer, moveTypeFeedback, res.mensaje);
        } else if (res.err == 'accFrom') {
          if (recordBuffer.type == 'Spent' || recordBuffer.type == 'Move') {
            messageValidation(accValueContainer, accFeedback, res.mensaje);
          } else {
            //si es un income y la cuenta from da error es pq hay algo mal
            alert("Error de sistema al intepretar la cuenta del registro")
          }
        } else if (res.err == "accTo") {
          if (recordBuffer.type == 'Income' || recordBuffer.type == 'Move') {
            messageValidation(accToValueContainer, accToFeedback, res.mensaje);
          } else {
            alert("Error de sistema al intepretar la cuenta del registro")
          }
        } else if (res.err == "amount") {
          messageValidation(enteredAmountInput, enteredAmountFeedback, res.mensaje);
        } else if (res.err == "sys") {
          alert("Error de sistema : " + res.mensaje)
        } else {
          alert("Error: " + res.mensaje);
        }
        console.error(res.mensaje);
       
      }
    } else {
      // es update
      let res = await update(recordBuffer, "register", idRegAux);
      if (res.exito) {
        modalReg.hide();
        modalEditFlag = false;
        //actualizar la fila (tengo idRegAux y la data en el buffer)
        window.location.reload(true);
      } else {
        resetFeedback();
        if (res.err == 'type') {
          messageValidation(moveTypeContainer, moveTypeFeedback, res.mensaje);
        } else if (res.err == 'accFrom') {
          if (recordBuffer.type == 'Spent' || recordBuffer.type == 'Move') {
            messageValidation(accValueContainer, accFeedback, res.mensaje);
          } else {
            //si es un income y la cuenta from da error es pq hay algo mal
            alert("Error de sistema al intepretar la cuenta del registro")
          }
        } else if (res.err == "accTo") {
          if (recordBuffer.type == 'Income' || recordBuffer.type == 'Move') {
            messageValidation(accToValueContainer, accToFeedback, res.mensaje);
          } else {
            alert("Error de sistema al intepretar la cuenta del registro")
          }
        } else if (res.err == "amount") {
          messageValidation(enteredAmountInput, enteredAmountFeedback, res.mensaje);
        } else if (res.err == "sys") {
          alert("Error de sistema : " + res.mensaje)
        } else {
          alert("Error: " + res.mensaje);
        }
        console.error(res.mensaje);

      }
    }
  } else {
    console.error("Verifacion fallo");
  }
};

const checkData = async (recordBuffer) => {
  let selectedCategory = document.querySelector(".pressed");

  let moveTypeContainer = document.getElementById("type");
  let moveTypeFeedback = document.getElementById("typeFeedback");
  let enteredAmountInput = document.getElementById("amount");
  let enteredAmountFeedback = document.getElementById("amountFeedback");
  let accValueContainer = document.getElementById("account");
  let accFeedback = document.getElementById("accountFeedback");

  let accToValueContainer = document.getElementById("account-to");
  let accToFeedback = document.getElementById("accountToFeedback");

  let moveType = moveTypeContainer.value;
  let enteredAmount = enteredAmountInput.value;
  let accValue = accValueContainer.value;
  let accToValue = accToValueContainer.value;

  let accToText =
    accToValueContainer.options[accToValueContainer.selectedIndex].text;
  let accText = accValueContainer.options[accValueContainer.selectedIndex].text;

  let isValidType = validateField(moveType);
  messageValidation(moveTypeContainer, moveTypeFeedback, isValidType);

  let isValidAccount;

  isValidAccount = await validateAccount(accValue);
  messageValidation(accValueContainer, accFeedback, isValidAccount);
  if (moveType === "Move") {
    isValidAccount = await validateAccount(accToValue);
    if (isValidAccount === true) {
      isValidAccount = await validateMove(accValue, accToValue);
    }
    messageValidation(accToValueContainer, accToFeedback, isValidAccount);
  }
  // si tiene una , le pongo un punto:
  if (enteredAmount.includes(",")) {
    enteredAmount = enteredAmount.split(",").join(".");
  }
  let isValidAmount = await validateAmount(enteredAmount, accValue, moveType);

  messageValidation(enteredAmountInput, enteredAmountFeedback, isValidAmount);

  if (
    isValidAccount === true &&
    isValidType === true &&
    isValidAmount === true
  ) {
    recordBuffer.type = moveType;
    recordBuffer.amount = parseFloat(enteredAmount);
    if (moveType === "Income") {
      recordBuffer.accFrom = null;
      recordBuffer.accTo = accValue;
    } else if (moveType === "Spent") {
      recordBuffer.accFrom = accValue;
      recordBuffer.accTo = null;
    } else if (moveType === "Move") {
      recordBuffer.accFrom = accValue;
      recordBuffer.accTo = accToValue;
    }
    if (selectedCategory) {
      recordBuffer.category = selectedCategory.id;
    }
    return true;
  } else {
    return false;
  }
};

// const messageValidation = (container, containerFeedback, isValid) => {
//   if (isValid === true) {
//     if (container.classList.contains("is-invalid")) {
//       container.classList.remove("is-invalid");
//     }
//     container.classList.add("is-valid");
//   } else {
//     if (container.classList.contains("is-valid")) {
//       container.classList.remove("is-valid");
//     }
//     container.classList.add("is-invalid");
//     containerFeedback.innerHTML = isValid;
//   }
// };

// const validateField = (field, long) => {
//   if (field == "") {
//     return "Tiene que completar este campo";
//   }else if (long){
//     if( field.length > long){
//       return `Debe tener como maximo ${long} caracteres`;
//     }
//   }

//   return true;
// };

const validateAmount = async (amt, account, type) => {
  let amtInt = parseFloat(amt);
  let moveFlag = type === "Spent" || type === "Move" ? true : false;

  if (isNaN(amtInt)) {
    return "Monto no valido";
  } else if (amtInt < 0) {
    return "Monto debe ser positivo";
  } else if (amtInt === 0) {
    return "El monto no debe ser cero";
  }

  if (moveFlag) {
    accTo = await read("account", account);
    if (!accTo) {
      return "Error en verificacion de cuenta";
    } else if (accTo.mensaje) {
      return objNuevo.mensaje;
    } else {
      if (parseFloat(accTo.balance) < amtInt) {
        return "Sin fondos";
      } else {
        return true;
      }
    }
  }

  return true;
};

const validateAccount = async (accValue) => {
  let res = await read("account", accValue);
  if (!res) {
    return "Error en verificacion de cuenta";
  } else if (res.mensaje) {
    return res.mensaje;
  } else {
    return true;
  }
};

const validateMove = async (accValue, accToValue) => {
  if (accValue === accToValue) return "Cuenta to igual a cuenta from";

  acc = await read("account", accValue);
  accTo = await read("account", accToValue);
  if (!acc || !accTo) {
    return "Error en la verificacion de cuentas";
  } else if (accTo.mensaje) {
    return accTo.mensaje;
  } else if (acc.mensaje) {
    return acc.mensaje;
  } else {
    if (acc.currency != accTo.currency) {
      return "Diferentes monedas";
    } else {
      return true;
    }
  }
};

const refreshMoveBalance = async (accTo, accFrom, amount) => {
  let balanceContainer = document.getElementById("balance");
  let balance = parseFloat(balanceContainer.innerHTML);
  amount = parseFloat(amount);
  if (accTo != null) {
    let accToBuffer = await read("account", accTo);

    if (!accToBuffer) {
      alert("Error en lectura de cuenta nueva");
    } else if (accToBuffer.mensaje) {
      alert(accToBuffer.mensaje);
    } else {
      let pAccountBalance = document.getElementById(
        "acc-balance-p-" + accToBuffer.name.split(" ").join("")
      );
      pAccountBalance.innerText = accToBuffer.balance.toFixed(0);

      if (accToBuffer.currency.toUpperCase() == "ARS") {
        balance = balance + amount;
      } else if (accToBuffer.currency.toUpperCase() == "USD") {
        balance = balance + amount * ARS_USD;
      }

      balanceContainer.innerText = balance.toFixed(0);
    }
  }

  if (accFrom != null) {
    let accFromBuffer = await read("account", accFrom);
    if (!accFromBuffer) {
      alert("Error en lectura de cuenta nueva");
    } else if (accFromBuffer.mensaje) {
      alert(accFromBuffer.mensaje);
    } else {
      let pAccountBalance = document.getElementById(
        "acc-balance-p-" + accFromBuffer.name.split(" ").join("")
      );

      pAccountBalance.innerText = accFromBuffer.balance.toFixed(0);

      if (accFromBuffer.currency == "ARS") {
        balance = balance - amount;
      } else if (accFromBuffer.currency == "USD") {
        balance = balance - amount * ARS_USD;
      }

      balanceContainer.innerText = balance.toFixed(0);
    }
  }
};

const reloadTable = async (recordBuffer) => {
  const table = document.querySelector("table");
  let row = document.createElement("tr");

  row.innerHTML = `
    <th>${table.rows.length}</th>
    <td>${recordBuffer.reg_date}</td>
    <td>${recordBuffer.type}</td>
    <td>${recordBuffer.amount}</td>
    <td>${recordBuffer.name_acc_to ? recordBuffer.name_acc_to : "N/A"}</td>
    <td>${recordBuffer.name_acc_from ? recordBuffer.name_acc_from : "N/A"}</td>
    <td>${recordBuffer.category}</td>
    <td><button class="btn btn-dark text-white edit-btn" data-id="${recordBuffer.id
    }" > Edit
    </button>
    <button class="btn btn-danger text-white delete-btn" data-id="${recordBuffer.id
    }" > Delete
    </button></td>`;

  table.querySelector("tbody").append(row);
};

const closeModal = () => {
  // console.log('cerrar modal')
  //document.getElementById("monto").value = "";
  let accountToDiv = document.getElementById("account-to-div");

  document.getElementById("form-add-reg").reset();

  if (!accountToDiv.classList.contains("d-none")) {
    accountToDiv.classList.add("d-none");
  }
  resetFeedback();
  enableCategories();
};

//-----------OBJ FUNC--------------------------------

const handleShowObjetiveHover = () => {
  let recordElement = document.getElementById("objetivos");
  recordElement.classList.remove("d-none");
};

const handleHideObjetiveHover = () => {
  let recordElement = document.getElementById("objetivos");
  recordElement.classList.add("d-none");
};

const handleObjetiveModal = () => {
  handleObjModalOpen();
};

const handleObjModalOpen = () => {
  modalTarget.show();
  return;
};

const handleCloseObjModal = () => {
  modalTarget.hide();
  console.log("Modal cerrado");
};

const handleSaveObjModal = async (event) => {
  event.preventDefault();
  //Hacer validacion de campos vacios

  let nombreObjetivo = document.getElementById("nombre-objetivo");
  let montoObjetivo = document.getElementById("monto-objetivo");
  let currencyObjetivo = document.getElementById("currency-objetivo");
  let currencyObjetivoValue = currencyObjetivo.value;
  let nombreObjetivoValue = nombreObjetivo.value;
  let montoObjetivoValue = montoObjetivo.value;

  
  if (montoObjetivoValue.includes(",")) {
    montoObjetivoValue = montoObjetivoValue.split(",").join(".");
  }
  let isValidName = validateField(nombreObjetivoValue, 30);
  let isValidCurrency = validateField(currencyObjetivoValue, 3);
  if(isValidCurrency == true){
    if(currencyObjetivoValue == "USD" || currencyObjetivoValue == "ARS"){
      isValidCurrency = true
    }else{
      isValidCurrency = "Moneda invalida"
    }
  }
  let isValidAmount = await validateAmount(montoObjetivoValue); 

  messageValidation(nombreObjetivo,nombreObjetivoFeedback, isValidName)
  messageValidation(currencyObjetivo,currencyObjetivoFeedback, isValidCurrency)
  messageValidation(montoObjetivo,montoObjetivoFeedback, isValidAmount)

  if (isValidName == true && isValidAmount == true && isValidCurrency == true){

    let obj = {
      name: nombreObjetivoValue,
      amount: montoObjetivoValue,
      currency : currencyObjetivoValue,
    };

    let res = await save(obj,"target");

    if (res.exito){
      //agregar a la lista
      modalTarget.hide();
      window.location.reload();
    }else{
      if(res.err == "name"){
        messageValidation(nombreObjetivo,nombreObjetivoFeedback, res.mensaje)
      }else if ( res.err == "crcy"){
        messageValidation(currencyObjetivo,currencyObjetivoFeedback, res.mensaje)
      }else if (res.err == "amount") {
        messageValidation(montoObjetivo,montoObjetivoFeedback, isValidAmount)
      }else if(res.error == "sys"){
        alert("Error de sistema: " + res.mensaje)
      }else{
        alert("Error: " + res.mensaje)
      }
      console.error(res.mensaje)

    }
    
  }


};

const handleDeleteTarget = async (event) => {
  event.preventDefault();
  //Hacer validacion de campos vacios
  let elementToDelete = event.target;
  let deleteTarget = elementToDelete.parentNode.parentNode;
  let keyToDelete = deleteTarget.getAttribute("key");

  



};

//-------------------------------------------

// const handleReminderModal = () => {
//   handleReminderModalOpen();
//   return;
// };

// const handleReminderModalOpen = () => {
//   let reminderModal = new bootstrap.Modal(
//     document.getElementById("reminderModal")
//   );
//   reminderModal.show();
//   return;
// };

// const handleCloseRecordatorioModal = () => {
//   console.log("test 3");
// };

// const handleSaveRecordatorioModal = () => {
//   console.log("test 4");
// };

// const resetFeedback = () => {
//   let valid = document.getElementsByClassName("is-valid");
//   let invalid = document.getElementsByClassName("is-invalid");

//   while (valid.length > 0) {
//     valid[0].classList.remove("is-valid");
//   }

//   while (invalid.length > 0) {
//     invalid[0].classList.remove("is-invalid");
//   }
// };

window.onload = begin;
