import { Card, Collapse, Elevation, H5, H6, Icon } from '@blueprintjs/core'
import React, { useEffect, useState } from 'react'
import useWindowDimensions from '../../helpers/BrowserSize';

function SingleCard({ title, content, fullSize, collapseAll }) {
    const { height, width } = useWindowDimensions();
    const [fullWidth, setfullWidth] = useState(fullSize);
    const [isOpen, setIsOpen] = useState(collapseAll || true)

    useEffect(() => {
        setIsOpen(collapseAll)
    }, [collapseAll]
    )


    return (
        <Card elevation={Elevation.ONE} style={{ display: 'flex', width: '100%', minWidth: fullWidth ? '100%' : 600, flex: 1, flexDirection: 'column', margin: 10 }}>


            <div onClick={() => { setIsOpen(!isOpen) }} style={{ cursor: 'pointer', padding: 3, justifyContent: 'center', background: '#000', width: '100%', display: 'flex', flexDirection: 'row' }}>
                <H5 style={{ padding: 0, margin: 0, color: '#ffffff' }} >{title} {isOpen ? <Icon icon="chevron-down" /> : <Icon icon="chevron-up" />}</H5>
            </div>
            <Collapse isOpen={isOpen} keepChildrenMounted={true}>

                <div style={{ width: '100%' }} >
                    {content}
                </div>
            </Collapse>
        </Card>
    )
}

export default SingleCard
