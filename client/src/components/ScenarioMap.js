import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { store, useGlobalState } from 'state-pool';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from '@turf/turf'

mapboxgl.accessToken = 'pk.eyJ1Ijoic2Vic2VibGkxIiwiYSI6ImNrdG9ibmloZTBiZjAyd280NHh5czE2NTAifQ.-DBO7UJEB6aCZGV_TLHx5Q';
function Map() {
    const [scenario, setScenario, updateScenario] = useGlobalState("scenario");

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(6);


    const draw = new MapboxDraw({
        displayControlsDefault: false,
        // Select which mapbox-gl-draw control buttons to add to the map.
        controls: {

            trash: false,
        },
        boxSelect: false,
        // Set mapbox-gl-draw to draw by default.
        // The user does not have to click the polygon control button first.
    });

    useEffect(() => {

        map.current = null
        let centeroid = turf.centroid(scenario.populations[0].region)
        let bbox = turf.bbox(scenario.populations[0].region)
        console.log(bbox)
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: centeroid.geometry.coordinates,
            zoom: 7
        }).fitBounds(bbox)
            .addControl(draw);
        map.current.on('load', function () {
            initDraw()


            map.current.on('draw.selectionchange', (e) => {

            })

            map.current.on('draw.create', console.log("create"));
            map.current.on('draw.delete', updateArea);
            map.current.on('draw.update', updateArea);
        });

    }, []);




    const addAreas = (events, identifier) => {
        if (map.current.getSource(identifier)) {
            map.current.getSource(identifier).setData(events.data)
        } else {
            map.current.addSource(identifier, events);
            map.current.addLayer({

                'id': identifier,
                'type': 'line',
                'source': identifier,
                'layout': {},
                'paint': {
                    'line-color': '#b81858',
                    'line-width': 1
                }
            });
        }
        events.data.id = identifier;
        draw.add(events.data)
    }
    const addPoints = (events, identifier) => {

        if (map.current.getSource(identifier)) {
            map.current.getSource(identifier).setData(events.data)
        } else {
            map.current.addSource(identifier, events);
            map.current.addLayer({
                'id': identifier,
                'type': 'symbol',
                'source': identifier,
                "interactive": true,
                'layout': {
                    'text-field': ['get', 'name'],
                    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                    'text-radial-offset': 0.5,
                    'text-justify': 'auto',
                }

            });
        }
        events.data.id = identifier;
        console.log(events.data)
        draw.add(events.data)
    }



    const initDraw = () => {


        const populations = scenario.populations.map((population, index) => ({
            "id": population.name,
            "type": 'Feature',
            "properties": { id: 'populations', parentIndex: index },
            "geometry": population.region
        }));
        const populationsSource = {
            "type": 'geojson',
            "data": {
                "type": 'FeatureCollection',
                "features": populations
            }
        };

        addAreas(populationsSource, 'populations')

        let events = []
        let sumEvents = {}
        scenario.events.forEach((event, eventid) => {
            event.operatingSites.forEach((operatingSite, id) => {
                if (!sumEvents[operatingSite.name]) {
                    sumEvents[operatingSite.name] = true

                    events.push({
                        "id": operatingSite.name,
                        "type": 'Feature',
                        "properties": { name: operatingSite.name, id: 'events', parentEvent: eventid, parentIndex: id },
                        "geometry": operatingSite.location
                    })
                }




            })
        })

        const eventsSource = {
            "type": 'geojson',
            "data": {
                "type": 'FeatureCollection',
                "features": events
            }
        };

        addPoints(eventsSource, 'events')



    }
    function updateArea(e) {
        console.log("EVENTS", e)

        if (e.features.length > 0 && map.current.getSource(e.features[0].properties.id)) {

            let tempFeatures = { ...map.current.getSource(e.features[0].properties.id) }
            console.log("TEMPFEATURES", tempFeatures)

            tempFeatures._data.features = tempFeatures._data.features.map(function (a) {
                console.log("IN LOOP", a, (a.properties.id === e.features[0].properties.id), a.properties.id, e.features[0].properties.id)
                if (e.features[0].id === 'events') {
                    return a.properties.id === e.features[0].properties.id ? e.features[0] : a;

                } else {
                    return a.id === e.features[0].id ? e.features[0] : a;
                }
            });


            map.current.getSource(e.features[0].properties.id).setData(tempFeatures._data);

            if (e.features[0].properties.id === "populations") {
                updateScenario(function (scenario) {
                    scenario.populations[e.features[0].properties.parentIndex].region = e.features[0].geometry
                });

            } else if (e.features[0].properties.id === "events") {

                updateScenario(function (scenario) {

                    let updateName = scenario.events[e.features[0].properties.parentEvent].operatingSites[e.features[0].properties.parentIndex].name
                    scenario.events.forEach((event, eventid) => {
                        event.operatingSites.forEach((operatingSite, id) => {

                            if (operatingSite.name == updateName) {
                                operatingSite.location = e.features[0].geometry
                            }

                        })
                    })
                });


            }


        }
    }








    /*
        useEffect(() => {
            if (map.current) return; // initialize map only once
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom
            });
        });
    */
    return (
        <div ref={mapContainer} className="map-container" />
    )
}

export default Map
