import { Card, Classes, Elevation, H1, H3, H4, H5, H6, Icon, Intent, ProgressBar, Slider } from '@blueprintjs/core'
import React, { useCallback, useEffect, useRef } from 'react'
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
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { returnTemp, returnRain, returnLowMedSev, returnImpact, returnRisk, returnMedia, returnInfo } from '../../helpers/helpers'
import WrappedFrame from '../../helpers/embedIframe'
import FrameWrapper from '../../helpers/embedIframe'


function norm(val, max, min) { return (val - min) / (max - min); }


function SingleDashboard({ data, latest, comparison }) {


    const iframeData = React.useRef();
    const [height, setHeight] = React.useState("0px");
    const onLoad = () => {
        setHeight(iframeData.current.contentWindow.document.body.scrollHeight + "px");
    };



    /*const [scenario, setScenario, updateScenario] = useGlobalState("scenario");
    const [progress, setProgress] = useState(0);
    const [selected, setSelected] = useState(0)
    const [collapsed, setCollapsed] = useState(true)
    useEffect(() => {
        let beg = 0
        let end = 0

        if (!data.stored) {
            // load scenario from app
            beg = Date.parse(scenario.duration.startDate)
            end = Date.parse(scenario.duration.endDate)
            setProgress(norm(data.latestDate, end, beg))
        }



    }, [data]);
*/

    /*
        const returnCharts = () => {
            if (!data) return <></>
            let res = []
            for (var key of Object.keys(data)) {
    

                <SingleCard collapseAll={collapsed} fullSize={true} title="Scenario overview" content={

                    <table style={{
                        display: 'inline-block',
                        width: '100%',
                        margin: 5,
                        overflowX: 'auto',
                        whiteSpace: 'nowrap'
                    }}>
                        <td style={{ textAlign: 'right', margin: 5, padding: 2 }}>
                            <tr>Time</tr>
                            <tr>Name</tr>
                            <tr>Weather
                            </tr>
                            <tr style={{ border: 'solid 2px #000', }}>
                                <td style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                    <table style={{ margin: 5, textAlign: 'right' }} >
                                        <tr>
                                            <td>OS</td>

                                        </tr>
                                        <tr>
                                            <td>req. admin</td>

                                        </tr>
                                        <tr>
                                            <td>req. easy</td>

                                        </tr>
                                        <tr>

                                            <td>req. medium</td>

                                        </tr>
                                        <tr>

                                            <td>req. heavy</td>
                                        </tr>
                                        <tr>

                                            <td>Impact</td>
                                        </tr>


                                        <tr>

                                            <td>Risk</td>
                                        </tr>
                                        <tr>

                                            <td>Media</td>
                                        </tr>
                                        <tr>

                                            <td>Information</td>
                                        </tr>
                                    </table>

                                </td>
                            </tr>
                        </td>
                        {
                            scenario.events.map((event, index) => {
                                return <td key={event.name} style={{ textAlign: 'center', margin: 5, padding: 2, border: 'solid 2px #000', }}>
                                    <tr><b>{DateTime.fromISO(event.datetime).toLocaleString(DateTime.DATETIME_SHORT)}</b></tr>
                                    <tr><b>{event.name}</b></tr>
                                    <tr>{returnRain(event.precipitation)}, {returnTemp(event.temperature)}
                                    </tr>
                                    <tr style={{ border: 'solid 2px #000', }}>
                                        <td style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                            {
                                                event.operatingSites.map((os, index) => {
                                                    return <table key={os.name} style={{ border: 'solid 1px #000', width: 100, margin: 5 }} >
                                                        <tr>
                                                            <td>{os.name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td >{os.requiredVolunteers.admin}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>{os.requiredVolunteers.easy}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>{os.requiredVolunteers.medium}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>{os.requiredVolunteers.admin}</td>
                                                        </tr>

                                                        <tr style={{ border: 'solid 2px #000', }}>
                                                            <td>{returnImpact(os.impact)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>{returnRisk(os.risk)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>{returnMedia(os.mediaCoverage)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>{returnInfo(os.information)}</td>
                                                        </tr>



                                                    </table>

                                                })
                                            }
                                        </td>
                                    </tr>


                                </td>

                            })
                        }


                    </table>

                } />



                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>




                    {/*<div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

                    <Timeline position="alternate">



                        {scenario.events.map((event, index) => {



                            return <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent >

                                    <div>
                                        {DateTime.fromISO(event.datetime).toLocaleString(DateTime.DATETIME_SHORT)}
                                        <p><b>{event.name}</b><br />
                                            Precipitation: {returnRain(event.precipitation)}<br />
                                            Temperature: {returnTemp(event.temperature)}<br />
                                        </p>

                                    </div>
                                    <div>
                                        {event.operatingSites.map(os => {
                                            return <p>{os.name}</p>
                                        })}
                                    </div>

                                </TimelineContent>
                            </TimelineItem>

                        })}
                    </Timeline>
                    </div>*

                    </div>

                    {
                        returnCharts()
                    }
                if (key !== 'allOS' && key !== 'latestDate' && key !== 'avgUtilForOS') {
    
                    res.push(<SingleCard collapseAll={collapsed} key={key} title={data[key].layout.title} content={<EvalPlot data={data[key]} />} />)
    
                }
    
            }
            return res
        }
        */
    /*
        if (!data) {
            return <div style={{ height: '100%', width: '100%' }}><Loader show={true} /></div>
    
        } else {
    */




    return (
        <div style={{ height: '100vh', width: '100%', margin: 0, minWidth: 500, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
            {!comparison && <DashboardMenu update={false} toggleUpdate={false} data={null} printable={latest} />}
            <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>

                {/*<H4 style={{ cursor: 'pointer', width: '100%', textAlign: 'right' }} onClick={() => { setCollapsed(!collapsed) }}>show/hide {collapsed ? <Icon icon="chevron-down" /> : <Icon icon="chevron-up" />}</H4>
                {data.latestDate && Math.round(progress * 100) < 100 && <>
                    <H6>{Math.round(progress * 100)}%</H6>
                    <ProgressBar value={progress} animate={false} intent={Intent.PRIMARY} />

                </>

                }
            */}

                { /*<div style={{ width: '100%', flexWrap: 'wrap', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Keys title="Total rejects" number={22} />
                <Keys title="Total rejects" number={22} />

                <Keys title="Total rejects" number={22} />

                <Keys title="Total rejects" number={22} />


    </div>*/}

                {!comparison && <SingleCard collapseAll={true} fullSize={true} title="Volunteer Map" content={<MovementMap />} style={{ display: comparison && 'none' }} />}

                <iframe
                    sandbox="allow-scripts allow-same-origin"
                    //ref={iframeData}
                    //onLoad={onLoad}
                    id="report"
                    src={`http://localhost:3000/d/zZR1jUA7z/iss2save-dashboard?orgId=1&var-LATEST_EXPERIMENT=${latest}&kiosk=tv`}
                    width="100%"

                    //height={height}
                    scrolling="no"
                    frameBorder="0"
                    style={{
                        height: '100%',
                        width: "100%",
                        overflow: "auto",
                    }}
                ></iframe>


            </div>
        </div >
    )
    // }
}

export default SingleDashboard
