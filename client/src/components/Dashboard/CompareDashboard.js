import { Button, Card, Classes, Elevation, H1, H3, H4, H5, H6, Icon, Intent, ProgressBar, Slider } from '@blueprintjs/core'
import React, { useCallback, useEffect, useState } from 'react'
import Loader from '../Loader'
import MovementMap from './Map'
import SingleCard from './SingleCard'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TimeLine from './TimeLine_upt'
import { useGlobalState } from 'state-pool'
import Keys from './Keys'
import Pie from './Pie'
import EvalPlot from './Plot'
import DashboardMenu from '../DashboardMenu'
import { DateTime } from "luxon";

import { returnTemp, returnRain, returnLowMedSev, returnImpact, returnRisk, returnMedia, returnInfo } from '../../helpers/helpers'


function norm(val, max, min) { return (val - min) / (max - min); }


function CompareDashboard({ data, scenario, deleteItem, map }) {
    const [collapsed, setCollapsed] = useState(true)


    /*
    
        const returnCharts = () => {
            if (!data) return <></>
            let res = []
            for (var key of Object.keys(data)) {
    
    
                if (key !== 'allOS' && key !== 'latestDate' && key !== 'avgUtilForOS') {
    
                    res.push(<SingleCard collapseAll={collapsed} key={key} title={data[key].layout.title} content={<EvalPlot data={data[key]} />} />)
    
                }
    
            }
            return res
        }
    
        const renderMap = () => {
            var img = new Image();
            img.src = map;
    
    
            return <SingleCard collapseAll={collapsed} fullSize={true} title="Volunteer Map"
                content={<div style={{ width: '100%', height: 500, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundImage: "url('" + img.src + "')", display: 'flex', justifyContent: 'center', alignItems: 'center' }}><H4>{!map && 'NO MAP DATA'} </H4></div>}
            />
        }
    */
    return (

        <Card elevation={Elevation.ONE} style={{ width: '100%', margin: 10, minWidth: 500, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>





        </Card >
    )
}

export default CompareDashboard
