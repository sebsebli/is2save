import React, { useEffect, useRef } from 'react'
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
    Checkbox,
    Icon
} from "@blueprintjs/core";
import {
    Popover2SharedProps,
    Placement,
    PlacementOptions,
    Popover2,
    Popover2InteractionKind,
    StrictModifierNames,
} from "@blueprintjs/popover2";
import defaultScenario from '../assets/defaultScenario.json'
import schema from '../assets/SVCSDL.json'
import { generateSlug } from "random-word-slugs";
import JsPDF from 'jspdf';

import { html2canvas } from 'html2canvas'
import { store, useGlobalState } from 'state-pool';
import { toast } from 'react-toastify';
import {

    useNavigate
} from "react-router-dom";
import { toPng } from 'html-to-image';

function DashboardMenu({ update, toggleUpdate, data, printable }) {
    const navigate = useNavigate()

    const [scenario, setScenario, updateScenario] = useGlobalState("scenario");
    const [mapImage, setMapImage, updateMapImage] = useGlobalState("mapImage");
    const [simulationSettings, setSimulatinSettings, updateSimulatinSettings] = useGlobalState("simSettings");

    const downloadScenario = async () => {
        const fileDownload = {
            data: data,
            scenario: scenario,
            map: mapImage,
            settings: simulationSettings
        }
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(fileDownload, null, 0)], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = new Date().toISOString() + '_' + scenario.id + ".is2save";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();

    }
    function getPDF(url) {
        return fetch('http://localhost:2020/createPDF', {
            method: 'POST', // or 'PUT'
            headers: {
                'Accept': 'application/pdf',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url }),
        })
    }
    const generatePDF = () => {
        const fileName = new Date().toISOString().substring(0, 10) + " IS2SaVe-Report.pdf"
        return getPDF(`http://localhost:3000/d/zZR1jUA7z/iss2save-dashboard?orgId=1&var-LATEST_EXPERIMENT=${printable}&kiosk`) // API call
            .then(response => response.blob())
            .then(function (myBlob) {
                const blob = new Blob([myBlob], { type: 'application/pdf' })
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = fileName
                link.click()
            })
            .catch(err => console.log("ERROR"))



    }

    const updateMap = async () => {
        toast.success('Generating paths on server..', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });



        const response = await fetch(
            'http://localhost:2020/generateLocations'
        );


        if (response.status == 200) {
            toast.success('Paths loaded.. please reload', {
                position: "top-center",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate('/dashboard')
        } else {
            toast.error('Error generating paths. Try again later.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }


    return (
        <Navbar>
            <NavbarGroup align={Alignment.LEFT}>

            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>



                <NavbarDivider />
                <Button className={Classes.MINIMAL} icon="refresh" onClick={updateMap} text="Reload map" />

                {/**  <Button className={Classes.MINIMAL} icon="floppy-disk" disabled={mapImage ? false : true} onClick={downloadScenario} text="Save results" /> */}
                <Button className={Classes.MINIMAL} icon="document-share" text="Download report" onClick={generatePDF} disabled={(printable) ? false : true} />




            </NavbarGroup>
        </Navbar >
    )
}

export default DashboardMenu
