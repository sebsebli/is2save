import { DateTime } from 'luxon';
import React from 'react'
import { useGlobalState } from 'state-pool';
import parse from 'html-react-parser';

function HomePage() {



    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%', flex: 1 }}>
            <div style={{ maxWidth: 800, padding: 30 }}>
                <h1>ABOUT</h1>
                <h3>The Information System for Disaster Managers to Predict the Spontaneous Volunteer Influx at Operating Sites</h3>

                <hr />
                <p>IS2SaVe is the instantiation of the dissertation <b>“Predicting the Influx of Spontaneous Volunteers at Operating Sites in Flood Disasters: An Information System for Disaster Managers”.</b></p>
                <p>This tool enables disaster managers to create various flood disaster scenarios in order to analyze the behavior, especially the influx, of spontaneous volunteers. Moreover, the tool provides valuable representations of volunteer movements to prepare for potential congestions, as well as predicts operating site utilization to inform about shortfalls or overloads in help in certain scenarios. </p>

                <a href="https://lindner.me" target="_blank">About Sebastian Lindner</a>
            </div>
        </div>
    )
}

export default HomePage
