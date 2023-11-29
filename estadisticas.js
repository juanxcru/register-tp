
const begin = () => {
 
    var ctx = document.getElementById('myPieChart').getContext('2d');


    var data = {
        labels: ['Ingresos', 'Egresos', 'Movimientos entre cuentas'],
        datasets: [{
            data: [30, 40, 30], 
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], 
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

window.onload = begin;