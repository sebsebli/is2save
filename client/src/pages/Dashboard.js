import { H1, Icon } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useGlobalState } from 'state-pool';
import SingleDashboard from '../components/Dashboard/SingleDashboard'
import DashboardMenu from '../components/DashboardMenu';
import Loader from '../components/Loader'
import useInterval from '../helpers/Interval';
function norm(val, max, min) { return (val - min) / (max - min); }

function Dashboard() {
    const [data, setData] = useState()
    const [latestScen, setLatestScen] = useState(null)
    const [error, setError] = useState(false)

    const [autoUpdate, setUpdate] = useState(false)
    /*
        useInterval(() => {
    
            getData();
        }, 5000);
    
    
    
    */
    useEffect(async () => {
        getLatestExperiment()
        /*  const response = await fetch(
              'http://localhost:2020/getSimResults'
          );
          let simRes = await response.json();
          console.log(simRes)
  
  
          if (response.status == 200) {
              toast.success('Data retrieved. Map is loading!', {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
              });
              setData(simRes)
  
          } else {
              toast.error('Something went wrong! Make sure all servers are running. Huge populations can lead to server timeouts. Download your report instead.', {
                  position: "top-center",
                  autoClose: 15000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
              });
  
          }
  
  
  */

    }, [])
    const getData = async () => {
        if (!autoUpdate) return
        const response = await fetch(
            'http://localhost:2020/getSimResults'
        );
        let simRes = await response.json();


        if (response.status == 200) {

            setData(simRes)

        }
    }

    const getLatestExperiment = async () => {
        try {
            const response = await fetch(
                'http://localhost:2020/latestExperiment'
            );
            let latest = await response.json();


            if (response.status == 200) {
                console.log("LATEST ", latest)
                setLatestScen(latest)

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
            setLatestScen(null)
            setError(true)


        }
    }


    const toggleUpdate = () => {
        setUpdate(!autoUpdate)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%', height: '100%' }}>


            {latestScen ? <SingleDashboard latest={latestScen} data={data} /> : !error ? <Loader show={true}></Loader> : <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: '100%', height: '50vh' }}><Icon icon="cross" size={150} /><H1>Error loading dashboard</H1></div>}

            {/*data && <SingleDashboard data={data} />
            */}


        </div>
    )
}

export default Dashboard
