
import './App.css';
import overall_data from './data/overall-statistics.csv';
import hospital_data from './data/hospital-data.csv'; 
import { csv } from "d3";
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

function App() {

  const [chart, setChart] = useState()
  const [ dailyChart, setDailyChart ] = useState()
  const [ topNavData, setNavData ] = useState()
  const [ loading, setLoading ] = useState(true)
  const [ loadingData, setLoadingData ] = useState(true)
  const [ overall, setOverall ] = useState()
  const [ hospital, setHospital ] = useState()

  const [ isDaily, setIsDaily ] = useState()

  const labelMonth = [
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  //get data for all month (jumlah kes positif x jumlah recovered)
  useEffect(()=>{
    var data = {
      jkp : 0, jtsd : 0, jk : 0, jpui : 0, jsd : 0
    }

    var jumlahKesPositif = [], jumlahRecovered = []
    if(loadingData)
    Promise.all([csv(overall_data), csv(hospital_data)]).then(results=>{
      var overall = results[0]
      var hospital = results[1]
      var final = overall[overall.length-1]
      data.jkp = final.jumlahKesPositif
      data.jtsd = final.jumlahTelahSembuhDiscaj
      data.jk = final.jumlahKesMati
      data.jpui = final.jumlahKesPUI
      data.jsd = 0

      overall.forEach(value=>{
        var month = parseInt(value.Tarikh.split('/')[1])-6
        jumlahKesPositif[month] = value.jumlahKesPositif
        jumlahRecovered[month] = value.jumlahTelahSembuhDiscaj
      })
      
      setNavData(data)
      setOverall(overall)
      setHospital(hospital)
      setLoading(false)
      setLoadingData(false)
      setChart({
        labels: labelMonth,
        datasets: [
          {
            type:'line',
            fill: false,
            label: 'Total Positive Cases',
            data: jumlahKesPositif,
            backgroundColor: 'rgba(240, 84, 84, 1)',
            borderColor: 'rgba(240, 84, 84, 1)',
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            type:'bar',
            label: 'Total Recovered and Discharge',
            data: jumlahRecovered,
            backgroundColor: 'rgba(22, 199, 154, 1)',
          },
        ]
      })
    })
  }, [])

  console.log(overall)
  function conv_shortLabel(label){
    switch (label) {
      case 'Total Positive Cases':
        return 'jkp'
      break;
      case 'Total Recovered and Discharge':
        return 'jtsd'
      break;
      case 'Total In Treatment':
        return 'jsd'
      break;
      case 'Total Death':
        return 'jk'
      break;
      case 'Total PUI Cases':
        return 'jpui'
      break;
      default:
        return 'default'
      break;
    }
  }

  var options = {
    onClick: (event, elements) => {
      const chart = elements[0]._chart;
      const element = chart.getElementAtEvent(event)[0];
      const xLabel = chart.data.labels[element._index];
      const dataset = chart.data.datasets[element._datasetIndex];

      const month = labelMonth.indexOf(xLabel)

      if(element._datasetIndex == 0){
        //positive cases
        setDailyView(dataset.label, month)
      }
      
      if(element._datasetIndex == 1){//only if default
        //recovered
      }
    },
    tooltips: {
       callbacks: {
          title: function() {}
       }
    },
    legend: {
      labels: {
        fontColor: 'white'
        }
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
    tooltips: {
       callbacks: {
          title: function() {}
       }
    },
    legend: {
      labels: {
        fontColor: 'white'
        }
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

  function filter_daily(shortAtt, month){
    var data = []
    switch(shortAtt){
      case 'jkp':
        overall.forEach(value=>{
          var m = parseInt(value.Tarikh.split('/')[1])-6
          if(m == month){
            data.push(value.jumlahKesPositif)
          }
        })
      break;
      case 'jtsd':
        overall.forEach(value=>{
          var m = parseInt(value.Tarikh.split('/')[1])-6
          if(m == month){
            data.push(value.jumlahTelahSembuhDiscaj)
          }
        })
      break;
      case 'jsd':
        hospital.forEach(value=>{
          var m = parseInt(value.Tarikh.split('/')[1])-6
          if(m == month){
            data.push(value.dirawatJumlah)
          }
        })
      break;
      case 'jk':
        hospital.forEach(value=>{
          var m = parseInt(value.Tarikh.split('/')[1])-6
          if(m == month){
            data.push(value.matiJumlah)
          }
        })
      break;
      case 'jpui':
        overall.forEach(value=>{
          var m = parseInt(value.Tarikh.split('/')[1])-6
          if(m == month){
            data.push(value.jumlahKesPUI)
          }
        })
      break;
    }
    return data
  }

  function label_daily(month){
    var days = 0
    var arrDay = []
    switch (month) {
      case 0: days=30; break;
      case 1: days=31; break;
      case 2: days=31; break;
      case 3: days=30; break;
      case 4: days=31; break;
      case 5: days=30; break;
      case 6: days=31; break;
    }

    for(var i = 1; i < days+1; i ++){
      arrDay.push(i)
    }
    return arrDay
  }

  function setDailyView(att, month){
    const shortAtt = conv_shortLabel(att)
    const days = label_daily(month)
    const data = filter_daily(shortAtt, month)
    setIsDaily(true)
    setChart()
    setDailyChart({
      labels: days,
      datasets: [
        {
          type:'bar',
          fill: false,
          label: att,
          data: data,
          backgroundColor: 'rgba(240, 84, 84, 1)',
        },
      ]
    })
  }

  function switch_jkp(){
    var jumlahKesPositif = []
    overall.forEach(value=>{
      var month = parseInt(value.Tarikh.split('/')[1])-6
      jumlahKesPositif[month] = value.jumlahKesPositif
    })
    
    setChart({
      labels: labelMonth,
      datasets: [
        {
          type:'bar',
          fill: false,
          label: 'Total Positive Cases',
          data: jumlahKesPositif,
          backgroundColor: 'rgba(240, 84, 84, 1)',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ]
    })
  }

  function jtsd_view(){
    var jumlahRecovered = []
    overall.forEach(value=>{
      var month = parseInt(value.Tarikh.split('/')[1])-6
      jumlahRecovered[month] = value.jumlahTelahSembuhDiscaj
    })
    
    setChart({
      labels: labelMonth,
      datasets: [
        {
          type:'bar',
          label: 'Total Recovered and Discharge',
          data: jumlahRecovered,
          backgroundColor: 'rgba(22, 199, 154, 1)',
        },
      ]
    })
  }

  function jsd_view(){
    var dirawat = []
    hospital.forEach(value=>{
      var month = parseInt(value.Tarikh.split('/')[1])-6
      dirawat[month] = value.dirawatJumlah
    })
    
    setChart({
      labels: labelMonth,
      datasets: [
        {
          type:'bar',
          label: 'Total In Treatment',
          data: dirawat,
          backgroundColor: 'rgba(255, 211, 105, 1)',
        },
      ]
    })
  }

  function jk_view(){
    var kesKematian = []
    hospital.forEach(value=>{
      var month = parseInt(value.Tarikh.split('/')[1])-6
      kesKematian[month] = value.matiJumlah
    })
    
    setChart({
      labels: labelMonth,
      datasets: [
        {
          type:'bar',
          label: 'Total Death',
          data: kesKematian,
          backgroundColor: 'rgba(240, 84, 84, 1)',
        },
      ]
    })
  }

  function jpui_view(){
    var kesPUI = []
    overall.forEach(value=>{
      var month = parseInt(value.Tarikh.split('/')[1])-6
      kesPUI[month] = value.jumlahKesPUI
    })
    
    setChart({
      labels: labelMonth,
      datasets: [
        {
          type:'bar',
          label: 'Total PUI Cases',
          data: kesPUI,
          backgroundColor: 'rgba(240, 84, 84, 1)',
        },
      ]
    })
  }

  function default_view(){
    setIsDaily(false)
    setDailyChart()
    var jumlahKesPositif = [], jumlahRecovered = []
    overall.forEach(value=>{
      var month = parseInt(value.Tarikh.split('/')[1])-6
      jumlahKesPositif[month] = value.jumlahKesPositif
      jumlahRecovered[month] = value.jumlahTelahSembuhDiscaj
    })
    
    setChart({
      labels: labelMonth,
      datasets: [
        {
          type:'line',
          fill: false,
          label: 'Total Positive Cases',
          data: jumlahKesPositif,
          backgroundColor: 'rgba(240, 84, 84, 1)',
          borderColor: 'rgba(240, 84, 84, 1)',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          type:'bar',
          label: 'Total Recovered and Discharge',
          data: jumlahRecovered,
          backgroundColor: 'rgba(22, 199, 154, 1)',
        },
      ]
    })
  }

  function button_clicked(att){
    setIsDaily(false)
    setDailyChart()
    switch(att){
      case 'jkp':
        switch_jkp()
      break;
      case 'jtsd':
        jtsd_view()
      break;
      case 'jsd':
        jsd_view()
      break;
      case 'jk':
        jk_view()
      break;
      case 'jpui':
        jpui_view()
      break;
      default:
        default_view();
      break;
    }
  }

  return (
    <div className="container">

      <div className='brand-name cuprum' onClick={()=>button_clicked()}>
          Chartjs Data Visualizations Group B
          <div className="brand-date">
            (June 2020 - December 2020)
          </div>
      </div>

      <div className='top-nav'>
          <div className="button" onClick={()=>button_clicked('jkp')}>
            <div className='jkp value'>
              {!loading && topNavData.jkp}
            </div>
            Positive Cases
          </div>
          <div className="button" onClick={()=>button_clicked('jtsd')}>
            <div className='jtsd value'>
              {!loading && topNavData.jtsd}
            </div>
            Recovered and Discharged
          </div>
          <div className="button" onClick={()=>button_clicked('jsd')}>
            <div className='jsd value'>
              {!loading && topNavData.jsd}
            </div>
            In Treatment
          </div>
          <div className="button" onClick={()=>button_clicked('jk')}>
            <div className='jk value'>
              {!loading && topNavData.jk}
            </div>
            Death
          </div>
          <div className="button" onClick={()=>button_clicked('jpui')}>
            <div className='jpui value'>
              {!loading && topNavData.jpui}
            </div>
            PUI Cases
          </div>
      </div>
      
      <div className='bar' style={{display: !isDaily ? 'block' : 'none'}}>
        {chart ? <Line data={chart} options={{...options, title: ''}} /> : 'loading monthly data ....'}
      </div>

      <div className='bar' style={{display: isDaily ? 'block' : 'none'}}>
        {dailyChart ? <Line data={dailyChart} options={{...dailyOpt, title: ''}} /> : 'loading daily data ....'}
      </div>
    </div>
  );
}

export default App;
