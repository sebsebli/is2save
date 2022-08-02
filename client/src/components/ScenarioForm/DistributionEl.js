import { Callout, Card, ControlGroup, FormGroup, Label, NumericInput, Position } from '@blueprintjs/core'
import React from 'react'
import { store, useGlobalState } from 'state-pool';

function DistributionEl(props) {
    const [scenario, setScenario, updateScenario] = useGlobalState("scenario");

    return (
        <Card style={{ flex: 1, margin: 5 }}>
            {
                props.fitness && <Callout title={"Info!"} icon="warning-sign" intent='warning' style={{ marginBottom: 10 }}>
                    The sum must be 100!
                </Callout>

            }
            <FormGroup
                helperText={props.helperText}
                label={props.label}
                labelInfo={props.labelInfo}

            >
                <ControlGroup style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {props.content.map(el => {
                        let value = scenario.populations[props.id][props.distributionType][el.id]
                        return <Label style={{ flex: 1 }}>{el.placeholder}<NumericInput id={el.id} defaultValue={el.defaultValue}
                            key={el.id}
                            min={0}
                            max={50000}
                            allowNumericCharactersOnly
                            placeholder={el.placeholder}
                            buttonPosition={"none"}
                            large
                            fill
                            value={value}
                            onValueChange={(val) => {
                                updateScenario(function (scenario) {
                                    scenario.populations[props.id][props.distributionType][el.id] = val;
                                });

                            }}
                        />
                        </Label>

                    })}



                </ControlGroup>
            </FormGroup>
        </Card>
    )
}

export default DistributionEl
