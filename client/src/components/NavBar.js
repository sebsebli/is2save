import React from 'react'
import {
    Alignment,
    Button,
    Classes,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    MenuItem,
    Menu,
    MenuDivider,
    H6
} from "@blueprintjs/core";
import {
    Popover2SharedProps,
    Placement,
    PlacementOptions,
    Popover2,
    Popover2InteractionKind,
    StrictModifierNames,
} from "@blueprintjs/popover2";

import {

    useNavigate
} from "react-router-dom";
function NavBar() {
    const navigate = useNavigate()
    return (
        <Navbar style={{ zIndex: 1000 }}>
            <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading>IS2SaVe</NavbarHeading>
                <NavbarDivider />
                <Button className={Classes.MINIMAL} icon="home" text="Home" onClick={() => { navigate('/') }} />
                <Button className={Classes.MINIMAL} icon="application" text="Scenario Editor" onClick={() => { navigate('/editor') }} />
                <Button className={Classes.MINIMAL} icon="cog" text="Simulation Settings" onClick={() => { navigate('/simulation') }} />
                <Button className={Classes.MINIMAL} icon="dashboard" text="Dashboard" onClick={() => { navigate('/dashboard') }} />
                <Button className={Classes.MINIMAL} icon="join-table" text="Comparison" onClick={() => { navigate('/compare') }} />

                <NavbarDivider />



            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
                <H6 style={{ padding: 0, margin: 0, color: '#1d3557' }}>Logged in as: <span style={{ fontWeight: 'normal' }}>Sebastian</span></H6>
                <Popover2 className={Classes.MINIMAL} icon="cog" content={<Menu>
                    <MenuItem text="Settings..." icon="cog" />

                    <MenuDivider />
                    <MenuItem icon="log-out" text="Logout" intent="danger" />

                </Menu>} >
                    <Button className={Classes.MINIMAL} icon="user" />
                </Popover2>
                <NavbarDivider />

                <Popover2 className={Classes.MINIMAL} content={<Menu>
                    <MenuItem text="EN" />
                    <MenuItem text="DE" />



                </Menu>} >
                    <Button className={Classes.MINIMAL} text="EN" />
                </Popover2>
            </NavbarGroup>
        </Navbar>
    )
}

export default NavBar
