let accountBuffer = [];

let record = [
  {
    type: "Income",
    date: "10-10-2023",
    amount: 100,
    category: "",
    accFrom: "",
    accTo: "Savings",
  },
  {
    type: "Income",
    date: "10-10-2023",
    amount: 200,
    category: "",
    accFrom: "",
    accTo: "Cheking",
  },
  {
    type: "Income",
    date: "10-10-2023",
    amount: 300,
    category: "",
    accFrom: "",
    accTo: "Ahorros USD",
  },
  {
    type: "Income",
    date: "10-10-2023",
    amount: 400,
    category: "",
    accFrom: "",
    accTo: "Ahorros ARS",
  },
];
const backendServer = "http://localhost/TP-LAB-PROG/register-tp";
const ARS_USD = 1000;

const begin = () => {
  testConn()
    .then((message) => {
      console.log("Conectado:", message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  loadAccounts(); // se cargan todas las cuentas en el modal de nuevo registro y en las pills con el balance
  // loadTargets();
  // loadReminders();


  document
    .getElementById("btn-close-modal")
    .addEventListener("click", closeModal);
  document
    .getElementById("btn-save-modal")
    .addEventListener("click", addRecord);
  document
    .getElementById("div-categoria")
    .addEventListener("click", selectCategory);

  // document
  //   .getElementById("btn-show-record")
  //   .addEventListener("mouseover", handleShowReminderHover);
  // document
  //   .getElementById("btn-show-record")
  //   .addEventListener("mouseleave", handleHideReminderHover);
  // document
  //   .getElementById("recordatorios")
  //   .addEventListener("mouseover", handleShowReminderHover);
  // document
  //   .getElementById("recordatorios")
  //   .addEventListener("mouseleave", handleHideReminderHover);

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

  // document
  //   .getElementById("btn-close-recordatorio-modal")
  //   .addEventListener("click", handleCloseRecordatorioModal);
  // document
  //   .getElementById("btn-save-recordatorio-modal")
  //   .addEventListener("click", handleSaveRecordatorioModal);
  document
    .getElementById("type")
    .addEventListener("change", handleAccountToFrom);

};

const testConn = async () => {
  try {
    const response = await fetch(backendServer + "/conf/conn_mysql.php");

    if (response.ok) {
      const message = await response.text();
      return message;
    } else {
      console.error("No conectado");
      throw new Error("Error de conexión");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const loadBalance = (accounts) => {
  let balanceScroll = document.getElementById("balance-scroll");

  for (acc of accounts) {
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
    //ojo aca: ID en html == acc.name
    pBalance.setAttribute("id", acc.name);
    pBalance.append(acc.balance);

    divAccountBalance.appendChild(pBalance);
    divPill.appendChild(divAccountBalance);
    balanceScroll.appendChild(divPill);
  }

  let balanceContainer = document.getElementById("balance");
  let balance = 0;
  for (let acc of accounts) {
    //hacerlo bien
    if (acc.currency == "USD") {
      balance = balance + acc.balance * ARS_USD;
    } else if (acc.currency == "ARS") {
      balance += acc.balance;
    }
    //hacerlo bien
  }

  balanceContainer.innerHTML = balance;
};

const read = async (type, id, iduser) => {
  /*
  Esperamos         type    ='account'  -->  cuentas
                            ='reg'      -->  registers
                            ='target'   -->  objetivos
                            ='reminder' -->  recordatorios
  en request GET
                    id      = 'all'     -->  traer todos
                    id      = '1'       -->  traer id especificado

                    iduser  = id del usuario (ver mejor manera)
  */

  const params = new URLSearchParams();
  params.append("type", type);
  params.append("id", id);
  params.append("iduser", iduser);
  const queryString = params.toString();

  const full =
    backendServer +
    "/controllers/entryPoint.php/" +
    (queryString ? `?${queryString}` : "");
  // backend/?type=tipo&id=all&iduser=21
  try {
    const response = await fetch(full);

    if (response.ok) {

      const data = await response.json();

      return data;
    } else {
      throw new Error("Error");
    }
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const save = async (obj) => {

   const full =
    backendServer +
    "/controllers/entryPoint.php?type=register";

    try {
      const response = await fetch(full, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj)
        
      });
        
      if (response.ok) {
        return true;
      } else {
        return false; //logear errores en archivo? demasiado
      }
    } catch (error) { 
      return false;
    }
 
};

//-----------------------------LOAD FIRST TIME---------------------

const loadAccounts = () => {
  let accountContainer = document.getElementById("account");
  let accountToContainer = document.getElementById("account-to");

  read("account", "all", "1").then((accountsBuffer) => {
    //hay que traer el id usuario, lo dehjamos en la session?
    for (let acc of accountsBuffer) {
      //cargamos el drop del modal
      let opt = document.createElement("option");
      opt.value = acc.id; //alambre pero sirve: en el value dejamos el id de la cuenta. 
      opt.appendChild(document.createTextNode(acc.name));
      accountToContainer.appendChild(opt.cloneNode(true));
      accountContainer.appendChild(opt);
    }
    //se cargan las pills
    loadBalance(accountsBuffer);
  });
};

// const loadTargets = () => {

//   read("target", "all", "1").then((accountsBuffer) => {
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


const handleAccountToFrom = (event) => {
  let accountToDiv = document.getElementById("account-to-div");

  let type = event.target.value;

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

const addRecord = (event) => {
  event.preventDefault();

  let recordBuffer = {
    id_user: 1, 
    type: "",
    regDate: "",
    amount: 0,
    category: "",
    accFrom: "", 
    accTo: "" 
  };

  checkData(event, recordBuffer).then( (res) => {
      if(res){
        save(recordBuffer).then((res) => {
          if(res){
            // refreshBalances(recordBuffer);
            // reloadTable(recordBuffer);
            console.log("Se grabo");
            enableCategories();
            resetFeedback();
            document.getElementById("form-add-reg").reset();
          }else{
            console.error("No se grabo");
          }
        });
      }});

  };  

const checkData = async (event, recordBuffer) => {
  let selectedCategory = document.querySelector(".pressed");
  let moveTypeContainer = document.getElementById("type");
  let moveTypeFeedback = document.getElementById("typeFeedback");
  // let isChecked = document.getElementById('checkCat').checked;
  let enteredAmountInput = document.getElementById("amount");
  let enteredAmountFeedback = document.getElementById("amountFeedback");
  //let balanceElement = document.getElementById("balance");
  let accValueContainer = document.getElementById("account");
  let accFeedback = document.getElementById("accountFeedback");

  let accToValueContainer = document.getElementById("account-to");
  let accToFeedback = document.getElementById("accountToFeedback");

  let moveType = moveTypeContainer.value;
  let enteredAmount = enteredAmountInput.value;
  let accValue = accValueContainer.value;
  let accToValue = accToValueContainer.value;

  let accToText = accToValueContainer.options[accToValueContainer.selectedIndex].text;
  let accText = accValueContainer.options[accValueContainer.selectedIndex].text;

  let iduser = 1;


  let isValidType = validateField(moveType);
  messageValidation(moveTypeContainer, moveTypeFeedback, isValidType);

  let isValidAccount;

  isValidAccount = await validateAccount(accValue,iduser);
  messageValidation(accValueContainer, accFeedback, isValidAccount);
  if (moveType === "Move") {
    isValidAccount = await validateAccount(accToValue, iduser);
    if (isValidAccount === true) {
      isValidAccount = await validateMove(accValue, accToValue,iduser);
    }
    messageValidation(accToValueContainer, accToFeedback, isValidAccount);
  }

  let isValidAmount = await validateAmount(enteredAmount, accValue, moveType, iduser);

  messageValidation(enteredAmountInput, enteredAmountFeedback, isValidAmount);

  if (
    isValidAccount === true &&
    isValidType === true &&
    isValidAmount === true
  ) {
    recordBuffer.type = moveType;
    recordBuffer.amount = enteredAmount;
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

const validateField = (field) => {
  if (field == "") {
    return "Tiene que elegir una opcion";
  }
  return true;
};

const validateAmount = async (amt, account, type, iduser) => {
  let amtInt = parseFloat(amt);
  let moveFlag = type === "Spent" || type === "Move" ? true : false;

  if (isNaN(amtInt)) {
    return "Monto no valido";
  } else if (amtInt < 0) {
    return "Monto debe ser positivo";
  } else if (amtInt === 0) {
    return "El monto no debe ser cero";
  }

  if(moveFlag){
    accTo = await read('account',account,iduser);
    if(accTo.length == 1){
      if(parseFloat(accTo[0].balance) < amtInt){
        return "Sin fondos"
      }
    }else{
      return "Error"
    }

  }

  return true;
  
};


const validateAccount = async (accValue,iduser) => {
  
  
  let res = await read('account', accValue, iduser);
    if(res.length == 1){
      return true;
    }else{
      return "Cuenta no existe";
    }



};

const validateMove = async (accValue, accToValue,iduser) => {
  if (accValue === accToValue) return "Cuenta to igual a cuenta from";

  acc = await read('account',accValue,iduser);
  accTo = await read('account',accToValue,iduser);
  if(acc.length == 1 && accTo.length == 1){
    if(acc[0].currency != accTo[0].currency){
      return "Diferentes monedas"
    }else{
        return true;
    }
  }
   
  return "Error"

};

// const realoadSavingAccount = (enteredAmount) => {
//   let savingAccountElement = document.getElementById("cajaDeAhorro");
//   let savingAccountValue = savingAccountElement.textContent;
//   let newValue = parseInt(savingAccountValue) + parseInt(enteredAmount);
//   savingAccountElement.innerText = newValue;
// };

const refreshBalances = (recordBuffer) => {
  //hacer desde check data para handlear que funcion usar
  //let cashElement = document.getElementById("cash-value");
  recordBuffer.amount = parseInt(recordBuffer.amount);
  let pAccountBalance;
  let balanceContainer = document.getElementById("balance");
  let balance = balanceContainer.innerText;
  balance = parseInt(balance);
  let acc;
  //solo sirve si el name de la cuenta es unico, despues manejar con ID o
  //teniendo el objeto entero una vez sacado del option.
  //refactor con find?
  for (acc of accounts) {
    if (recordBuffer.accTo === acc.name) {
      acc.balance += recordBuffer.amount;
      balance += recordBuffer.amount;
    } else if (recordBuffer.accFrom === acc.name) {
      acc.balance -= recordBuffer.amount;
      balance -= recordBuffer.amount;
    }
    pAccountBalance = document.getElementById(acc.name);
    pAccountBalance.innerText = acc.balance;
    balanceContainer.innerText = balance;
  }
  //busco el p del scrolling pill con el id de la cuenta (ojo)
};

const reloadTable = (recordBuffer) => {
  //arreglar esto para no repetir codigo. Si hay categoria, mostrarla, sino no.
  const table = document.querySelector("table");
  let row = document.createElement("tr");
  if (recordBuffer.category) {
    row.innerHTML = `
    <th>${table.rows.length}</th>
    <td>${new Date().toISOString().split("T")[0]}</td>
    <td>${recordBuffer.MoveType}</td>
    <td>$${recordBuffer.Value}</td>
    <td>${recordBuffer.category}</td>
    <td><button class="btn bg-dark text-white "><i class="fas fa-pencil-alt"></i>
    </button></td>
`;
  } else {
    row.innerHTML = `
    <th>${table.rows.length}</th>
    <td>${new Date().toISOString().split("T")[0]}</td>
    <td>${recordBuffer.MoveType}</td>
    <td>$${recordBuffer.Value}</td>
    <td></td>
    <td><button class="btn bg-dark text-white "><i class="fas fa-pencil-alt"></i>
    </button></td>
`;
  }
  table.querySelector("tbody").appendChild(row);
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

// const handleShowReminderHover = () => {
//   let recordElement = document.getElementById("recordatorios");
//   recordElement.classList.remove("d-none");
// };

// const handleHideReminderHover = () => {
//   let recordElement = document.getElementById("recordatorios");
//   recordElement.classList.add("d-none");
// };

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

//ARREGLAR ESTA COSA HORRIBLE DEL MODAL

let objModal = new bootstrap.Modal(document.getElementById("objModal"));

const handleObjModalOpen = () => {
  objModal.show();
  return;
};

const handleCloseObjModal = () => {
  // console.log("test 1");
  //ARREGLAR
  // let objModal = new bootstrap.Modal(document.getElementById("objModal"));
  objModal.hide();
  console.log('Modal cerrado')
};

const handleSaveObjModal = async (event) => {
  event.preventDefault()
  //Hacer validacion de campos vacios


  let nombreObjetivo = document.getElementById('nombre-objetivo')
  let montoObjetivo = document.getElementById('monto-objetivo')
  let nombreObjetivoValue = nombreObjetivo.value
  let montoObjetivoValue = montoObjetivo.value

  let testObj = {
    name : nombreObjetivoValue,
    amount: montoObjetivoValue,
    iduser: 1,
    //currency
  };

  const full =
  backendServer +
  "/controllers/entryPoint.php?type=target";

  try {
    const response = await fetch(full, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testObj)
    });
  } catch (error) { 
    alert('ERROR: ', error.message)
  }
  objModal.hide();
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

window.onload = begin;
