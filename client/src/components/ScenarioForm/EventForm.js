import React, { useEffect, useState } from 'react'
import { NumericInput, ControlGroup, H3, H2, Tree, Classes, Pre, EditableText, Divider, Button, Tag, Toaster, Alert } from "@blueprintjs/core";
import { DateRange, DateRangeInput, DateFormatProps, TimePrecision } from "@blueprintjs/datetime";
import { Alignment, Navbar, NavbarGroup, NavbarHeading, Tab, Tabs, FormGroup, InputGroup, Card, Elevation, Callout, TextArea, Intent, Radio, RadioGroup, Position } from "@blueprintjs/core"; import { HotkeysProvider } from "@blueprintjs/core";
import { Classes as Popover2Classes, ContextMenu2, Tooltip2 } from "@blueprintjs/popover2";
import DistributionEl from './DistributionEl';
import { DatePicker } from "@blueprintjs/datetime";
import ImageSelect from './ImageSelect';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { store, useGlobalState } from 'state-pool';
import EventSelect from './EventSelect';
import { isReactNodeEmpty } from '@blueprintjs/core/lib/esm/common/utils';
import { toast } from 'react-toastify';





function EventForm(props) {
    const [scenario, setScenario, updateScenario] = useGlobalState("scenario");
    const [evtID, setEvtID] = useState(0)
    const changeTime = (datetime) => {
        let currName = scenario.events[evtID].name

        updateScenario(function (scenario) {
            let dt = new Date(datetime).toISOString();
            scenario.events[evtID].datetime = dt
            scenario.events = scenario.events.sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime))
            let id = 0
            scenario.events = scenario.events.map((item, index) => {
                if (item.name == currName) id = index
                item.id = index
                return item
            })

            setEvtID(id)

        });

    }

    return (
        <Card elevation={Elevation.ONE} style={{ widht: '100%', display: 'flex', flexDirection: 'column', padding: 20 }}>


            <Callout title={"Info"} icon="help" >
                Events will automatically be ordered by time after saving. Events describe changes, e.g. weather changes or new operating sites, in the scenario at a certain date and time.
                Start by adding events to your scenario. Subsequently, you can add operating sites to all events.
            </Callout>
            <div style={{ widht: '100%', display: 'flex', flexDirection: 'row' }}>

                <div style={{ width: '70%', padding: 10 }}>
                    <Card>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Card style={{ width: '100%', margin: 5, }}>
                                <H2><EditableText

                                    maxLength={30}
                                    multiline={false} placeholder="Enter event name..."
                                    value={scenario.events[evtID].name}
                                    onChange={(val) => {


                                        updateScenario(function (scenario) {
                                            scenario.events[evtID].name = val;
                                        });



                                    }}
                                    minWidth="100%" /></H2>

                                <FormGroup
                                    helperText="Describe the event to enable third parties to understand it."
                                    label="Description"
                                    labelFor="description"
                                    labelInfo="(required)"
                                >
                                    <TextArea
                                        placeholder="A new event happened. The flood is getting worse."
                                        id="description"
                                        growVertically={true}
                                        large={false}
                                        fill={true}
                                        minLength={2}
                                        maxLength={250}
                                        value={scenario.events[evtID].description}
                                        style={{ height: '100%', minHeight: 200 }}
                                        onChange={(ev) => {

                                            updateScenario(function (scenario) {
                                                scenario.events[evtID].description = ev.target.value;
                                            });

                                        }}
                                    />
                                </FormGroup>
                            </Card>
                            <Card style={{ margin: 5, }}>

                                <FormGroup
                                    label="Date and time of Event"
                                    labelFor="datetime"
                                    labelInfo="(required)"
                                >
                                    <DatePicker
                                        id="datetime"
                                        style={{ padding: 10 }}
                                        formatDate={date => date.toLocaleString()}
                                        parseDate={str => new Date(str)}
                                        timePrecision={TimePrecision.MINUTE}
                                        highlightCurrentDay={false}
                                        value={new Date(scenario.events[evtID].datetime)}
                                        defaultValue={new Date(scenario.duration.startDate)}
                                        minDate={new Date(scenario.duration.startDate)}
                                        maxDate={new Date(scenario.duration.endDate)}

                                        onChange={(datetime) => {
                                            changeTime(datetime)


                                        }}


                                    />
                                </FormGroup>
                            </Card>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                            <Card style={{ margin: 5, width: '50%' }}>

                                <FormGroup
                                    label="Temperature"
                                    helperText="The temperature at event time. Choice of hot, moderate and cold."
                                    labelFor="temperature"
                                    labelInfo="(required)"
                                >
                                    <ImageSelect
                                        id={evtID}
                                        selected={scenario.events[evtID].temperature}

                                        type="temperature"
                                        content={[
                                            {
                                                source: require('../../assets/images/sun-warm.png'),
                                                value: 3
                                            },

                                            {
                                                source: require('../../assets/images/day-cloudy.png'),
                                                value: 2
                                            },
                                            {
                                                source: require('../../assets/images/christmas-snow.png'),
                                                value: 1
                                            },
                                        ]}
                                    />
                                </FormGroup>
                            </Card>

                            <Card style={{ margin: 5, width: '50%' }}>

                                <FormGroup
                                    label="Precipitation"
                                    helperText="The precipitation at event time. Choice of none, low and strong."
                                    labelFor="temperature"
                                    labelInfo="(required)"
                                >
                                    <ImageSelect
                                        id={evtID}
                                        selected={scenario.events[evtID].precipitation}
                                        type="precipitation"
                                        content={[
                                            {
                                                source: require('../../assets/images/icons8-no-rain-90.png'),
                                                value: 1
                                            },
                                            {
                                                source: require('../../assets/images/day-cloud-rain.png'),
                                                value: 2
                                            },
                                            {
                                                source: require('../../assets/images/cloud-rain-lightning.png'),
                                                value: 3
                                            }
                                        ]}
                                    />
                                </FormGroup>
                            </Card>
                        </div>




                    </Card>


                </div>
                <div style={{ width: '30%', padding: 10, height: '100%', overflowY: 'scroll' }}>
                    <div style={{ display: 'flex', width: '100%', flexDirection: 'row-reverse', padding: 5, justifyContent: 'flex-end' }}>
                        <Button icon="trash"

                            onClick={() => {
                                if (scenario.events.length <= 1) {

                                    toast.error('Minimum one event required!', {
                                        position: "bottom-right",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                    });


                                    return
                                }

                                updateScenario(function (scenario) {
                                    scenario.events.splice(evtID, 1)


                                    scenario.events = scenario.events.sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime))
                                    scenario.events = scenario.events.map((item, index) => {
                                        item.id = index
                                        return item
                                    })

                                    setEvtID(scenario.events.length - 1)
                                })
                            }
                            }

                            alignText={Alignment.RIGHT} text="Delete" minimal outlined />
                        <Button icon="new-link"

                            onClick={() => {
                                updateScenario(function (scenario) {

                                    let temp = { ...scenario.events[evtID] }
                                    temp.name = temp.name + ' Copy'
                                    temp.id = scenario.events.length;
                                    temp.datetime = scenario.duration.endDate
                                    scenario.events.push(temp)



                                    scenario.events = scenario.events.sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime))
                                    scenario.events = scenario.events.map((item, index) => {
                                        item.id = index
                                        return item
                                    })

                                    setEvtID(scenario.events.length - 1)



                                })


                            }}

                            alignText={Alignment.RIGHT} text="Add" minimal outlined />


                    </div>

                    {
                        scenario.events.map((item, index) => {
                            return <EventSelect key={item.name} date={item.datetime} name={item.name} id={item.id} active={evtID == item.id ? true : false} setID={() => setEvtID(item.id)} />
                        })


                    }
                    {/**   <Tree
                    contents={nodes}
                    onNodeClick={handleNodeClick}
                    onNodeCollapse={handleNodeCollapse}
                    onNodeExpand={handleNodeExpand}
                    className={Classes.ELEVATION_0}
                /> */}
                </div>
            </div>
        </Card>
    )
}

export default EventForm
