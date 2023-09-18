
const begin = () => {
    // document.getElementById('btn-ingreso').addEventListener('click', moneyIn);
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-save-modal').addEventListener('click', addRecord);
    document.getElementById('div-categoria').addEventListener('click', selectCategory)
}

const moneyIn = () => {
    //abrir un modal
    // let balanceElement = document.querySelector('#balance')
    // let currentBalance = parseInt(balanceElement.innerHTML)
    // let newBalance = currentBalance + 1
    // balanceElement.innerHTML = newBalance
    // document.getElementById('#myModal').modal(show=true)
}

const selectCategory = (event) => {

    let clickedElement
    //Detecta de otra manera los clicks en svg / button. No lo toma como 1 solo --fixed

if (event.target.classList.contains('cat')) {
        clickedElement = event.target;
        if(clickedElement.classList.contains('pressed')){
            clickedElement.classList.add('bg-dark')
            clickedElement.classList.remove('pressed')
            enableCategories()
        } else {
            clickedElement.classList.remove('bg-dark')
            clickedElement.classList.add('pressed')
            disableCategories()
        }
    }
}

const enableCategories = () => {
    let allCategoryButtons = document.querySelectorAll('.cat')
    allCategoryButtons.forEach(function(button){
        let isCatPressed = button.classList
        if(isCatPressed[2] == 'pressed'){
            button.classList.remove('pressed')
            button.classList.add('bg-dark')
        }
        button.disabled = false
    })
}

const disableCategories = () => {
    let allCategoryButtons = document.querySelectorAll('.cat')
    allCategoryButtons.forEach(function(button){
        let isCatPressed = button.classList
        // console.log(isCatPressed)
        isCatPressed[2] == 'pressed' ? null : button.disabled = true
    })
}

const addRecord = (event) => {
    let objectData = {}
    checkData(event,objectData)
    let selectedCategory = document.querySelector('.pressed')
    if(selectedCategory){
        objectData.category = selectedCategory.id
    }
    if(objectData.completed){
        reloadTable(objectData)
        enableCategories()
    }
    console.log('sss', objectData)
}

const checkData = (event,objectData) => {
    let moveType = document.getElementById('type').value;
    let destinationAccValue = document.getElementById('subtype').value
    // let isChecked = document.getElementById('checkCat').checked;
    let enteredAmountInput = document.getElementById('monto')
    let enteredAmount = enteredAmountInput.value
    let balanceElement = document.getElementById('balance');
    let balanceAmount = balanceElement.textContent;

    if (enteredAmount === '') {
        enteredAmountInput.style.border = '2px solid red'
        enteredAmountInput.focus()
        alert('This field is required')

    } else if (enteredAmount < 0) {
        enteredAmountInput.style.border = '2px solid red'
        enteredAmountInput.focus()
        alert('The amount must be greater than 0');
    }

    objectData.MoveType = moveType
    objectData.Value = enteredAmount

    if (moveType === 'Income' && enteredAmount > 0 && enteredAmountInput !== '') {

        enteredAmountInput.style.border = '1px solid gray'
        alert('Exitoso!')
        reloadCash(moveType, enteredAmount)
        let newBalance = parseInt(balanceAmount) + parseInt(enteredAmount);
        balanceElement.innerText = newBalance;
        // if (isChecked) {
        //     actualizarCajaAhorro(montoIngresado);
        // }
        document.getElementById('btn-save-modal').disabled = true
        // document.getElementById('btn-close-modal').style.backgroundColor = '#102a43'
        document.getElementById('btn-close-modal').classList.add('bg-dark')
        enteredAmountInput.value = ''
        // enableCategories()
        //Borra el color de la categoria y cerrar el modal -- falta cerrar modal
        objectData.completed = true

    } else if (moveType === 'Spent' && enteredAmount > 0 && enteredAmountInput !== ''){
        enteredAmountInput.style.border = '1px solid gray'
        alert('Exitoso!')
        let newBalance = parseInt(balanceAmount) - parseInt(enteredAmount);
        balanceElement.innerText = newBalance;
        document.getElementById('btn-save-modal').disabled = true
        document.getElementById('btn-close-modal').classList.add('bg-dark')
        enteredAmountInput.value = ''
        // enableCategories()
        objectData.completed = true
    }
}

const realoadSavingAccount = (enteredAmount) => {
    let savingAccountElement = document.getElementById('cajaDeAhorro')
    let savingAccountValue = savingAccountElement.textContent
    let newValue = parseInt(savingAccountValue) + parseInt(enteredAmount)
    savingAccountElement.innerText = newValue
}

const reloadCash = (type, enteredAmount) => {
    let newValue
     //hacer desde check data para handlear que funcion usar
    let cashElement = document.getElementById('cash-value')
    let cashElementValue = cashElement.textContent
    if(type === 'Income'){
        newValue = parseInt(cashElementValue) + parseInt(enteredAmount)
    } else {
        newValue = parseInt(cashElementValue) - parseInt(enteredAmount)
    }
    cashElement.innerText = newValue
}

const reloadTable = (objectData) => {
    //arreglar esto para no repetir codigo. Si hay categoria, mostrarla, sino no.
    const table = document.querySelector("table");
    let row = document.createElement("tr");
    if(objectData.category){
    row.innerHTML = `
    <th>${table.rows.length}</th>
    <td>${new Date().toISOString().split('T')[0]}</td>
    <td>${objectData.MoveType}</td>
    <td>$${objectData.Value}</td>
    <td>${objectData.category}</td>
    <td><button class="btn bg-dark text-white "><i class="fas fa-pencil-alt"></i>
    </button></td>
`;} else {
    row.innerHTML = `
    <th>${table.rows.length}</th>
    <td>${new Date().toISOString().split('T')[0]}</td>
    <td>${objectData.MoveType}</td>
    <td>$${objectData.Value}</td>
    <td></td>
    <td><button class="btn bg-dark text-white "><i class="fas fa-pencil-alt"></i>
    </button></td>
`;
}
    table.querySelector("tbody").appendChild(row);
}

const closeModal = () => {
    document.getElementById('btn-save-modal').disabled = false
    document.getElementById('btn-close-modal').classList.remove('bg-dark')
    // console.log('cerrar modal')
    document.getElementById('monto').value = ''
    enableCategories()
}

window.onload = begin;