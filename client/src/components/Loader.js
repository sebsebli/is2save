import { H6, Intent, Overlay, Spinner, SpinnerSize } from '@blueprintjs/core'
import React from 'react'

function Loader({ show }) {
    return (
        <Overlay isOpen={show} >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                <Spinner size={SpinnerSize.LARGE} intent={Intent.SUCCESS} />
                <H6 style={{margin: 20}}>Loading..</H6>
            </div>

        </Overlay>
    )
}

export default Loader
