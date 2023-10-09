let accounts = [
{
  name: "Savings",
  currency : "ARS",
  description : "BBVA",
  balance: 100
},
{
  name: "Cheking",
  currency : "ARS",
  description : "BSTN",
  balance: 200
},
{
  name: "Ahorros USD",
  currency : "USD",
  description : "Ahorro",
  balance: 300
},
{
  name: "Ahorros ARS",
  currency : "ARS",
  description : "Ahorro",
  balance: 400
}


];


const ARS_USD = 1000;

const begin = () => {
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
  
    document.getElementById('btn-show-record').addEventListener('mouseover', handleShowRecordHover)
    document.getElementById('btn-show-record').addEventListener('mouseleave', handleHideRecordHover)
    document.getElementById('recordatorios').addEventListener('mouseover', handleShowRecordHover)
    document.getElementById('recordatorios').addEventListener('mouseleave', handleHideRecordHover)

    document.getElementById('btn-show-objetive').addEventListener('mouseover', handleShowObjetiveHover)
    document.getElementById('btn-show-objetive').addEventListener('mouseleave', handleHideObjetiveHover)
    document.getElementById('objetivos').addEventListener('mouseover', handleShowObjetiveHover)
    document.getElementById('objetivos').addEventListener('mouseleave', handleHideObjetiveHover)
  
};

const loadBalance = () => {

  let balanceScroll = document.getElementById("balance-scroll");
  
  for(acc of accounts){
    let divPill = document.createElement("div");
    divPill.classList.add("pill-div","col-2");
    
    let pTitle = document.createElement("p");
    pTitle.classList.add("pill-p-title");
    pTitle.append(acc.name)
    divPill.appendChild(pTitle);
    
    let divAccountBalance = document.createElement("div");
    divAccountBalance.classList.add("account-balance-div","text-white", "bg-dark");
    
    let pBalance = document.createElement("p");
    pBalance.classList.add("account-balance-p","text-center");
    //ojo aca: ID en html == acc.name
    pBalance.setAttribute("id",acc.name);
    pBalance.append(acc.balance);
    
    
    
    divAccountBalance.appendChild(pBalance);
    divPill.appendChild(divAccountBalance);
    balanceScroll.appendChild(divPill);
    
  }
    



  let balanceContainer = document.getElementById("balance");
  let balance = 0;
  for (let acc of accounts){
    //hacerlo bien
    if(acc.currency == "USD"){
      balance = balance + acc.balance * ARS_USD;
    }else if (acc.currency == "ARS"){
      balance += acc.balance
    }
    //hacerlo bien
  }
  
  balanceContainer.innerHTML = balance;


};

const loadAccounts = () => {
 let accountContainer = document.getElementById("account");
for(let acc of accounts){
  let opt = document.createElement("option");
      opt.appendChild(document.createTextNode(acc.name));
      accountContainer.appendChild(opt);
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
  
  let objectData = {};
  checkData(event, objectData);
  let selectedCategory = document.querySelector(".pressed");
  if (selectedCategory) {
    objectData.category = selectedCategory.id;
  }
  if (objectData.completed) {
    reloadTable(objectData);
    enableCategories();
  }
  console.log("sss", objectData);
};

const checkData = (event, objectData) => {
  let moveTypeContainer  = document.getElementById("type");
  let moveTypeFeedback = document.getElementById("typeFeedback");
  // let isChecked = document.getElementById('checkCat').checked;
  let enteredAmountInput = document.getElementById("amount");
  let enteredAmountFeedback = document.getElementById("amountFeedback")
  let balanceElement = document.getElementById("balance");
  let destinationAccValueContainer = document.getElementById("account");
  let destinationAccFeedback = document.getElementById("accountFeedback");

  let moveType = moveTypeContainer.value;
  let balanceAmount = balanceElement.textContent;
  let enteredAmount = enteredAmountInput.value;
  let destinationAccValue = destinationAccValueContainer.value;
  

  let isValidType = validateField(moveType);
  messageValidation(moveTypeContainer,moveTypeFeedback,isValidType);
  let isValidAccount = validateField(destinationAccValue);
  messageValidation(destinationAccValueContainer,destinationAccFeedback,isValidAccount);
  let isValidAmount = validateAmount(enteredAmount)
  messageValidation(enteredAmountInput,enteredAmountFeedback,isValidAmount);


  objectData.MoveType = moveType;
  objectData.Value = enteredAmount;

  if (isValidAccount === true && isValidType === true &&
      isValidAmount === true){ 
        reloadBalance(moveType, enteredAmount,destinationAccValue);
        objectData.completed = true;
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

const validateAmount = (enteredAmount) => {

  let enteredAmountInt = parseInt(enteredAmount);

  if (isNaN(enteredAmountInt)) {
    return "Monto no valido";
  }else if ( enteredAmount < 0){
    return "Monto debe ser positivo"
  }else if(enteredAmount === 0){
    return "El monto no debe ser cero"
  }

  return true;


};

const realoadSavingAccount = (enteredAmount) => {
  let savingAccountElement = document.getElementById("cajaDeAhorro");
  let savingAccountValue = savingAccountElement.textContent;
  let newValue = parseInt(savingAccountValue) + parseInt(enteredAmount);
  savingAccountElement.innerText = newValue;
};

const reloadBalance = (type, enteredAmount, account) => {

  //hacer desde check data para handlear que funcion usar
  //let cashElement = document.getElementById("cash-value");
enteredAmount = parseInt(enteredAmount)
let pAccountBalance;
let balanceContainer = document.getElementById("balance");
let balance = balanceContainer.innerText;
balance = parseInt(balance)
//solo sirve si el name de la cuenta es unico, despues manejar con ID o
//teniendo el objeto entero una vez sacado del option.
  for(let acc of accounts){
    if(account === acc.name){

      if (type === "Income") {
        acc.balance += enteredAmount;
        balance += enteredAmount;
      }else if( type === "Spent"){
        acc.balance -=  enteredAmount;
        balance -= enteredAmount;
      }
    //busco el p del scrolling pill con el id de la cuenta (ojo)
      pAccountBalance = document.getElementById(acc.name)
      pAccountBalance.innerText = acc.balance;
      balanceContainer.innerText = balance;
      
    }

  }

};

const reloadTable = (objectData) => {
  //arreglar esto para no repetir codigo. Si hay categoria, mostrarla, sino no.
  const table = document.querySelector("table");
  let row = document.createElement("tr");
  if (objectData.category) {
    row.innerHTML = `
    <th>${table.rows.length}</th>
    <td>${new Date().toISOString().split("T")[0]}</td>
    <td>${objectData.MoveType}</td>
    <td>$${objectData.Value}</td>
    <td>${objectData.category}</td>
    <td><button class="btn bg-dark text-white "><i class="fas fa-pencil-alt"></i>
    </button></td>
`;
  } else {
    row.innerHTML = `
    <th>${table.rows.length}</th>
    <td>${new Date().toISOString().split("T")[0]}</td>
    <td>${objectData.MoveType}</td>
    <td>$${objectData.Value}</td>
    <td></td>
    <td><button class="btn bg-dark text-white "><i class="fas fa-pencil-alt"></i>
    </button></td>
`;
  }
  table.querySelector("tbody").appendChild(row);
};

const closeModal = () => {
  document.getElementById("btn-save-modal").disabled = false;
  document.getElementById("btn-close-modal").classList.remove("bg-dark");
  // console.log('cerrar modal')
  //document.getElementById("monto").value = "";
  document.getElementById("form-add-reg").reset();
  enableCategories();
};

const handleShowRecordHover = () => {
  let recordElement = document.getElementById('recordatorios')
  recordElement.classList.remove('d-none')
  }
  
  
  const handleHideRecordHover = () => {
  let recordElement = document.getElementById('recordatorios')
  recordElement.classList.add('d-none')
  }

  const handleShowObjetiveHover = () => {
    let recordElement = document.getElementById('objetivos')
    recordElement.classList.remove('d-none')
    }
    
    
    const handleHideObjetiveHover = () => {
    let recordElement = document.getElementById('objetivos')
    recordElement.classList.add('d-none')
    }  

window.onload = begin;
