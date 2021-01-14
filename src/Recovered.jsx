import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

export default function Recovered({overall, labelMonth, label_daily}) {

    const [ isDaily, setDaily ] = useState()
    const [ dailyChart , setDailyChart ] = useState()
    const [ monthlyChart , setMonthlyChart ] = useState()
    const [ chartTitle, setChartTitle ] = useState()

    function setDailyView(att, month){
        setMonthlyChart()
        const days = label_daily(month)

        var data = []
        overall.forEach(row=>{
            var m = parseInt(row.Tarikh.split('/')[1])-6
            if(m == month){
                data.push(row.jumlahTelahSembuhDiscaj)
            }
        })

        setDaily(true)
        setDailyChart({
            labels: days,
            datasets: [
            {
                type:'bar',
                fill: false,
                label: att,
                data: data,
                backgroundColor: 'rgba(22, 199, 154, 1)',
            },
            ]
        })
    }
    
    useEffect(()=>{
        var mpostives = []
        overall.forEach(value=>{
            var month = parseInt(value.Tarikh.split('/')[1]-6)
            mpostives[month] = value.jumlahTelahSembuhDiscaj
        })
        
        setMonthlyChart({
          labels: labelMonth,
          datasets: [
            {
                type:'bar',
                fill: false,
                label: 'Recovered and Discharged',
                data: mpostives,
                backgroundColor: 'rgba(22, 199, 154, 1)',
            },
          ]
        })
        setDaily(false)
        setChartTitle('Total Recovered and Discharged')
    }, [])


    
    var options = {
        onClick: (event, elements) => {
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
        },
        title: {
            display: true,
            text: 'Total Recovered and Discharged',
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
            mpostives[month] = value.jumlahTelahSembuhDiscaj
        })
        
        setMonthlyChart({
          labels: labelMonth,
          datasets: [
            {
                type:'bar',
                fill: false,
                label: 'Recovered and Discharged',
                data: mpostives,
                backgroundColor: 'rgba(22, 199, 154, 1)',
            },
          ]
        })
        setChartTitle('Total Recovered and Discharged')
        setDaily(false)
    }

    return (
        <>
            <div className = 'default-chart-container'  style={{display: !isDaily ? 'block': 'none'}}>
                {monthlyChart && <Bar data={monthlyChart} options={options} />}
            </div>
            <div className = 'default-chart-container'  style={{display: isDaily ? 'block': 'none'}}>
                {dailyChart && <Bar data={dailyChart} options={dailyOpt} />}
                <div className='monthly' onClick={()=>return_monthly()} style={{color:'white'}}>
                Monthly
                </div>
            </div>
        </>
    )
}
