// import  {read}  from './app.js';

const beginEstadisticas = async () => {
    console.log('DOM fully loaded and parsed');
 
    var ctx = document.getElementById('myPieChart').getContext('2d');

    let dataToUse= await read();
    console.log('sss', dataToUse)
    let incomeAmount = 0;
    let spentAmount = 0;

    for(let dataAsd of dataToUse){

        if (dataAsd['type'] == 'Income'){
            incomeAmount += dataAsd['amount']
        } else if(dataAsd['type'] == 'Spent') {
            spentAmount += dataAsd['amount']
        }

    }

    let totalMoney = incomeAmount + spentAmount;
    document.getElementById('totalMoney').innerText = `$${totalMoney}`

    var data = {
        labels: ['Ingresos', 'Egresos'],
        datasets: [{
            data: [incomeAmount, spentAmount],
            backgroundColor: ['#FF6384', '#36A2EB'],
        }]
    };

    var options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
};



const read = async () => {

    const url = "http://localhost/TP-LAB-PROG/register-tp/controllers/entryPoint.php/?type=register&id=adm";
    try {
      const response = await fetch(url);
  
      if (response.status == 200) {
        let data =  await response.json();
        return data
      }
    } catch (error) {
      console.error("Error: ", error);
      return null;
    }
  };

document.addEventListener("DOMContentLoaded", beginEstadisticas);
