import React, { useState } from 'react'
import { NumericInput, ControlGroup, H2, H3, Tree, Classes, Pre, EditableText, Divider, Button, Tag, Checkbox, Icon } from "@blueprintjs/core";
import { DateRange, DateRangeInput, DateFormatProps, TimePrecision } from "@blueprintjs/datetime";
import { Alignment, Navbar, NavbarGroup, NavbarHeading, Tab, Tabs, FormGroup, InputGroup, Card, Elevation, Callout, TextArea, Intent, Radio, RadioGroup, Position } from "@blueprintjs/core"; import { HotkeysProvider } from "@blueprintjs/core";
import { Classes as Popover2Classes, ContextMenu2, Tooltip2 } from "@blueprintjs/popover2";
import DistributionElOs from './DistributionElOs';
import { DatePicker } from "@blueprintjs/datetime";
import ImageSelectOS from './ImageSelectOS';
import { useImmer } from "use-immer";
import { store, useGlobalState } from 'state-pool';


import { toast } from 'react-toastify';


function OperatingSiteForm(props) {
    const [scenario, setScenario, updateScenario] = useGlobalState("scenario");

    const [evtID, setEvtID] = useState(0)
    const [osID, setOsID] = useState(0)
    const [currSelected, setCurrSelected] = useState([])


    return (
        <Card elevation={Elevation.ONE} style={{
            widht: '100%', overflow: 'hidden',
            maxHeight: 'max-content', display: 'flex', flexDirection: 'column', padding: 20
        }}>
            <Callout title={"Info"} icon="help" >
                You can create operating sites here and add them to the events. If you want operating sites to be persistent over several events, make sure they all have the same name. You can still change operating site parameters for each event. Click on the operating site you want to edit.
            </Callout>
            <div style={{ widht: '100%', display: 'flex', flexDirection: 'row' }}>

                <div style={{ width: '70%', padding: 10 }}>
                    <Card >
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Card style={{ width: '100%', margin: 5, }}>
                                <p>Event: {scenario.events[evtID].name}</p>
                                <H2><EditableText

                                    maxLength={30}
                                    value={scenario.events[evtID].operatingSites[osID].name}
                                    onChange={(val) => {
                                        updateScenario(function (scenario) {
                                            scenario.events[evtID].operatingSites[osID].name = val;
                                        });



                                    }}

                                    multiline={false} placeholder="Enter operating site name..." minWidth="100%" /></H2>


                            </Card>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                            <Card style={{ margin: 5, width: '50%' }}>

                                <FormGroup
                                    label="Impact"
                                    helperText="The impact of the disaster at the operating site."
                                    labelFor="impact"
                                    labelInfo="(required)"



                                >
                                    <ImageSelectOS
                                        id={evtID}
                                        osID={osID}
                                        selected={scenario.events[evtID].operatingSites[osID].impact}
                                        type="impact"
                                        content={[
                                            {
                                                text: "low",
                                                value: 1
                                            },
                                            {
                                                text: "medium",
                                                value: 2
                                            },
                                            {
                                                text: "severe",
                                                value: 3
                                            }
                                        ]}
                                    />
                                </FormGroup>
                            </Card>

                            <Card style={{ margin: 5, width: '50%' }}>

                                <FormGroup
                                    label="Risk"
                                    helperText="The risk for spontaneous volunteers at the operating site."
                                    labelFor="risk"
                                    labelInfo="(required)"
                                >
                                    <ImageSelectOS
                                        id={evtID}
                                        osID={osID}
                                        selected={scenario.events[evtID].operatingSites[osID].risk}
                                        type="risk"

                                        content={[
                                            {
                                                text: "none",
                                                value: 1
                                            },
                                            {
                                                text: "low",
                                                value: 2
                                            },
                                            {
                                                text: "high",
                                                value: 3
                                            }
                                        ]}
                                    />
                                </FormGroup>
                            </Card>


                        </div>



                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>


                            <Card style={{ margin: 5, width: '50%' }}>

                                <FormGroup
                                    label="Information"
                                    helperText="Information (like task requirements) that the spontaneous volunteers have about the operating site."
                                    labelFor="information"
                                    labelInfo="(required)"
                                >
                                    <ImageSelectOS
                                        id={evtID}
                                        osID={osID}
                                        selected={scenario.events[evtID].operatingSites[osID].information}
                                        type="information"

                                        content={[
                                            {
                                                text: "none",
                                                value: 1
                                            },
                                            {
                                                text: "few",
                                                value: 2
                                            },
                                            {
                                                text: "full",
                                                value: 3
                                            }
                                        ]}
                                    />
                                </FormGroup>
                            </Card>
                            <Card style={{ margin: 5, width: '50%' }}>

                                <FormGroup
                                    label="Media coverage"
                                    helperText="Represents how strong media (or social media) is reporting about the operating site."
                                    labelFor="mediaCoverage"
                                    labelInfo="(required)"
                                >
                                    <ImageSelectOS
                                        id={evtID}
                                        osID={osID}
                                        selected={scenario.events[evtID].operatingSites[osID].mediaCoverage}
                                        type="mediaCoverage"

                                        content={[
                                            {
                                                text: "none",
                                                value: 1
                                            },
                                            {
                                                text: "low",
                                                value: 2
                                            },
                                            {
                                                text: "strong",
                                                value: 3
                                            }
                                        ]}
                                    />
                                </FormGroup>
                            </Card>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>

                            <DistributionElOs
                                id={evtID}
                                osID={osID}
                                distributionType="requiredVolunteers"

                                helperText="Number of required volunteers per task."
                                label="Required volunteers"
                                labelInfo="(required)"
                                content={
                                    [
                                        {
                                            id: "admin",

                                            placeholder: 'Administrative',
                                        },
                                        {
                                            id: "easy",

                                            placeholder: 'Easy',
                                        },
                                        {
                                            id: "medium",


                                            placeholder: 'Medium',
                                        }, {
                                            id: "heavy",


                                            placeholder: 'Heavy',
                                        }
                                    ]
                                }
                            />


                        </div>







                    </Card>


                </div >
                <div style={{
                    width: '30%', padding: 10, overflow: 'auto',
                    height: '*',
                    maxHeight: 'max-content'
                }}>

                    <div style={{ display: 'flex', width: '100%', flexDirection: 'row-reverse', padding: 5, justifyContent: 'flex-end' }}>
                        <Button icon="trash" alignText={Alignment.RIGHT} text="Delete" minimal outlined

                            onClick={() => {
                                try {
                                    setOsID(0)


                                    updateScenario(function (scenario) {
                                        let currentOSName = scenario.events[evtID].operatingSites[osID].name


                                        for (let ev = 0; ev < currSelected.length; ev++) {
                                            let filtered = scenario.events[currSelected[ev]].operatingSites.filter(item => item.name === currentOSName)
                                            console.log((scenario.events[currSelected[ev]].operatingSites.length > 1), (filtered.length > 0), filtered, currSelected[ev])

                                            if (
                                                (scenario.events[currSelected[ev]].operatingSites.length > 1) &&
                                                (filtered.length > 0)
                                            ) {
                                                scenario.events[currSelected[ev]].operatingSites.splice(filtered[0].id, 1)
                                            }
                                        }
                                        for (let ev = 0; ev < scenario.events.length; ev++) {

                                            scenario.events[ev].operatingSites = scenario.events[ev].operatingSites.map((item, index) => {
                                                item.id = index
                                                return item
                                            })
                                        }

                                    })
                                } catch (err) {
                                    console.log(err)
                                }







                            }}

                        />
                        <Button icon="new-link" alignText={Alignment.RIGHT} text="Add" minimal outlined onClick={() => {
                            updateScenario(function (scenario) {
                                for (let ev = 0; ev < currSelected.length; ev++) {
                                    let tempOS = { ...scenario.events[evtID].operatingSites[osID] }
                                    let filtered = scenario.events[currSelected[ev]].operatingSites.filter(item => item.name === tempOS.name)
                                    if (filtered.length > 0) {
                                        toast.error('Operating site with name ' + tempOS.name + ' already exists in ' + scenario.events[currSelected[ev]].name + '!', {
                                            position: "bottom-right",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                        });
                                    } else {
                                        scenario.events[currSelected[ev]].operatingSites.push(tempOS)
                                    }
                                }
                                for (let ev = 0; ev < scenario.events.length; ev++) {

                                    scenario.events[ev].operatingSites = scenario.events[ev].operatingSites.map((item, index) => {
                                        item.id = index
                                        return item
                                    })
                                }

                            })
                        }} />
                        <Button icon="add" alignText={Alignment.RIGHT} text="New" minimal outlined onClick={async () => {
                            updateScenario(function (scenario) {
                                let tempOS = { ...scenario.events[evtID].operatingSites[osID] }
                                tempOS.name = "NEW OPERATING SITE"
                                tempOS.id = scenario.events[evtID].operatingSites.length;
                                scenario.events[evtID].operatingSites.push(tempOS)
                                for (let ev = 0; ev < scenario.events.length; ev++) {

                                    scenario.events[ev].operatingSites = scenario.events[ev].operatingSites.map((item, index) => {
                                        item.id = index
                                        return item
                                    })
                                }

                                setOsID(tempOS.id)
                            })



                        }} />
                        <Checkbox checked={currSelected.length == scenario.events.length}

                            inline
                            style={{

                                margin: 7
                            }}
                            onChange={() => {
                                console.log(currSelected.length, scenario.events.length)
                                if (currSelected.length >= scenario.events.length) {
                                    setCurrSelected([]);

                                    return
                                }
                                for (let i = 0; i < scenario.events.length; i++) {
                                    if (!currSelected.includes(scenario.events[i].id))
                                        setCurrSelected(currSelected => [...currSelected, scenario.events[i].id]);

                                }
                            }} >
                            Select all
                        </Checkbox>
                    </div>
                    {
                        scenario.events.map((event) => {
                            return (
                                <div key={event.name} style={{ borderBottom: '1px solid #457b9d', width: '100%', minHeight: 30, flexDirection: 'row', justifyContent: 'center', display: 'flex', marginBottom: 5, }}>
                                    <div style={{
                                        width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center',

                                    }}




                                    >
                                        <Checkbox checked={currSelected.includes(event.id)}

                                            inline
                                            style={{

                                                margin: 0
                                            }}
                                            onChange={() => {
                                                if (currSelected.includes(event.id)) {
                                                    setCurrSelected(currSelected.filter(item => item !== event.id));

                                                } else {


                                                    setCurrSelected(currSelected => [...currSelected, event.id]);

                                                }
                                            }} large>

                                        </Checkbox>
                                    </div>
                                    <div style={{ width: '100%', padding: 5, minHeight: 30, flexDirection: 'column', justifyContent: 'center', display: 'flex', marginBottom: 5, }}

                                    >
                                        <p style={{ margin: 0, color: '#457b9d' }}>{event.name}</p>

                                        <div style={{ margin: 5, flexDirection: 'row' }}>

                                            {
                                                event.operatingSites.map((operatingSite) => {
                                                    return (

                                                        <Tag key={operatingSite.id} icon="map-marker" onClick={() => {
                                                            setEvtID(event.id)
                                                            setOsID(operatingSite.id)
                                                        }} round interactive onRemove={async () => {
                                                            try {
                                                                let el = await scenario.events[event.id].operatingSites[operatingSite.id]
                                                                if (scenario.events[event.id].operatingSites.length <= 1) {
                                                                    toast.error('Minimum one OS required!', {
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
                                                                    console.log(scenario.events[event.id].operatingSites[operatingSite.id])

                                                                    scenario.events[event.id].operatingSites.splice(operatingSite.id, 1)

                                                                    scenario.events[event.id].operatingSites = scenario.events[event.id].operatingSites.map((item, index) => {
                                                                        item.id = index
                                                                        return item
                                                                    })

                                                                    setOsID(0)
                                                                })
                                                            } catch (err) {
                                                                console.error(err)
                                                            }
                                                        }} style={{ margin: 5 }}>{operatingSite.name}</Tag>

                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>



                            )


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
            </div >
        </Card >
    )
}

export default OperatingSiteForm
