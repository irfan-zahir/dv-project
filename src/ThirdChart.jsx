import React, { useEffect, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'

export default function ThirdChart({overall, labelMonth, label_daily}) {

    const [ isDaily, setDaily ] = useState()
    const [ dailyChart , setDailyChart ] = useState()
    const [ monthlyChart , setMonthlyChart ] = useState()
    const [ chartTitle, setChartTitle ] = useState()

    function setDailyView(att, month){
        setMonthlyChart()
        const days = label_daily(month)

        var data = [], data2 = []
        overall.forEach(row=>{
            var m = parseInt(row.Tarikh.split('/')[1])-6
            if(m == month){
                data.push(row.jumlahKesMati)
            }
        })

        setDaily(true)
        setDailyChart({
            labels: days,
            datasets: [
                {
                    type:'line',
                    fill: true,
                    label: 'Death Cases',
                    data: data,
                    backgroundColor: 'rgba(240, 84, 84, 1)',
                    borderColor: 'rgba(240, 84, 84, 1)',
                    lineTension: '0.2'
                },
            ]
        })
    }
    
    useEffect(()=>{
        var mpostives = []
        overall.forEach(value=>{
            var month = parseInt(value.Tarikh.split('/')[1]-6)
            mpostives[month] = value.jumlahKesMati
        })
        
        setMonthlyChart({
          labels: labelMonth,
          datasets: [
            {
                fill: true,
                label: 'Death Cases',
                data: mpostives,
                backgroundColor: 'rgba(240, 84, 84, 1)',
                borderColor: 'rgba(240, 84, 84, 1)',
                lineTension: '0.2'
            },
          ]
        })
        setDaily(false)
        setChartTitle('Total Death')
    }, [])


    
    var options = {
        onClick: (event, elements) => {
            if(elements.length>0){
                const chart = elements[0]._chart;
                const element = chart.getElementAtEvent(event)[0];
                const xLabel = chart.data.labels[element._index];
                const dataset = chart.data.datasets[element._datasetIndex];
        
                const month = labelMonth.indexOf(xLabel)
    
                console.log(dataset.label + month)
        
                if(element._datasetIndex == 0){
                setDailyView(dataset.label, month)
    
                setChartTitle(`${dataset.label} for ${xLabel}`)
            }

            }
        },
        title: {
            display: true,
            text: 'Total Death',
            fontColor: 'white',
            fontSize: 17
        },
        legend: {
            labels: {
                fontColor: 'white'
            },
            position: 'bottom'
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    fontColor: 'white'
                },
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: 'white'
                },
            }]
        } 
    }

    var dailyOpt = {
        title: {
            display: true,
            text: chartTitle,
            fontColor: 'white',
            fontSize: 17
        },
        legend: {
            labels: {
                fontColor: 'white'
            },
            position: 'bottom'
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    fontColor: 'white'
                },
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: 'white'
                },
            }]
        } 
    }

    function return_monthly(){
        setDailyChart()
        var mpostives = []
        overall.forEach(value=>{
            var month = parseInt(value.Tarikh.split('/')[1]-6)
            mpostives[month] = value.jumlahKesMati
        })
        
        setMonthlyChart({
          labels: labelMonth,
          datasets: [
            {
              type:'line',
              fill: true,
              label: 'Death Cases',
              data: mpostives,
              backgroundColor: 'rgba(240, 84, 84, 1)',
              borderColor: 'rgba(240, 84, 84, 1)',
              lineTension: '0.2'
            },
          ]
        })
        setChartTitle('New Positive Cases')
        setDaily(false)
    }

    return (
        <>
            <div className = 'default-chart-container'  style={{display: !isDaily ? 'block': 'none'}}>
                {monthlyChart && <Bar data={monthlyChart} options={options} />}
            </div>
            <div className = 'default-chart-container'  style={{display: isDaily ? 'block': 'none'}}>
                {dailyChart && <Bar data={dailyChart} options={dailyOpt} />}
                <div  className='monthly' onClick={()=>return_monthly()} style={{color:'white'}}>
                Monthly
                </div>
            </div>
        </>
    )
}
