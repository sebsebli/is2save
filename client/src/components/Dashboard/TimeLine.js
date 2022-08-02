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

function TimeLine({ data, selector, hidden }) {
    const [chartData, setchartData] = useState()
    const chart = useRef()


    let datasetIDs = {}
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        elements: {
            point: {
                radius: 0
            },

        },

        plugins: {
            legend: {
                display: false
            },


            title: {
                display: false,
                text: 'Avg Util in Percent'
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x',
                }
            }
        },
        interaction: {
            intersect: false,
        },
        scales: {
            x: {
                display: true,
                type: 'timeseries',
                title: {
                    display: true
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: selector.toUpperCase() + ' UTILIZATION (in %)'
                },
                suggestedMin: 0,
                suggestedMax: 100
            }
        }
    }
    useEffect(() => {
        if (!data) return



        let allCharts = {
            labels: data.avgUtils.map(time => {
                return time.timestamp

            }),
            // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
            datasets: data.allOS.map((operatingSite, index) => {
                return {
                    label: operatingSite.name,
                    hidden: false,
                    data: data.avgUtils.map(data => {
                        let res = _.find(data.data, function (obj) {
                            return obj.name === operatingSite.name;
                        })

                        return res ? res.values[selector] : 'NaN'



                    }),
                    // you can set indiviual colors for each bar
                    borderColor: operatingSite.color,
                    backgroundColor: operatingSite.color,
                    borderWidth: 2,
                }
            })

        }





        setchartData(allCharts)
    }, [data])



    useEffect(() => {

        if (!chart.current) return
        console.log('update', hidden)

        chart.current.data.datasets.forEach((dataSet, i) => {
            var meta = chart.current.getDatasetMeta(i);

            hidden.forEach((element) => {
                if (dataSet.label === element.name) {
                    meta.hidden = element.hidden
                }

            })




        });

        chart.current.update()



    }, [hidden])
    return (
        <div style={{ height: '100%', width: '100%' }}>
           
            {chartData ? <Line
                style={{ height: 400 }}
                data={chartData}
                options={options}
                ref={chart}
            />





                : <></>}

            {/* 
            <ResponsiveContainer height={'100%'} width={'100%'}>

                <LineChart data={data}>
                    <Line type="monotone" dataKey="easy" stroke="#8884d8" />
                    <Line type="monotone" dataKey="medium" stroke="#8884d8" />

                    <CartesianGrid stroke="#ccc" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => moment(timestamp).format('mm-DD HH:mm')}
                        type='number'
                        domain={['auto', 'auto']}
                        scale="time"
                    />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            </ResponsiveContainer>
            */}
        </div>
    )
}

export default TimeLine
