import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'

export default function ShowAC({hospital}) {

    const [ pieData, setPieData ] = useState()

    useEffect(()=>{

        var data = []
        hospital.forEach(value=>{
            data[0] = value.dirawatKCH
            data[1] = value.dirawatBNTL
            data[2] = value.dirawatMIRI
            data[3] = value.dirawatSGB
        })

        setPieData({
            maintainAspectRatio: true,
            responsive: true,
            labels: ["Kuching", "Bintulu", "Miri", "Sg. Buloh"],
            datasets: [
              {
                data: data,
                backgroundColor: ['#f0a500', '#006a71', '#e97171', '#5d54a4'],
                hoverBackgroundColor: ['#f0a500', '#006a71', '#e97171', '#5d54a4']
              }
            ]
        })

    }, [])

    const options = {
        title: {
            display: true,
            text: 'Patient In Treatment',
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
        <div style={{width:'500px', height: '500px', display:'flex', justifyContent:'start', alignItems:'center'}}>
            <Pie height={200}  data={pieData} options={options} />
        </div>
    )
}
