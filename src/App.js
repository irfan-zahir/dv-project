
import './App.css';
import overall_data from './data/overall-statistics.csv';
import hospital_data from './data/hospital-data.csv'; 
import { csv } from "d3";
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import PositiveCases from './PositiveCases';
import ThirdChart from './ThirdChart';
import Recovered from './Recovered';
import PUI from './PUI';
import ShowDeath from './ShowDeath';
import ShowPending from './ShowPending';
import ShowAC from './ShowAC';
import ShowTC from './ShowTC';

function App() {

  const [ loadingData, setLoadingData ] = useState(true)
  const [ overall, setOverall ] = useState()
  const [ hospital, setHospital ] = useState()
  const [ isDefault, setDefault ] = useState()
  const [ buttonVal, setButtonVal ] = useState()
  const [ showTC, setShowTC ] = useState()
  const [ showAC, setShowAC ] = useState()
  const [ showPending, setShowPending ] = useState()
  const [ showDeath, setShowDeath ] = useState()

  const labelMonth = [
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

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

  //get data for all month (jumlah kes positif x jumlah recovered)
  useEffect(()=>{
    if(loadingData)
    Promise.all([csv(overall_data), csv(hospital_data)]).then(results=>{
      var data  = { tc: 0, it: 0, npui: 0, ppui: 0,  jkm: 0}
      var oFinal = results[0][results[0].length-1]
      var hFinal = results[1][results[1].length-1]
      data.tc = oFinal.jumlahKesPositif
      data.it = hFinal.dirawatJumlah
      data.npui = oFinal.kesPUINegatif

      results[0].forEach(value=>{
        data.ppui += parseInt(value.kesPUIPending)
      })

      data.jkm = oFinal.jumlahKesMati
      setButtonVal(data)
      setOverall(results[0])
      setHospital(results[1])
      setDefault(true)
      setLoadingData(false)

    })
  }, [])

  function button_view(button){
    setDefault(false)
    switch (button) {
      case 'tc':
        setShowTC(true)
        setShowAC(false)
        setShowPending(false)
        setShowDeath(false)
      break;
      case 'ac':
        setShowTC(false)
        setShowAC(true)
        setShowPending(false)
        setShowDeath(false)
      break;
      case 'jkm':
        setShowTC(false)
        setShowDeath(true)
        setShowAC(false)
        setShowPending(false)
      break;
      case 'ppui':
        setShowTC(false)
        setShowPending(true)
        setShowAC(false)
        setShowDeath(false)
      break;
    }
  }

  function view_default(){
    setDefault(true)
    setShowTC(false)
    setShowPending(false)
    setShowAC(false)
    setShowDeath(false)
  }

  return (
    <div className="container lilita">

      <div className='brand-name' onClick={()=>view_default()}>
          Sarawak COVID-19 Data Visualization Dashboard
          <div className="brand-date">
            (June 2020 - December 2020)
          </div>
      </div>

      <div className='top-nav'>
        {/*  #ffd369 #ff884b #f05454 #*/}
        <div className='button' onClick={()=>button_view('tc')}> 
            <div className='value' style={{backgroundColor:'rgb(255, 242, 0)'}}>
              {buttonVal && buttonVal.tc}
            </div>
            Total Cases
        </div>
        <div className='button' onClick={()=>button_view('ac')}>
            <div className='value' style={{backgroundColor:'rgb(255, 127, 39'}}>
              {buttonVal && buttonVal.it}
            </div>
            Active Cases
        </div>
        {/* <div className='button'>
            <div className='value' style={{backgroundColor: '#16c79a'}}>
              {buttonVal && buttonVal.npui}
            </div>
            Negatives
        </div> */}
        <div className='button' onClick={()=>button_view('jkm')}>
            <div className='value' style={{backgroundColor: 'rgb(237, 28, 36)'}}>
              {buttonVal && buttonVal.jkm}
            </div>
            Total Death
        </div>
        <div className='button' onClick={()=>button_view('ppui')}>
            <div className='value' style={{backgroundColor: '#a6a9b6'}}>
              {buttonVal && buttonVal.ppui}
            </div>
            Pending PUI
        </div>
      </div>

      <div className='vars' style={{display: !isDefault ? 'flex' : 'none', width:'100%', alignItems:'center', justifyContent:'center'}}>
          {showDeath && <ShowDeath hospital={hospital} />}
          {showPending && <ShowPending overall={overall} labelMonth={labelMonth} label_daily={label_daily} />}
          {showAC && <ShowAC hospital={hospital} />}
          {showTC && <ShowTC overall={overall} labelMonth={labelMonth} label_daily={label_daily} />}
      </div>
      <div className='default' style={{display: isDefault ? 'flex' : 'none', flexDirection:'column'}}>
        <div className='row-1' style={{display: 'flex', flexDirection: 'row'}}>
            <div className='default-chart new-cases'>
              { isDefault && <PositiveCases overall={overall} labelMonth={labelMonth} label_daily={label_daily} />}
            </div>
            <div className='default-chart pui'>
              { isDefault && <PUI overall={overall} labelMonth={labelMonth} label_daily={label_daily} />}
            </div>
            {/* <div className='default-chart recovered'>
              { isDefault && <Recovered overall={overall} labelMonth={labelMonth} label_daily={label_daily} />}
            </div> */}
        </div>
        <div className='row-2' style={{display: 'flex', flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
            {/* <div className='default-chart death'>
              { isDefault && <ThirdChart overall={overall} labelMonth={labelMonth} label_daily={label_daily} />}
            </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
