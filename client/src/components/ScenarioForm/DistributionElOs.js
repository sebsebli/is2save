import { Card, ControlGroup, FormGroup, Label, NumericInput, Position } from '@blueprintjs/core'
import React from 'react'
import { store, useGlobalState } from 'state-pool';

function DistributionElOs(props) {
    const [scenario, setScenario, updateScenario] = useGlobalState("scenario");

    return (
        <Card style={{ margin: 5, width: '100%' }}>
            <FormGroup
                helperText={props.helperText}
                label={props.label}
                labelInfo={props.labelInfo}

            >
                <ControlGroup >

                    {props.content.map(el => {
                        return <Label style={{ flex: 1 }}>{el.placeholder}<NumericInput id={el.id} defaultValue={el.defaultValue}
                            key={el.id}
                            allowNumericCharactersOnly
                            placeholder={el.placeholder}
                            buttonPosition={"none"}
                            large
                            fill
                            value={scenario.events[props.id].operatingSites[props.osID][props.distributionType][el.id]}

                            onValueChange={(val) => {
                                updateScenario(function (scenario) {
                                    scenario.events[props.id].operatingSites[props.osID][props.distributionType][el.id] = val
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

export default DistributionElOs
