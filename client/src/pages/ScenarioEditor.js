import React, { useState } from 'react'
import { Alignment, Navbar, NavbarGroup, NavbarHeading, Tab, Tabs, FormGroup, InputGroup, Card, Elevation, Callout, TextArea, Intent, Radio, RadioGroup, Position, Drawer, DrawerSize, IconSize, H4, MultistepDialog, DialogStep, Button, Icon } from "@blueprintjs/core";
import ScenarioMenu from '../components/ScenarioMenu';

import { Stepper, Step } from 'react-form-stepper';

import ScenarioForm from './ScenarioForm';

function ScenarioEditor({ setSaved }) {
   


    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <ScenarioMenu setSaved={setSaved} />
            <Callout title={"Read before you start!"} icon="warning-sign" intent='warning' >
                Save your scenario before leaving the page. You can download a local copy of your scenario or store the files on our server!<br/>
               <br/>
                <b>1 Create scenario &#10142; 2 Validate scenario &#10142; 3 Run experiment</b>
            </Callout>
       

            
            <Card>
                <ScenarioForm />



            </Card>
        </div>
    )
}

export default ScenarioEditor
