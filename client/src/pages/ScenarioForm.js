import React, { useEffect, useState } from 'react'
import { Alignment, Navbar, NavbarGroup, NavbarHeading, Tab, Tabs, FormGroup, InputGroup, Card, Elevation, Callout, TextArea, Intent, Radio, RadioGroup, Position, Drawer, DrawerSize, IconSize, H4, H6, H5, H3, Button, Code } from "@blueprintjs/core";
import ScenarioMenu from '../components/ScenarioMenu';
import { DateRange, DateRangeInput, DateFormatProps, TimePrecision } from "@blueprintjs/datetime";

import { Classes as Popover2Classes, ContextMenu2, Tooltip2 } from "@blueprintjs/popover2";
import { H2, EditableText, Icon, TreeNodeInfo, Tree, Collapse, Pre } from "@blueprintjs/core";
import { Stepper, Step } from 'react-form-stepper';
import FormCollapse from '../components/FormCollapse';
import GeneralForm from '../components/ScenarioForm/GeneralForm';
import PopulationForm from '../components/ScenarioForm/PopulationForm';
import EventForm from '../components/ScenarioForm/EventForm';
import OperatingSiteForm from '../components/ScenarioForm/OperatingSiteForm';
import Map from '../components/ScenarioMap';
import { Fab, Action } from 'react-tiny-fab';
import defaultScenario from '../assets/defaultScenario.json'
import { useImmer } from "use-immer";
import { store, useGlobalState } from 'state-pool';
import JSONInput from 'react-json-editor-ajrm';
import schema from '../assets/SVCSDL.json'
import ReactJson from 'react-json-view'

import locale from 'react-json-editor-ajrm/locale/en';
import addFormats from "ajv-formats"
import Ajv from "ajv"
import { toast } from 'react-toastify';
const ajv = new Ajv();

addFormats(ajv, ["date-time"])
const validate = ajv.compile(schema)


function ScenarioForm() {
    const [showMap, setShowMap] = useState(false)
    const [showCode, setShowCode] = useState(false)
    const [selectedTabId, setselectedTabId] = useState(0)
    const [scenario, setScenario, updateScenario] = useGlobalState("scenario");

    const [errors, setErrors] = useState([])
    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        let allErrs = []
        const valid = validate(scenario)
        scenario.populations.map(population => {
            let sum = population.fitnessDistribution.admin + population.fitnessDistribution.easy + population.fitnessDistribution.medium + population.fitnessDistribution.heavy
            if (sum != 100) {
                allErrs.push({ id: population.name, error: ' fitness is ' + sum + ' but must be 100!' })
            }

        })

        if (valid) {
            setErrors([])

        } else {
            console.log(validate.errors)
            setErrors(validate.errors)

        }

        if (valid && (allErrs.length < 1)) {
            setIsValid(true)
        } else {
            setIsValid(false)
            setErrors(errors => [...errors, allErrs])


        }


    }, [scenario])


    return (


        <form style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>

            <H6>LOG</H6>
            <pre style={{ height: 80, maxHeight: 300, color: errors.length > 0 ? 'red' : 'green', marginBottom: 30, overflowWrap: 'break-word', overflowY: 'scroll', border: '1px solid #d4d4d4', borderRadius: 5, padding: 5, width: '100%', wordWrap: 'normal' }}>



                {

                    errors.length > 0 ? errors.map(err => {
                        return 'ERROR: ' + JSON.stringify(err) + '\n'
                    }) : 'Your scenario does not have any errors.'
                }


            </pre>

            <Tabs id="TabsExample" onChange={(tabId, prevTabId) => { setselectedTabId(tabId) }} selectedTabId={selectedTabId}>
                <Tab id={0} title="General" panel={<GeneralForm />} />
                <Tab id={1} title="Populations" panel={<PopulationForm />} panelClassName="ember-panel" />
                <Tab id={2} title="Events" panel={<EventForm />} />
                <Tab id={3} title="Operating sites" panel={<OperatingSiteForm />} />
                <Tabs.Expander />
            </Tabs>




            <Fab

                mainButtonStyles={{ backgroundColor: '#457b9d' }}
                icon={<Icon icon="map" size={IconSize.LARGE} />}
                alwaysShowTitle={true}
                onClick={() => { setShowMap(!showMap) }}
            >
            </Fab>
            <Fab
                style={{ bottom: 24, left: 24 }}
                mainButtonStyles={{ backgroundColor: '#7d7d7d' }}
                icon={<Icon icon="code" size={IconSize.LARGE} />}
                alwaysShowTitle={true}
                onClick={() => { setShowCode(!showCode) }}
            >
            </Fab>
            <Drawer isCloseButtonShown canOutsideClickClose size={DrawerSize.STANDARD} position={Position.LEFT} isOpen={showCode}>
                <div style={{ width: '100%', height: '100%' }} className='sticky'>

                    <JSONInput
                        placeholder={scenario}

                        locale={locale}
                        height='100%'
                        width='100%'
                        onChange={(newScenario) => {
                            const valid = validate(newScenario.jsObject)


                            console.log("VALIDATION", valid, newScenario)
                            if (valid) {
                                setScenario(newScenario.jsObject)

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

                        }
                    />

                </div>
            </Drawer>
            <Drawer canOutsideClickClose size={DrawerSize.LARGE} position={Position.TOP} isOpen={showMap}>
                <div style={{ width: '100%', height: '100%' }} className='sticky'>
                    <Map />
                </div>
            </Drawer>
        </form >
    )
}

export default ScenarioForm
