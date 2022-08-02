import React, { useEffect, useState } from 'react'
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
    Intent
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


import { store, useGlobalState } from 'state-pool';
import { toast } from 'react-toastify';

import addFormats from "ajv-formats"
import Ajv from "ajv"
import FileUploader from './ScenarioForm/FileUpload';
import { useNavigate } from 'react-router-dom';
const ajv = new Ajv()

addFormats(ajv, ["date-time"])
const validate = ajv.compile(schema)
const serverURL = 'http://localhost:2020'
function ScenarioMenu({ setSaved }) {
    const [scenario, setScenario, updateScenario] = useGlobalState("scenario");
    const [simulationSettings, setSimulatinSettings, updateSimulatinSettings] = useGlobalState("simSettings");

    const [loadScenarios, setloadScenarios] = React.useState([]);



    const [isValid, setIsValid] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        let allErrs = true
        const valid = validate(scenario)
        scenario.populations.map(population => {
            let sum = population.fitnessDistribution.admin + population.fitnessDistribution.easy + population.fitnessDistribution.medium + population.fitnessDistribution.heavy
            if (sum != 100) {
                allErrs = false
            }

        })


        if (valid && allErrs) {
            setIsValid(true)
        } else {
            setIsValid(false)


        }


    }, [scenario])



    useEffect(() => {
        loadScenariosFromServer()

    }, [])

    const handleFile = (file) => {
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = (e.target.result)
            loadScenarioFromFile(JSON.parse(text))
        };
        reader.readAsText(file)
    }



    const downloadScenario = async () => {

        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(scenario)], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = scenario.id + ".svcsdl";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        setSaved();
    }
    const loadScenarioFromFile = (newScenario) => {
        const valid = validate(newScenario)


        console.log("VALIDATION", valid, validate.errors)
        if (valid) {
            setScenario(newScenario)

        } else {
            toast.error("Your file does not match the official SVCSDL schema.", {
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

    const saveOnServer = () => {

        fetch(serverURL + '/saveScenario', {
            method: "POST",
            body: JSON.stringify(scenario),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.status === 200) {
                    toast.success('Scenario saved on server!', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    loadScenariosFromServer()
                    setSaved();
                } else {
                    toast.error("Something went wrong.", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
            .catch(err => {

                toast.error("Error connecting to the server!\nMake sure the server is running on localhost:2020", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }


            );


    }
    const runScenario = () => {
        console.log(simulationSettings)
        fetch(serverURL + '/startSimulation', {
            method: "POST",
            body: JSON.stringify({ scenario: scenario, settings: simulationSettings }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.status === 200) {

                    setTimeout(() => {
                        toast.success("Experiment has started.", {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        navigate('/dashboard')

                    }, 1000)
                } else {
                    toast.error("Error connecting to the server!\nMake sure the simulation is running.", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
            .catch(err => {
                toast.error("Error connecting to the server!\nMake sure the simulation is running.", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            );
    }
    const loadScenariosFromServer = () => {
        fetch(serverURL + '/loadScenarios', {
            method: "GET",
        })
            .then(response => response.json())
            .then(data => {
                setloadScenarios(data.files)
            })
            .catch(err => {
                toast.error("Error connecting to the server!\nMake sure the server is running on localhost:2020", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            );
    }
    const requestFromServer = (path) => {
        fetch(serverURL + '/loadScenario', {
            method: "POST",
            body: JSON.stringify({ path: path }),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json())
            .then(data => {
                loadScenarioFromFile(JSON.parse(data))

            })
            .catch(err => {

                toast.error("Error loading Scenario from server.", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }


            );
    }

    const newScenario = () => {
        let temp = defaultScenario;
        temp.id = generateSlug();
        setScenario(temp)
    }
    return (
        <Navbar>
            <NavbarGroup align={Alignment.LEFT}>

            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
                <Button intent={Intent.SUCCESS} icon="map-create" text="New scenario" onClick={() => { newScenario() }} />
                <NavbarDivider />

                <FileUploader
                    handleFile={handleFile}
                />

                <NavbarDivider />
                <Popover2 placement='bottom' className={Classes.MINIMAL} icon="cog" content={<Menu>
                    <MenuItem text="Save (cloud)" icon="globe-network" onClick={saveOnServer} />
                    <MenuItem text="Download SVCSDL" icon="download" onClick={downloadScenario} />


                </Menu>} >
                    <Button className={Classes.MINIMAL} icon="floppy-disk" />
                </Popover2>
                <NavbarDivider />

                <Popover2 placement='bottom' className={Classes.MINIMAL} icon="cog" content={<Menu>


                    {loadScenarios.map(item => {

                        return <MenuItem onClick={() => { requestFromServer(item.path) }} text={item.name} key={item.name} icon="document-open" />

                    })}


                </Menu>} >
                    <Button className={Classes.MINIMAL} icon="upload" />
                </Popover2>
                <NavbarDivider />

                <Button intent={Intent.WARNING} onClick={() => { runScenario() }} icon="rocket-slant" text="Run scenario" disabled={!isValid} />




            </NavbarGroup>
        </Navbar >
    )
}

export default ScenarioMenu
