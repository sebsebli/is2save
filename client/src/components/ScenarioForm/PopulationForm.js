import React, { useState } from 'react'
import { NumericInput, H2, H3, H4, Tree, Classes, Pre, EditableText, Divider, Button, Collapse } from "@blueprintjs/core";
import { DateRange, DateRangeInput, DateFormatProps, TimePrecision } from "@blueprintjs/datetime";
import { Alignment, Navbar, NavbarGroup, NavbarHeading, Tab, Tabs, FormGroup, InputGroup, Card, Elevation, Callout, TextArea, Intent, Radio, RadioGroup, Position } from "@blueprintjs/core"; import { HotkeysProvider } from "@blueprintjs/core";
import { Classes as Popover2Classes, ContextMenu2, Tooltip2 } from "@blueprintjs/popover2";
import DistributionEl from './DistributionEl';
import { useImmer } from "use-immer";
import { store, useGlobalState } from 'state-pool';
import PopulationSelect from './PopulationSelect';
import { toast } from 'react-toastify';



function PopulationForm(props) {
    const [scenario, setScenario, updateScenario] = useGlobalState("scenario");
    const [popID, setPopID] = useState(0)
    const [isOpen, setIsOpen] = React.useState(false)



    return (



        <Card elevation={Elevation.ONE} style={{ widht: '100%', display: 'flex', padding: 20, flexDirection: 'column' }}>
            <Callout title={"Warning!"} icon="warning-sign" intent='danger' style={{ marginBottom: 10, width: '100%', flex: 1 }}>
                Depending on the hardware the total number of volunteers may increase the simulation time drastically (up to several hours). We suggest a lower number of volunteers (max. 1000) if you're interested in quick approximations.
            </Callout>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '70%', padding: 10 }}>
                    <Card  >

                        <H2><EditableText maxLength={20} multiline={false} placeholder="Enter population name..." minWidth="100%"
                            value={scenario.populations[popID].name}
                            onChange={(val) => {
                                updateScenario(function (scenario) {
                                    scenario.populations[popID].name = val;
                                });



                            }}
                        /></H2>


                        <FormGroup
                            helperText="The number of spontaneous volunteers in this population."
                            label="Size of population"
                            labelFor="number"
                            labelInfo="(required)"
                        >
                            <NumericInput id="number" defaultValue={1000}
                                min={1}
                                max={50000}
                                leftIcon="people"
                                allowNumericCharactersOnly
                                fill
                                style={{ fontSize: 16 }}
                                buttonPosition={Position.RIGHT}
                                value={scenario.populations[popID].number}
                                onValueChange={(val) => {
                                    updateScenario(function (scenario) {
                                        scenario.populations[popID].number = val;
                                    });

                                }}
                            />
                        </FormGroup>
                        <Button rightIcon={isOpen ? "caret-up" : "caret-down"} onClick={() => setIsOpen(!isOpen)}>advanced</Button>

                        <Collapse isOpen={isOpen}>

                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                                <DistributionEl id={popID}
                                    fitness={true}
                                    helperText="ADMIN: e.g. documenting, situation monitoring, counting people, EASY:  e.g. carrying things, providing food and water, MEDIUM: e.g. filling sandbags, HEAVY: e.g. carrying sandbags"
                                    label="Fitness in % (e.g. 20)"
                                    labelInfo="(required)"
                                    distributionType="fitnessDistribution"
                                    content={
                                        [
                                            {
                                                id: "admin",

                                                placeholder: 'admin tasks',
                                            },
                                            {
                                                id: "easy",


                                                placeholder: 'easy tasks',
                                            }, {
                                                id: "medium",


                                                placeholder: 'medium tasks',
                                            }, {
                                                id: "heavy",


                                                placeholder: 'heavy tasks',
                                            }

                                        ]
                                    }
                                />
                                <DistributionEl id={popID} helperText="Describes the number of friends each volunteer can have."
                                    label="Number of friends"
                                    labelInfo="(required)"
                                    distributionType="friendsDistribution"

                                    content={
                                        [
                                            {
                                                id: "min",

                                                placeholder: 'Minimum',
                                            },
                                            {
                                                id: "mod",


                                                placeholder: 'Modus',
                                            }, {
                                                id: "max",


                                                placeholder: 'Maximum',
                                            }
                                        ]
                                    }
                                />

                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>

                                <DistributionEl id={popID} helperText="The number of hours per day that a spontaneous volunteer is helping at an operating site before resting at home."
                                    label="Hours of help per day"
                                    labelInfo="(required)"
                                    distributionType="helpTimeDistribution"

                                    content={
                                        [
                                            {
                                                id: "min",

                                                placeholder: 'Minimum',
                                            },
                                            {
                                                id: "mod",


                                                placeholder: 'Modus',
                                            }, {
                                                id: "max",


                                                placeholder: 'Maximum',
                                            }
                                        ]
                                    }
                                />


                                <DistributionEl id={popID} helperText="The number of days that a spontaneous volunteer is willing to help if not aborted due to other reasons."
                                    label="Days of help in scenario"
                                    labelInfo="(required)"
                                    distributionType="helpDurationDistribution"

                                    content={
                                        [
                                            {
                                                id: "min",

                                                placeholder: 'Minimum',
                                            },
                                            {
                                                id: "mod",


                                                placeholder: 'Modus',
                                            }, {
                                                id: "max",


                                                placeholder: 'Maximum',
                                            }
                                        ]
                                    }
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>


                                <DistributionEl id={popID} helperText="The number of hours that a spontaneous volunteer is resting at home before he potentially starts new helping activities."
                                    label="Hours of resting"
                                    labelInfo="(required)"
                                    distributionType="restingDurationDistribution"

                                    content={
                                        [
                                            {
                                                id: "min",

                                                placeholder: 'Minimum',
                                            },
                                            {
                                                id: "mod",


                                                placeholder: 'Modus',
                                            }, {
                                                id: "max",


                                                placeholder: 'Maximum',
                                            }
                                        ]
                                    }
                                />


                                <DistributionEl id={popID} helperText="The number of rejects a day after that a spontaneous volunteer is not willling to help anymore."
                                    label="Number of acceptable rejects per day"
                                    labelInfo="(required)"
                                    distributionType="acceptableRejectsDayDistribution"

                                    content={
                                        [
                                            {
                                                id: "min",

                                                placeholder: 'Minimum',
                                            },
                                            {
                                                id: "mod",


                                                placeholder: 'Modus',
                                            }, {
                                                id: "max",


                                                placeholder: 'Maximum',
                                            }
                                        ]
                                    }
                                />
                            </div>

                            <DistributionEl id={popID} helperText="The number of rejects in a scenario after that a spontaneous volunteer stops all helping activities."
                                label="Maximum number of acceptable rejects in scenario"
                                labelInfo="(required)"
                                distributionType="acceptableRejectsGeneralDistribution"

                                content={
                                    [
                                        {
                                            id: "min",

                                            placeholder: 'Minimum',
                                        },
                                        {
                                            id: "mod",


                                            placeholder: 'Modus',
                                        }, {
                                            id: "max",


                                            placeholder: 'Maximum',
                                        }
                                    ]
                                }
                            />


                        </Collapse>



                    </Card>


                </div>
                <div style={{ width: '30%', padding: 10 }}>
                    <div style={{ display: 'flex', width: '100%', flexDirection: 'row-reverse', padding: 5, justifyContent: 'flex-end' }}>
                        <Button

                            onClick={() => {
                                if (scenario.populations.length <= 1) {

                                    toast.error('Minimum one population required!', {
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
                                    scenario.populations.splice(popID, 1)


                                    scenario.populations = scenario.populations.sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime))
                                    scenario.populations = scenario.populations.map((item, index) => {
                                        item.id = index
                                        return item
                                    })

                                    setPopID(0)
                                })
                            }
                            }

                            icon="trash" alignText={Alignment.RIGHT} text="Delete" minimal outlined />
                        <Button


                            onClick={() => {
                                updateScenario(function (scenario) {

                                    let temp = { ...scenario.populations[popID] }
                                    temp.name = temp.name + ' Copy'
                                    temp.id = scenario.populations.length;
                                    scenario.populations.push(temp)




                                    setPopID(temp.id)



                                })


                            }}


                            icon="new-link" alignText={Alignment.RIGHT} text="Add" minimal outlined />

                    </div>
                    {
                        scenario.populations.map((item) => {
                            return <PopulationSelect key={item.name} name={item.name} id={item.id} active={popID == item.id ? true : false} setID={() => setPopID(item.id)} />
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
        </Card >

    )
}

export default PopulationForm
