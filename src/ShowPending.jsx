import React, { useEffect, useState } from 'react'
import { Bar, HorizontalBar } from 'react-chartjs-2'

export default function ShowPending({overall, labelMonth, label_daily}) {

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
                data.push(row.kesPUIPending)
            }
        })

        setDaily(true)
        setDailyChart({
            labels: days,
            datasets: [
            {
                fill: false,
                label: att,
                data: data,
                backgroundColor: 'rgba(22, 199, 154, 1)',
            },
            ]
        })
    }
    
    useEffect(()=>{
        var mpostives = [ 0, 0, 0, 0, 0, 0, 0 ]
        overall.forEach(value=>{
            var month = parseInt(value.Tarikh.split('/')[1]-6)
            console.log(value)
            mpostives[month] += parseInt(value.kesPUIPending)
        })
        
        setMonthlyChart({
          labels: labelMonth,
          datasets: [
            {
                fill: false,
                label: 'Pending PUI',
                data: mpostives,
                backgroundColor: 'rgba(22, 199, 154, 1)',
            },
          ]
        })
        setDaily(false)
        setChartTitle('Total Pending PUI')
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
            text: 'Total Pending PUI',
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
            mpostives[month] = value.kesPUIPending
        })
        
        setMonthlyChart({
          labels: labelMonth,
          datasets: [
            {
                fill: false,
                label: 'Pending PUI',
                data: mpostives,
                backgroundColor: 'rgba(22, 199, 154, 1)',
            },
          ]
        })
        setChartTitle('Total Pending PUI')
        setDaily(false)
    }

    return (
        <>
            <div className = 'default-chart-container'  style={{display: !isDaily ? 'block': 'none', width:'50%', alignItems:'center'}}>
                {monthlyChart && <HorizontalBar height={175} data={monthlyChart} options={options} />}
            </div>
            <div className = 'default-chart-container'  style={{display: isDaily ? 'block': 'none', width: '50%', alignItems:'center'}}>
                {dailyChart && <HorizontalBar height={175} data={dailyChart} options={dailyOpt} />}
                <div className='monthly' onClick={()=>return_monthly()} style={{color:'white'}}>
                Monthly
                </div>
            </div>
        </>
    )
}
