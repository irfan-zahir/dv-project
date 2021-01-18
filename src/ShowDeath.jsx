import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'

export default function ShowDeath({hospital}) {

    //matiKCH,matiSIBU,matiBNTL,matiMIRI,matiSGB
    const [ donutData, setDonutData ] = useState()

    useEffect(()=>{
        var data = [0 , 0, 0, 0, 0]
        hospital.forEach(value=>{
            data[0] = value.matiKCH
            data[1] = value.matiBNTL
            data[2] = value.matiMIRI
            data[3] = value.matiSGB
            data[4] = value.matiSIBU
        })

        setDonutData({
            maintainAspectRatio: true,
            responsive: true,
            labels: ["Kuching", "Bintulu", "Miri", "Sg. Buloh" , "Sibu"],
            datasets: [
              {
                data: data,
                backgroundColor: ['#f0a500', '#006a71', '#e97171', '#5d54a4', '#433520'],
                hoverBackgroundColor: ['#f0a500', '#006a71', '#e97171', '#5d54a4', '#433520']
              }
            ]
        })
    })

    const options = {
      title: {
          display: true,
          text: 'Death Cases',
          fontColor: 'white',
          fontSize: 17
      },
        legend: {
          display: true,
          position: "right",
          labels:{
              fontSize: 17,
              fontColor: 'white'
          }
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        }
    }

    return (
        <div style={{width:'500px', height: '500px', display:'flex', alignItems:'center'}}>
            <Doughnut height={200} data={{...donutData, }} options={{...options}} />
        </div>
    )
}
