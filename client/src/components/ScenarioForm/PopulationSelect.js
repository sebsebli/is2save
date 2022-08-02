import { Card, H4, H5, Icon } from '@blueprintjs/core'
import React from 'react'

function PopulationSelect(props) {
    return (
        <div style={{ minHeight: 30, border: props.active ? '2px solid #457b9d' : '1px solid #457b9d', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, marginBottom: 5, cursor: 'pointer' }}
            onClick={props.setID}
        >
            <p style={{ margin: 0, color: '#457b9d' }}>{props.name}</p>

        </div>
    )
}

export default PopulationSelect
