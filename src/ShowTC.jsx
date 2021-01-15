import React, { useEffect, useState } from 'react'
import { Bar, HorizontalBar, Line } from 'react-chartjs-2'

export default function ShowTC({overall, labelMonth, label_daily}) {

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
                data.push(row.jumlahKesPositif)
            }
        })

        setDaily(true)
        setDailyChart({
            labels: days,
            datasets: [
            {
                fill: true,
                label: att,
                data: data,
                backgroundColor: 'rgba(22, 199, 154, 1)',
                borderColor: 'rgba(22, 199, 154, 1)',
            },
            ]
        })
    }
    
    useEffect(()=>{
        var mpostives = [ 0, 0, 0, 0, 0, 0, 0 ]
        overall.forEach(value=>{
            var month = parseInt(value.Tarikh.split('/')[1]-6)
            console.log(value)
            mpostives[month] = parseInt(value.jumlahKesPositif)
        })
        
        setMonthlyChart({
          labels: labelMonth,
          datasets: [
            {
                fill: true,
                label: 'Positive Cases',
                data: mpostives,
                backgroundColor: 'rgba(22, 199, 154, 1)',
                borderColor: 'rgba(22, 199, 154, 1)',
            },
          ]
        })
        setDaily(false)
        setChartTitle('Total Positive Cases')
    }, [])


    
    var options = {
        onClick: (event, elements) => {
            if(elements.length > 0){
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
            text: 'Total Positive Cases',
            fontColor: 'white',
            fontSize: 17,
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
        var mpostives = []
        overall.forEach(value=>{
            var month = parseInt(value.Tarikh.split('/')[1]-6)
            mpostives[month] = value.jumlahKesPositif
        })
        
        setMonthlyChart({
          labels: labelMonth,
          datasets: [
            {
                fill: true,
                label: 'Positive Cases',
                data: mpostives,
                backgroundColor: 'rgba(22, 199, 154, 1)',
                borderColor: 'rgba(22, 199, 154, 1)',
            },
          ]
        })
        setChartTitle('Total Positive Cases')
        setDaily(false)
    }

    return (
        <>
            <div className = 'default-chart-container'  style={{display: !isDaily ? 'block': 'none', width:'50%', alignItems:'center'}}>
                {monthlyChart && <Line height={175} data={monthlyChart} options={options} />}
            </div>
            <div className = 'default-chart-container'  style={{display: isDaily ? 'block': 'none', width: '50%', alignItems:'center'}}>
                {dailyChart && <Line height={175} data={dailyChart} options={dailyOpt} />}
                <div className='monthly' onClick={()=>return_monthly()} style={{color:'white'}}>
                Monthly
                </div>
            </div>
        </>
    )
}
