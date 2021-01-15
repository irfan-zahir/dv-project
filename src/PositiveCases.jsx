import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

export default function PositiveCases({overall, hospital, labelMonth, label_daily}) {

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
                data.push(row.kesPositifBaru)
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
              backgroundColor: 'rgba(255, 211, 105, 1)',
            },
            ]
        })
    }
    
    useEffect(()=>{
        var mpostives = [0, 0, 0, 0, 0, 0, 0]
        overall.forEach(value=>{
            var month = parseInt(value.Tarikh.split('/')[1]-6)
            mpostives[month] += parseInt(value.kesPositifBaru)
            
        })

        var recovered = [0, 0, 0, 0, 0, 0, 0]
        hospital.forEach(value=>{
            var month = parseInt(value.Tarikh.split('/')[1]-6)
            recovered[month] += parseInt(value.discajJumlah)
        })
        
        setMonthlyChart({
          labels: labelMonth,
          datasets: [
            {
                type:'line',
                fill: false,
                yAxisID: 'l',
                tension: 0,
                label: 'New Postive Cases',
                data: mpostives,
                backgroundColor: 'rgba(255, 211, 105, 1)',
                borderColor: 'rgba(255, 211, 105, 1)',
            },
            {
                type:'bar',
                fill: true,
                yAxisID: 'r',
                label: 'New Recovery',
                data: recovered,
                backgroundColor: 'rgba(22, 199, 154, 1)',
                borderColor: 'rgba(22, 199, 154, 1)'
            },
          ]
        })
        setDaily(false)
        setChartTitle('New Positive Cases vs')
    }, [])


    
    var options = {
        onClick: (event, elements) => {
            if(elements.length >0){
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
            text: 'New Postive Cases vs New Recovery',
            fontColor: 'white',
            fontSize: 17
        },
        legend: {
            labels:{
                fontColor: 'white'
            },
            position: 'bottom'
        },
        scales: {
            yAxes: [
                {
                    id:'l',
                    position: 'left',
                    ticks: {
                        beginAtZero:true,
                        fontColor: 'white'
                    },
                    gridLines:{
                        color: '#393e46'
                    }
                },
                {
                    id:'r',
                    position: 'right',
                    ticks: {
                        beginAtZero:true,
                        fontColor: 'white'
                    },
                    gridLines:{
                        color: '#393e46'
                    }
                }
            ],
            xAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'white'
                    },
                    gridLines:{
                        color: '#393e46'
                    }
                }
            ]
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
            labels:{
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
                gridLines:{
                    color: '#393e46'
                }
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: 'white'
                },
                gridLines:{
                    color: '#393e46'
                }
            }]
        } 
    }

    function return_monthly(){
        setDailyChart()
        var mpostives = [0, 0, 0, 0, 0, 0, 0]
        var recovered = []
        overall.forEach(value=>{
            var month = parseInt(value.Tarikh.split('/')[1]-6)
            mpostives[month] += parseInt(value.kesPositifBaru)
            recovered[month] = value.jumlahTelahSembuhDiscaj
            
        })
        
        setMonthlyChart({
          labels: labelMonth,
          datasets: [
            {
                type:'line',
                fill: false,
                yAxisID: 'l',
                tension: 0,
                label: 'New Postive Cases',
                data: mpostives,
                backgroundColor: 'rgba(255, 211, 105, 1)',
                borderColor: 'rgba(255, 211, 105, 1)',
            },
            {
                type:'bar',
                fill: true,
                yAxisID: 'r',
                label: 'New Recovery',
                data: recovered,
                backgroundColor: 'rgba(22, 199, 154, 1)',
                borderColor: 'rgba(22, 199, 154, 1)'
            },
          ]
        })
        setChartTitle('New Positive Cases')
        setDaily(false)
    }

    return (
        <>
            <div className = 'default-chart-container'  style={{display: !isDaily ? 'block': 'none', width:'550px'}}>
                {monthlyChart && <Bar height={250} data={monthlyChart} options={options} />}
            </div>
            <div className = 'default-chart-container'  style={{display: isDaily ? 'block': 'none', width:'550px'}}>
                {dailyChart && <Bar height={250} data={dailyChart} options={dailyOpt} />}
                <div className='monthly' onClick={()=>return_monthly()} style={{color:'white'}}>
                Monthly
                </div>
            </div>
        </>
    )
}
