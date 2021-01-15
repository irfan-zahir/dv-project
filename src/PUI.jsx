import React, { useEffect, useState } from 'react'
import { Bar, HorizontalBar, Line } from 'react-chartjs-2'

export default function PUI({overall, labelMonth, label_daily}) {

    const [ isDaily, setDaily ] = useState()
    const [ dailyChart , setDailyChart ] = useState()
    const [ monthlyChart , setMonthlyChart ] = useState()
    const [ chartTitle, setChartTitle ] = useState()

    function setDailyView(att, month){
        setMonthlyChart()
        console.log(att)
        var data = []
        switch (att) {
            case 'New Cases':
                overall.forEach(row=>{
                    var m = parseInt(row.Tarikh.split('/')[1])-6
                    if(m == month){
                        data.push(row.kesPUIBaru)
                    }
                })
            break;
            case 'Negatives':
                overall.forEach(row=>{
                    var m = parseInt(row.Tarikh.split('/')[1])-6
                    if(m == month){
                        data.push(row.kesPUINegatif)
                    }
                })
            break;
            case 'Total':
                overall.forEach(row=>{
                    var m = parseInt(row.Tarikh.split('/')[1])-6
                    if(m == month){
                        data.push(row.jumlahKesPUI)
                    }
                })
            break;
        }
        const days = label_daily(month)

        setDaily(true)
        setDailyChart({
            labels: days,
            datasets: [
            {
                type:'bar',
                fill: false,
                label: att,
                data: data,
                backgroundColor: 'rgba(255, 123, 84, 1)',
                borderColor: 'rgba(255, 123, 84, 1)',
            },
            ]
        })
    }
    
    useEffect(()=>{
        var dataPUI = [], dataNPUI = [], dataPUIB = [0, 0, 0, 0, 0, 0, 0]
        overall.forEach(value=>{
            var month = parseInt(value.Tarikh.split('/')[1]-6)
            dataPUI[month] = value.jumlahKesPUI
            dataNPUI[month] = value.kesPUINegatif
            dataPUIB[month] += parseInt(value.kesPUIBaru)
        })

        dataPUIB.forEach((value, index)=>{
            dataPUIB[index] = parseInt(value / label_daily(index).length)
        })
        
        setMonthlyChart({
          labels: labelMonth,
          datasets: [
            {
                type:'line',
                fill: true,
                yAxisID: 'l',
                label: 'New Cases',
                data: dataPUIB,
                backgroundColor: 'rgba(187, 34, 5, 1)',
                borderColor: 'rgba(187, 34, 5, 1)',
            },
            {
                type:'line',
                fill: true,
                yAxisID: 'r',
                label: 'Negatives',
                data: dataNPUI,
                backgroundColor: 'rgba(22, 199, 154, 1)',
                borderColor: 'rgba(22, 199, 154, 1)',
            },
            {
                type:'line',
                fill: true,
                label: 'Total',
                data: dataPUI,
                yAxisID: 'r',
                backgroundColor: 'rgba(255, 123, 84, 1)',
                borderColor: 'rgba(255, 123, 84, 1)',
            },
          ]
        })
        setDaily(false)
    }, [])


    
    var options = {
        onClick: (event, elements) => {
            if(elements.length>0){
                const chart = elements[0]._chart;
                const element = chart.getElementAtEvent(event)[0];
                const xLabel = chart.data.labels[element._index];
                const dataset = chart.data.datasets[element._datasetIndex];
        
                const month = labelMonth.indexOf(xLabel)
        
                setDailyView(dataset.label, month)
    
                setChartTitle(`${dataset.label} for ${xLabel}`)
            

            }
        },
        title: {
            display: true,
            text: 'Person Under Investigations (PUI)',
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
            yAxes: [
                {
                    type: 'linear',
                    id: 'r',
                    position: 'right',
                    ticks: {
                        beginAtZero:true,
                        fontColor: 'white'
                    },
                    gridLines:{
                        color: '#393e46'
                    }
                },
                {
                    type: 'linear',
                    id: 'l',
                    position: 'left',
                    ticks: {
                        beginAtZero:true,
                        fontColor: 'white'
                    },
                    gridLines:{
                        color: '#393e46'
                    }
                },
            ],
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
            yAxes: [
                {
                    type: 'linear',
                    id: 'l',
                    position: 'left',
                    ticks: {
                        beginAtZero:true,
                        fontColor: 'white'
                    },
                    gridLines:{
                        color: '#393e46'
                    }
                },
            ],
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
        var dataPUI = [], dataNPUI = [], dataPUIB = [0, 0, 0, 0, 0, 0, 0]
        overall.forEach(value=>{
            var month = parseInt(value.Tarikh.split('/')[1]-6)
            dataPUI[month] = value.jumlahKesPUI
            dataNPUI[month] = value.kesPUINegatif
            dataPUIB[month] += parseInt(value.kesPUIBaru)
        })

        dataPUIB.forEach((value, index)=>{
            dataPUIB[index] = parseInt(value / label_daily(index).length)
        })
        
        setMonthlyChart({
          labels: labelMonth,
          datasets: [
            {
                type:'line',
                fill: true,
                yAxisID: 'l',
                label: 'New Cases',
                data: dataPUIB,
                backgroundColor: 'rgba(187, 34, 5, 1)',
                borderColor: 'rgba(187, 34, 5, 1)',
            },
            {
                type:'line',
                fill: true,
                yAxisID: 'r',
                label: 'Negatives',
                data: dataNPUI,
                backgroundColor: 'rgba(50, 224, 196, 1)',
                borderColor: 'rgba(50, 224, 196, 1)',
            },
            {
                type:'line',
                fill: true,
                label: 'Total',
                data: dataPUI,
                yAxisID: 'r',
                backgroundColor: 'rgba(255, 123, 84, 1)',
                borderColor: 'rgba(255, 123, 84, 1)',
            },
          ]
        })
        setDaily(false)
    }

    return (
        <>
            <div className = 'default-chart-container'  style={{display: !isDaily ? 'block': 'none', width:'550px'}}>
                {monthlyChart && <Line height={250} data={monthlyChart} options={options} />}
            </div>
            <div className = 'default-chart-container'  style={{display: isDaily ? 'block': 'none', width:'550px'}}>
                {dailyChart && <Line height={250} data={dailyChart} options={dailyOpt} />}
                <div className='monthly' onClick={()=>return_monthly()} style={{color:'white'}}>
                Monthly
                </div>
            </div>
        </>
    )
}
