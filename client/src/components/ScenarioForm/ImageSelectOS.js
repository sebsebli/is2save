import { H3, H5 } from '@blueprintjs/core'
import React, { useState } from 'react'
import { store, useGlobalState } from 'state-pool';

function ImageSelectOS(props) {
    const [scenario, setScenario, updateScenario] = useGlobalState("scenario");
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>

            {props.content.map(el => {

                return <div key={el.value} onClick={() => {
                    updateScenario(function (scenario) {
                        scenario.events[props.id].operatingSites[props.osID][props.type] = el.value
                    })
                }}
                    style={{ cursor: 'pointer', height: 70, margin: 15, borderRadius: 10, width: 70, border: props.selected == el.value ? '5px solid #000' : '2px solid #e4e4e4', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {el.source ? <img src={el.source} height={30} width={30} style={{ objectFit: 'contain' }} /> : <H5 style={{ padding: 0, margin: 0 }}>{el.text}</H5>}
                </div>
            })}
        </div>
    )
}

export default ImageSelectOS
