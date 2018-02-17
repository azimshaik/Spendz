//alert('hello world 23');

//Ajax call to get JSON Data 

$(document).ready(function () {
    var accountsChartData = []; 

    var categoriesChartData = [];

    $.ajax({
        // url: 'myjson.json', 
        url: 'http://localhost:8000/json',
        dataType: 'json',
        success: function (jsonData) {
            $.each(jsonData.accounts, function (k,acc) {
                var account = {
                    name: acc.name,
                    currentBal: acc.balances.current
                };
                accountsChartData.push(account); 
                
            }); 

            DrawAccountsChart(accountsChartData);

            $.each(jsonData.transactions, function (k, tran) {
                console.log(tran.category); console.log(tran.amount); 
                var currentTran = {
                    category: "Misc", 
                    amount: 0
                }; 
                if (tran.category)
                {
                    currentTran.category = tran.category[0]; 
                }
                currentTran.amount = tran.amount; 

                categoriesChartData.push(currentTran); 

            }); 

            DrawCategoriesChart(categoriesChartData); 
        }
    }
    );


});

function DrawAccountsChart(accounts) {
   // console.log(accounts);
    var chartData= []; 
    $.each(accounts, function (k, cd) {
        var acc = []; 
        acc.push(cd.name); acc.push(cd.currentBal); 
        chartData.push(acc); 
    }); 

    // Build the chart
    $('#CusAccAndBal').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Customer Accounts and Balances'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: ${point.y:,.2f}'
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: 'Current Balance',
            data: chartData
        }]
    });
}

function DrawCategoriesChart(trans) {
  //  console.log(trans); //TransChart
    var TranSummary = []; 
    var chartData = []; 

    
    $.each(trans, function (k, ts) {

       var curTran = TranSummary.find(t => t.category === ts.category)

       if (!curTran)
       {
           var trans = [];
           trans.push(ts.category); trans.push(ts.amount);
           TranSummary.push(ts); 
       }
       else
       {
           curTran.amount += ts.amount; 
       }

    }); 

    $.each(TranSummary, function (k, ts) {
        var trans = [];
        trans.push(ts.category); trans.push(ts.amount);

        chartData.push(trans);
    }); 

    $('#TransChart').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Transcations Summary'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: ${point.y:,.2f}'
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: 'Amount Spent',
            data: chartData
        }]
    });
}

/**

Data Structure for Pie Chart 
[
                ['Firefox', 500],
                ['IE', 26.8],
                {
                    name: 'Chrome',
                    y: 12.8,
                    sliced: true,
                    selected: true
                },
                ['Safari', 8.5],
                ['Opera', 6.2],
                ['Others', 0.7]
            ]

*/