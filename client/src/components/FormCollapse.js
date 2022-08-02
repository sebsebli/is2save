import React, { useState, useEffect } from 'react'
import { NumericInput, ControlGroup, H3, TreeNodeInfo, Tree, Collapse, Pre, H4 } from "@blueprintjs/core";

function FormCollapse(props) {
    const [isCollapsed, setCollapsed] = useState(props.show)
    useEffect(() => {
        setCollapsed(props.show)
    }, [props.show])

    return (
        <div style={{margin: 10}}>
            <H4 style={{cursor:'pointer', borderBottom: 'solid 1px #c7c7c7', color:'#457b9d'}} onClick={() => { setCollapsed(!isCollapsed) }}>{props.title} {!isCollapsed ? '▾' : '▴'}</H4>
            <Collapse isOpen={isCollapsed}>
                {props.content}
            </Collapse>
        </div>
    )
}

export default FormCollapse
