import React, { useCallback, useEffect, useRef, useState } from 'react'
//import { LineChart, Tooltip, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

import _ from 'lodash';
import Plot from 'react-plotly.js';






function EvalPlot({ data }) {

    return (
        <div style={{ width: '100%', display: 'block' }}>
            <Plot
                data={data.data}

                layout={{
                
                    ...data.layout,
                    title: '',
                    autosize: true,
                    width: '100%',
                    line: { shape: 'spline' },
                 
                }}
                config={{ responsive: true }}
            />
        </div>


    )
}

export default EvalPlot
