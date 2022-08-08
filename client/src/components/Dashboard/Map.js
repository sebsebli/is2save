import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Switch, Slider, NavbarGroup, NavbarHeading, Tab, Tabs, FormGroup, InputGroup, Card, Elevation, Callout, TextArea, Intent, Radio, RadioGroup, Position, Drawer, DrawerSize, IconSize, H4, MultistepDialog, DialogStep, Button, Icon, Classes, H6, H5, Spinner, SpinnerSize } from "@blueprintjs/core";
import Loader from '../Loader';
import { toast } from 'react-toastify';
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';
import { useGlobalState } from 'state-pool';



function MovementMap() {
    const [mapImage, setMapImage, updateMapImage] = useGlobalState("mapImage");

    const mapContainer = useRef(null);

    const [loading, setLoading] = useState(true)
    const [showControl, setshowControl] = useState(true)

    const map = useRef(null);

    const [zoom, setZoom] = useState(11);
    const [showPaths, setShowPaths] = useState(true)
    const [markers, setMarkers] = useState([])
    const [sliderValue, setSliderValue] = React.useState(0);


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
    const filterBy = (id) => {
        const filters = ['==', 'id', id];
        map.current.setFilter('svPoints', filters);


    }
    const handleSliderChange = (newValue) => {

        setSliderValue(newValue);
        filterBy(newValue)


    };


    function sortByProperty(property) {
        return function (a, b) {
            if (a[property] > b[property])
                return 1;
            else if (a[property] < b[property])
                return -1;

            return 0;
        }
    }


    useEffect(() => {




        map.current = null
        // let centeroid = turf.centroid(scenario.disasterArea)
        //let bbox = turf.bbox(scenario.disasterArea)
        //console.log(bbox)
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            //   center: centeroid.geometry.coordinates,
            zoom: zoom,
            preserveDrawingBuffer: true
        })//.fitBounds(bbox)
            .addControl(draw);




        map.current.on('idle', async () => {
            map.current.getCanvas().toBlob(async function (blob) {
                let img = await blobToBase64(blob)
                setMapImage(img)
            })
        })
        map.current.on('load', async () => {


            const response = await fetch(
                'http://localhost:2020/data/geo_sv_by_time.json'
            );
            const data = await response.json();
            // save full coordinate list for later
            console.log(data)
            if (data.features == null || data.features.length < 1) {
                setLoading(false)
                return
            }
            const coordinates = data.features[0].geometry.coordinates;


            data.features.sort(sortByProperty("id"));


            for (let i = 0; i < data.features.length; i++) {
                data.features[i].properties = { id: i }

                var date = new Date(data.features[i].id);

                setMarkers(markers => [...markers, date.toString()])
                setLoading(false)

            }
            /* GENERATE LOCATIONS AFTER SIMULATION RUN ON SERVER!!!!!!!
                        const response2 = await fetch(
                            'http://localhost:2020/generateLocations'
                        );
                        const { status } = response2
                        if (status != 200) {
                            toast.error('Something went wrong loading the map!', {
                                position: "top-center",
                                autoClose: 15000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
            
                        }
            **/
            setLoading(false)

            // add it to the map
            map.current.addSource('svPoints', { type: 'geojson', data: data });

            map.current.addSource('svPaths', { type: 'geojson', data: "http://localhost:2020/data/geo_sv_paths.json" });



            map.current.jumpTo({ 'center': coordinates[0], 'zoom': 11 });


            // map.current.addSource('svPoints', { type: 'geojson', data: "http://localhost:3001/data/geo_sv_by_time.json" });
            map.current.addLayer({
                'id': 'svPaths',
                'type': 'line',
                'source': 'svPaths',
                'visibility': 'none',
                'paint': {
                    'line-color': '#6e0848',
                    'line-opacity': 0.3,
                    'line-width': 0.1
                }
            });

            map.current.addLayer({
                'id': 'svPoints',
                type: 'circle',
                source: 'svPoints',
                paint: {
                    'circle-radius': 2,
                    'circle-color': '#223b53',
                    'circle-stroke-width': 0,
                    'circle-opacity': 1
                }
            });


            map.current.loadImage(
                'http://localhost:2020/images/flood.png',
                (error, image) => {
                    if (error) throw error;
                    map.current.addImage('custom-marker', image);
                    // Add a GeoJSON source with 2 points
                    map.current.addSource('osPoints', { type: 'geojson', data: "http://localhost:2020/data/geo_os_by_time.json" });


                    // Add a symbol layer
                    map.current.addLayer({
                        'id': 'osPoints',
                        'type': 'symbol',
                        'source': 'osPoints',
                        'layout': {
                            'icon-image': 'custom-marker',
                            'icon-size': 0.2,
                            // get the title name from the source's "title" property
                            'text-field': ['get', 'description'],
                            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                            'text-radial-offset': 1,
                            'text-justify': 'auto',
                            'text-offset': [0, 5],
                            'text-anchor': 'top',

                        },
                        paint: {
                            "text-color": "#ffffff"
                        }
                    });
                }
            );




            map.current.setPitch(10);
            hidePaths(true)
            // on a regular basis, add more coordinates from the saved list and update the map

            var dpi = 300;
            Object.defineProperty(window, 'devicePixelRatio', {
                get: function () { return dpi / 96 }
            });



            // var content = map.current.getCanvas().toDataURL();
            //let tempdata = returnNewArr(data)
            //console.log(tempdata)




        });

    }, []);
    function blobToBase64(blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }


    const hidePaths = (value) => {
        if (!value && map.current) {
            map.current.setLayoutProperty(
                'svPaths',
                'visibility',
                'none'
            );
            map.current.setLayoutProperty(
                'svPoints',
                'visibility',
                'visible'
            );
            setShowPaths(false)
        }
        if (value && map.current) {
            map.current.setLayoutProperty(
                'svPaths',
                'visibility',
                'visible'
            );
            map.current.setLayoutProperty(
                'svPoints',
                'visibility',
                'none'
            );
            setShowPaths(true)

        }


    }

    return (



        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'

        }}

        >

            <div className={markers.length == 0 ? Classes.SKELETON : ''}
                style={{ width: '100%', padding: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>

                <div style={{ display: showControl ? 'flex' : 'none', flexDirection: 'row' }}>
                    <H6 style={{ paddingRight: 10 }}>{!showPaths ? 'Movement' : 'Paths'}</H6>
                    <Switch onChange={() => { hidePaths(!showPaths) }} checked={showPaths} />
                </div>
            </div>





            <div ref={mapContainer} id="map" style={{ height: 400, width: '100%', minHeight: 500 }} >
                {(loading || markers.length < 1) && <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', zIndex: 100, justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                    {loading ? <Spinner size={SpinnerSize.LARGE} /> : <H4>NO VALID DATA</H4>}
                </div>
                }

            </div>



            <div className={(loading || markers.length < 1) ? Classes.SKELETON : ''} style={{ width: '100%', textAlign: 'center', margin: 10, marginBottom: 0, display: showControl ? 'block' : 'none' }}>

                <Slider min={0}
                    max={markers.length - 1}
                    value={sliderValue}
                    onChange={handleSliderChange}
                    showTrackFill
                    disabled={showPaths}
                    labelRenderer={false}
                />
                <H6>{markers[sliderValue] || ""} </H6>
            </div>
        </div >

    )
}

export default MovementMap
