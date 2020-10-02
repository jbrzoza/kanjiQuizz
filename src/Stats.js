import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts';

function Stats() {

    const [rawData, setRawData] = useState([])
    const [data, setData] = useState([])
    const [xaxis, setXAxis] = useState([])

    useEffect(() => {
        fetch(`https://kanjiquizz-server.herokuapp.com/getScoreStats`)
        .then(response =>  response.json())
        .then(r => { 
            setRawData(r)
            var data = []
            var xaxis = []
            r.forEach(elt => {
              data.push(elt.score)
              xaxis.push(elt.date)
            })
            setData(data)
            setXAxis(xaxis)
        })
        .catch(err => console.warn(err))
    }, [])

    const keepLastDays = (nbDays) => {
      var data = []
      var xaxis = []
      var datefilter = new Date();
      datefilter.setTime(datefilter.getTime() - nbDays*1000*24*60*60); 
      rawData.forEach(elt => {
        if (Date.parse(elt.date) >= datefilter.getTime()) {
            data.push(elt.score)
            xaxis.push(elt.date)
        }
      })
      setData(data)
      setXAxis(xaxis)
    } 

    const series = [{
        name: 'score',
        data: data
      }]

    const options = {
        chart: {
          type: 'line',
        },
        title: {
            text: 'Score (total correct answers)',
            align: 'left',
            style: {
              fontSize: "16px",
              color: '#666'
            }
          },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        xaxis: {
          type: 'datetime',
          categories: xaxis
        },     
        tooltip: {
          x: {
            format: 'dd/MMM/yyyy'
          },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: [ '#FDD835'],
                shadeIntensity: 1,
                type: 'horizontal',
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100]
              },
          }
    }

    return (
        <div>
    <ReactApexChart options={options} series={series} height={350} />
        <div>
          <select name="nbDays" defaultValue="9999" onChange={e => keepLastDays(e.target.value)}>
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
          <option value="365">Last 1 year</option>
          <option value="9999">All</option>
          </select>
        </div>
        </div>
    )
}

export default Stats
