let accounts = [
  {
    name: "Savings",
    currency: "ARS",
    description: "BBVA",
    balance: 100,
  },
  {
    name: "Checking",
    currency: "ARS",
    description: "BSTN",
    balance: 200,
  },
  {
    name: "Ahorros USD",
    currency: "USD",
    description: "Ahorro",
    balance: 300,
  },
  {
    name: "Ahorros ARS",
    currency: "ARS",
    description: "Ahorro",
    balance: 400,
  },
];

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

const ARS_USD = 1000;

const begin = () => {
  console.log(document.getElementById("account"));
  loadBalance();
  loadAccounts();
  // document.getElementById('btn-ingreso').addEventListener('click', moneyIn);
  //document.getElementById("btn-new-reg").addEventListener("click",loadAccounts);
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
    .getElementById("btn-show-record")
    .addEventListener("mouseover", handleShowReminderHover);
  document
    .getElementById("btn-show-record")
    .addEventListener("mouseleave", handleHideReminderHover);
  document
    .getElementById("recordatorios")
    .addEventListener("mouseover", handleShowReminderHover);
  document
    .getElementById("recordatorios")
    .addEventListener("mouseleave", handleHideReminderHover);

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

  document
    .getElementById("btn-show-objetive")
    .addEventListener("click", handleObjetiveModal);
  document
    .getElementById("btn-show-record")
    .addEventListener("click", handleReminderModal);

  document
    .getElementById("btn-close-obj-modal")
    .addEventListener("click", handleCloseObjModal);
  document
    .getElementById("btn-save-obj-modal")
    .addEventListener("click", handleSaveObjModal);

  document
    .getElementById("btn-close-recordatorio-modal")
    .addEventListener("click", handleCloseRecordatorioModal);
  document
    .getElementById("btn-save-recordatorio-modal")
    .addEventListener("click", handleSaveRecordatorioModal);
  document
    .getElementById("type")
    .addEventListener("change", handleAccountToFrom);



};

const loadBalance = () => {
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

const loadAccounts = () => {
  let accountContainer = document.getElementById("account");
  let accountToContainer = document.getElementById("account-to");

  
  for (let acc of accounts) {
    let opt = document.createElement("option");
    opt.appendChild(document.createTextNode(acc.name));
    accountToContainer.appendChild(opt.cloneNode(true));
    accountContainer.appendChild(opt);
  }

};

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
    console.log(clickedElement);
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
    type: "",
    amount: 0,
    category: "",
    accFrom: "",
    accTo: "",
  };

  if (checkData(event, recordBuffer)) {
  
    refreshBalances(recordBuffer);
    //reloadTable(recordBuffer);

    enableCategories();
    resetFeedback();
    document.getElementById("form-add-reg").reset();
  }
};

const checkData = (event, recordBuffer) => {
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



  let isValidType = validateField(moveType);
  messageValidation(moveTypeContainer, moveTypeFeedback, isValidType);
  
  
  let isValidAccount;

  isValidAccount = validateAccount(accValue);
  messageValidation(accValueContainer, accFeedback, isValidAccount );
  if(moveType === "Move"){
    isValidAccount = validateAccount(accToValue);
    if(isValidAccount === true){
      isValidAccount = validateMove(accValue,accToValue)
    } 
    messageValidation(accToValueContainer, accToFeedback, isValidAccount );
  }
    
  let isValidAmount = validateAmount(enteredAmount, accValue, moveType);
  messageValidation(enteredAmountInput, enteredAmountFeedback, isValidAmount);

  if (
    isValidAccount === true &&
    isValidType === true &&
    isValidAmount === true
  ) {
    recordBuffer.type = moveType;
    recordBuffer.amount = enteredAmount;
    if (moveType === "Income") {
      recordBuffer.accFrom = "";
      recordBuffer.accTo = accValue;
    } else if (moveType === "Spent") {
      recordBuffer.accFrom = accValue;
      recordBuffer.accTo = "";
    }else if (moveType === "Move"){
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

const validateAmount = (amt, account, type) => {
  let amtInt = parseInt(amt);
  let moveFlag = type === "Spent" ? true : false;

  if (isNaN(amtInt)) {
    return "Monto no valido";
  } else if (amtInt < 0) {
    return "Monto debe ser positivo";
  } else if (amtInt === 0) {
    return "El monto no debe ser cero";
  }

//40 veces por todos lados, refactorizar despues. traer el obj de una una vez validado que existe la cuenta
  const accFind = accounts.find(acc => acc.name === account);

  if(!accFind)
    return "Error"

  if(moveFlag && accFind.balance < amtInt)
    return "Sin fondos"
  

  return true;
};



const validateAccount = (accValue) => {


  const accFind = accounts.find(acc => acc.name === accValue);
 
  if (!accFind)
    return "Cuenta no existe";
  else
    return true;
  

}

const validateMove = (accValue, accToValue) => {



  if(accValue === accToValue)
    return "Cuenta to igual a cuenta from"

    const accFind = accounts.find(acc => acc.name === accValue);
    const accToFind = accounts.find(acc => acc.name === accToValue);

  if (accFind.currency !== accToFind.currency)
    return "Diferente moneda"
    

  return true;

  


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


const handleShowReminderHover = () => {
  let recordElement = document.getElementById("recordatorios");
  recordElement.classList.remove("d-none");
};

const handleHideReminderHover = () => {
  let recordElement = document.getElementById("recordatorios");
  recordElement.classList.add("d-none");
};

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
  let objModal = new bootstrap.Modal(document.getElementById("objModal"));
  objModal.show();
  return;
};

const handleReminderModal = () => {
  handleReminderModalOpen();
  return;
};

const handleReminderModalOpen = () => {
  let reminderModal = new bootstrap.Modal(
    document.getElementById("reminderModal")
  );
  reminderModal.show();
  return;
};

const handleCloseObjModal = () => {
  console.log("test 1");
};

const handleSaveObjModal = () => {
  console.log("test 2");
};

const handleCloseRecordatorioModal = () => {
  console.log("test 3");
};

const handleSaveRecordatorioModal = () => {
  console.log("test 4");
};


const resetFeedback = () => {


  let valid = document.getElementsByClassName("is-valid");
  let invalid = document.getElementsByClassName("is-invalid");




  while (valid.length > 0){
    valid[0].classList.remove("is-valid")
  }

  while (invalid.length > 0){
    invalid[0].classList.remove("is-invalid")
  }
 

  
};


window.onload = begin;
