import { Button, Callout, Card, Checkbox, Divider, Elevation, FormGroup, H5, H6, InputGroup, Intent, NumericInput, Radio, RadioGroup } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { useGlobalState } from 'state-pool';

export default function SimSettings() {
    const [simulationSettings, setSimulatinSettings, updateSimulatinSettings] = useGlobalState("simSettings");
    const [data, setData] = useState([1, 2, 3, 4])
    function norm(val, max, min) { return (val - min) / (max - min); }

    useEffect(() => {
        let nav = ((simulationSettings.navigation + 1) / 3) * (5 / 8)
        let inter = norm(simulationSettings.savingInterval, 60, 1) * (3 / 8)
        let speed = nav + inter
        let quality = 1 - ((norm(simulationSettings.savingInterval, 60, 1) + (simulationSettings.navigation + 1) / 3) / 2)
        let osInfo = 1 - norm(simulationSettings.savingInterval, 60, 1)
        let roadInfo = 1 - (((simulationSettings.navigation) / 2) + (norm(simulationSettings.savingInterval, 60, 1))) / 2

        setData([speed, quality, osInfo, roadInfo])



    }, [simulationSettings]);



    return <div style={{ height: '100%', textAlign: 'center', width: '100%', padding: 10, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <Callout title={"Info"}   >
            Changing simulation parameters will significantly affect prediction quality and simulation duration. Read the settings carefully and bear in mind the diagram.
        </Callout>


        <div style={{ marginTop: 30, height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ widht: 300, height: 300 }}>
                <Plot
                    data={[{
                        type: 'scatterpolar',
                        r: data,
                        theta: ['Speed', 'Quality', 'OS Information', 'Road Information'],
                        fill: 'toself'
                    }]}

                    layout={{
                        title: '',
                        autosize: true,
                        height: '100%',
                        width: '100%',
                        line: { shape: 'spline' },

                    }}
                    config={{ responsive: true, staticPlot: true }}
                />
            </div>
            <Card elevation={Elevation.ONE} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '80%', minWidth: 500 }}>



                <FormGroup
                    style={{ margin: 5 }}
                >
                    <H5>SEED</H5>
                    <p>
                        A pseudorandom number generator's number sequence is completely determined by the seed: thus, if a pseudorandom number generator is reinitialized with the same seed, it will produce the same sequence of numbers.</p>
                    <NumericInput
                        onValueChange={(e) => {
                            updateSimulatinSettings((simulationSettings) => {
                                console.log(e)
                                simulationSettings.seed = e
                            })

                        }}

                        value={simulationSettings.seed} disabled={simulationSettings.randomSeed} fill large id="text-input" min={1} max={9999} placeholder="default is 1" />
                    <Checkbox

                        onChange={(e) => {
                            updateSimulatinSettings((simulationSettings) => {
                                console.log(e)
                                simulationSettings.randomSeed = e.target.checked
                            })

                        }}

                        checked={simulationSettings.randomSeed} label="Random seed?" />

                </FormGroup>
                <Divider />
                <FormGroup
                    style={{ margin: 5 }}
                >
                    <H5>INTERVAL (in Simulation Time Minutes)</H5>
                    <p>
                        The interval operating site and spontaneous volunteer states (e.g., locations) will be stored in the database. The lower the interval, the more detail. However, setting a low interval will result in long simulation runs and complex calculations.</p>
                    <NumericInput

                        onValueChange={(e) => {
                            updateSimulatinSettings((simulationSettings) => {
                                console.log(e)
                                simulationSettings.savingInterval = e
                            })

                        }}
                        value={simulationSettings.savingInterval} fill large id="text-input" min={1} max={60} placeholder="default is 15" />

                </FormGroup>
               {/* <Divider />
                <FormGroup
                    style={{ margin: 5 }}
                >
                    <H5>CHOICE THRESHOLD (0.01 - 0.99)</H5>
                    <p>
                        The choice threshold describes the value an operating site of interest has to surpass to be chosen by a volunteer. If the value is less than the threshold, the volunteer will not help there. However, volunteers always take the operating site with the highest value.

                    </p>
                    <NumericInput

                        onValueChange={(e) => {
                            updateSimulatinSettings((simulationSettings) => {
                                console.log(e)
                                simulationSettings.predictionThreshold = e
                            })

                        }}

                        value={simulationSettings.predictionThreshold} fill large id="text-input" stepSize={0.01} minorStepSize={0.01} majorStepSize={0.01} min={0.01} max={0.99} placeholder="default is 0.5" />

                </FormGroup>
*/}
                <Divider />
                <RadioGroup
                    style={{ margin: 5 }}
                    inline
                    selectedValue={simulationSettings.navigation.toString()}
                    onChange={(e) => {
                        updateSimulatinSettings((simulationSettings) => {

                            simulationSettings.navigation = parseInt(e.currentTarget.value)
                        })

                    }}
                >
                    <H5>ROUTING</H5>
                    <p>
                        Routing describes the routing method used in the GIS system of the simulation. If you are interested in road utilization and congestions, use the 'realistic mode'. Bear in mind that realistic routing will result in much longer experiment times. If you are rather interested in operating site utilization, the other modes enable good results with reduced simulation time.
                    </p>
                    <Radio label="realistic mode" value='0' />
                    <Radio label="road approximations" value='1' />
                    <Radio label="straight lines" value='2' />
                </RadioGroup>
              
                <Divider />
                <Button icon="floppy-disk" large fill intent={Intent.PRIMARY} text="SAVE SETTINGS" />

            </Card>
        </div>
    </div>
}
