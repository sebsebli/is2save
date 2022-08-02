import React, { useState } from 'react'
import { NumericInput, ControlGroup, Icon, TreeNodeInfo, Tree, Collapse, Pre, H5, EditableText, H2 } from "@blueprintjs/core";
import { DateRange, DateRangeInput, DateFormatProps, TimePrecision } from "@blueprintjs/datetime";
import { Alignment, Navbar, NavbarGroup, NavbarHeading, Tab, Tabs, FormGroup, InputGroup, Card, Elevation, Callout, TextArea, Intent, Radio, RadioGroup, Position } from "@blueprintjs/core";
import { useImmer } from "use-immer";
import { store, useGlobalState } from 'state-pool';

function GeneralForm(props) {
    const [scenario, setScenario, updateScenario] = useGlobalState("scenario");

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

    return (
        <Card
            elevation={Elevation.ONE}>


            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <H5>Identifier: <EditableText 
                maxLength={30}
                
                multiline={false} placeholder="Enter a unique ID" value={scenario.id} minWidth="100%"

                    onChange={(val) => {
                        updateScenario(function (scenario) {
                            scenario.id = val;
                        });



                    }}

                /></H5>
                <H2>Name: <EditableText 
                      maxLength={40}
                multiline={false} placeholder="Enter scenario title..." value={scenario.title} minWidth="100%"

                    onChange={(val) => {
                        updateScenario(function (scenario) {
                            scenario.title = val;
                        });



                    }}

                /></H2>
            </div>



            <FormGroup
                helperText="Describe the scenario to enable third parties to understand it."
                label="Description"
                labelFor="description"
                labelInfo="(required)"
            >
                <TextArea
                    placeholder="This scenario happens in the City of Halle (Saale). 2,000 volunteers arrive at 8 operating sites within 3 days."
                    id="description"
                    growVertically={true}
                    large={false}
                    fill={true}
                    value={scenario.description}
                    minLength={2}
                    maxLength={250}
                    onChange={(ev) => {

                        updateScenario(function (scenario) {
                            scenario.description = ev.target.value

                        });

                    }}
                />
            </FormGroup>

            <FormGroup
                helperText="Describes the start and end of the scenario."
                label="The duration of the disaster"
                labelFor="duration"
                labelInfo="(required)"
            >
                <DateRangeInput
                    id="duration"
                    style={{ padding: 10 }}
                    formatDate={date => date.toLocaleString()}
                    parseDate={str => new Date(str)}
                    onChange={(dateRange) => {
                        updateScenario(function (scenario) {
                            scenario.duration.startDate = new Date(dateRange[0]).toISOString();
                            scenario.duration.endDate = new Date(dateRange[1]).toISOString();

                        });
                    }}
                    value={[new Date(scenario.duration.startDate), new Date(scenario.duration.endDate)]}
                    timePrecision={TimePrecision.MINUTE}
                    highlightCurrentDay={true}

                />
            </FormGroup>

            <FormGroup
                helperText="Currently, we only support flood disaster."
                label="Type of disaster"
                labelInfo="(required)"
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
            >
                <RadioGroup inline
                    selectedValue="flood"
                    onChange={() => { }}
                >
                    <Radio label="Flood" value="flood" />
                    <Radio label="Storm" value="storm" disabled />
                    <Radio label="Blackout" value="blackout" disabled />
                    <Radio label="Bushfire" value="bushfire" disabled />
                    <Radio label="Tsunami" value="tsunami" disabled />
                    <Radio label="Earthquake" value="earthquake" disabled />

                </RadioGroup>
            </FormGroup>








        </Card>
    )
}

export default GeneralForm
