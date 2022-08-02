import React, { useCallback, useEffect, useRef, useState } from 'react'
//import { LineChart, Tooltip, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import moment from 'moment'
import { Chart as ChartJS } from 'chart.js/auto'
import 'chartjs-adapter-moment';
import _ from 'lodash';
import Plot from 'react-plotly.js';

import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart } from 'chart.js';


import { Line } from 'react-chartjs-2';
Chart.register(zoomPlugin);

function Pie({ data, selector, hidden }) {
    const [chartData, setchartData] = useState()
    const chart = useRef()


    useEffect(() => {
        if (!data) return








    }, [data])



    useEffect(() => {





    }, [hidden])
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Plot
                data={data.allOS.map((operatingSite, index) => {
                    console.log(operatingSite.color)
                    return {
                        name: operatingSite.name,
                        values: data.anything.map(time => {
                            return time.sumCurrent
                        }),
                        labels: data.anything.map(data => {
                            return data.precipitation
                        }),
                        type: 'pie',
                

                    }
                })
                }





                layout={{
                    width: '100%', height: '100%',
                    // title: 'A Fancy Plot'
                    showlegend: true,
                    legend: { "orientation": "h" }
                }}
                config = {{responsive: true}}
            />



        </div>
    )
}

export default Pie
