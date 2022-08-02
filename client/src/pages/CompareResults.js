import { Button, Card, Elevation, H3 } from '@blueprintjs/core';
import { formControlLabelClasses, MenuItem, Select } from '@mui/material';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useGlobalState } from 'state-pool';
import CompareDashboard from '../components/Dashboard/CompareDashboard';
import SingleDashboard from '../components/Dashboard/SingleDashboard'
import DashboardMenu from '../components/DashboardMenu';
import Loader from '../components/Loader'
import useInterval from '../helpers/Interval';
import { Select2 } from "@blueprintjs/select";


export default function CompareResults() {
    const [loading, setloading] = useState(false)
    const [data, setData] = useState([])
    const [allExps, setallExps] = useState([])
    const [exp1, setExp1] = useState(null)
    const [exp2, setExp2] = useState(null)
    const getLatestExperiment = async () => {
        try {
            const response = await fetch(
                'http://localhost:2020/allExperiments'
            );
            let latest = await response.json();


            if (response.status == 200) {
                console.log("LATEST ", latest)
                setallExps(latest)
                if (latest.length > 1) {
                    setExp1(latest[0].id)
                    setExp2(latest[1].id)
                }
            }
        } catch (err) {
            toast.error(err, {
                position: "top-center",
                autoClose: 15000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setallExps([])


        }
    }


    useEffect(() => {
        getLatestExperiment();

    }, [])

    const renderSelect = (type) => {
        return <Select
            style={{ marginBottom: 15 }}
            value={type === 1 ? exp1 : exp2}
            onChange={(e) => type === 1 ? setExp1(e.target.value) : setExp2(e.target.value)}
        >
            {
                allExps.map((exp, i) => {
                    return <MenuItem key={i} value={exp.id}>ID: {exp.id}, TITLE: {exp.title}</MenuItem>

                })


            }

        </Select>
    }


    /*
      const hiddenFileInput = React.useRef(null);
  
  
      // Programatically click the hidden file input element
      // when the Button component is clicked
      const handleClick = event => {
          hiddenFileInput.current.click();
      };
      // Call a function (passed as a prop from the parent component)
      // to handle the user-selected file 
      const handleChange = event => {
          const fileUploaded = event.target.files[0];
          handleFile(fileUploaded);
      };
  
      const handleFile = (file) => {
          const reader = new FileReader()
          reader.onload = async (e) => {
              const text = (e.target.result)
              let temp = [...data]
              temp.push(JSON.parse(text))
              setData(temp)
          };
          reader.readAsText(file)
      }
  
      const deleteID = (index) => {
          let temp = [...data]
          temp.splice(index, 1); // 2nd parameter means remove one item only
          setData(temp)
      }
  
      const renderScenarios = () => {
  
          if (data.length < 1) return <></>
  
  
          return data.map((dashboard, index) => {
              console.log(dashboard)
              if (dashboard.data && dashboard.scenario) {
                  return <CompareDashboard key={index} deleteItem={() => deleteID(index)} data={dashboard.data} scenario={dashboard.scenario} map={dashboard.map || null} />
              } else {
                  deleteID(index)
                  toast.error("Incomplete file error.", {
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
  
  
      }
  */


    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', width: '100%', height: '100%', flex: 1 }}>

            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%', height: '100%', flex: 1 }}>

                <Card elevation={Elevation.ONE} style={{ width: '100%', margin: 0, minWidth: 500, display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', height: '100vh', flex: 1 }}>
                    {renderSelect(1)}
                    <SingleDashboard latest={exp1} comparison={true} />
                </Card>
                <Card elevation={Elevation.ONE} style={{ width: '100%', margin: 0, minWidth: 500, display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', height: '100vh', flex: 1 }}>
                    {renderSelect(2)}
                    <SingleDashboard latest={exp2} comparison={true} />
                </Card>
            </div>

        </div>
    )
}
