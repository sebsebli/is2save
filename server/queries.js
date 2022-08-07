


const { Client } = require('pg');
const path = require('path')

const fs = require('fs')
const pgp = require('pg-promise')();
var randomColor = require('randomcolor'); // import the script
const _ = require('lodash');
const puppeteer = require('puppeteer')



const client = new Client({
    //  connectionString: 'postgres://xuyfcnqqzsuogb:3d706ca5bd23a6f992495465506275030bbbcbbf1744ae9448fc384e4d3b6252@ec2-54-74-60-70.eu-west-1.compute.amazonaws.com:5432/d8gtv4apfirm2j',

    connectionString: 'postgres://sebastianlindner@localhost:5432/sebastianlindner',

    /*
      ssl: {
          rejectUnauthorized: false
      }
      */
});
const db = pgp('postgres://sebastianlindner@localhost:5432/sebastianlindner');



client.connect();
const sqlGetAllOSData = "select * from operating_site_history"




const sqlGetOperatingSiteByTimestamp_BACKUP = "SELECT jsonb_build_object( 'type',     'FeatureCollection', 'features', jsonb_agg(feature) ) FROM ( SELECT jsonb_build_object( 'type',       'Feature', 'id',         id, 'geometry',   ST_AsGeoJSON(geom,5)::jsonb, 'properties', id ) AS feature FROM ( SELECT timestamp as id, ST_Collect(ST_GeomFromWKB(location)) As geom FROM operating_site_history as sv GROUP BY timestamp ) row) features;"

const sqlGetOperatingSiteByTimestamp = "SELECT jsonb_build_object( 'type',     'FeatureCollection', 'features', jsonb_agg(feature) ) FROM ( SELECT jsonb_build_object( 'type',       'Feature', 'id',         id, 'geometry',   ST_AsGeoJSON(geom,5)::jsonb, 'properties', id ) AS feature FROM ( SELECT timestamp as id, ST_Collect(ST_GeomFromWKB(location)) As geom FROM operating_site_history as sv WHERE  experiment_id = (select max(id) from experiment limit 1) GROUP BY timestamp ) row) features;"



//const sqlSVMovementPaths = "SELECT jsonb_build_object( 'type',     'FeatureCollection', 'features', jsonb_agg(feature) ) FROM ( SELECT jsonb_build_object( 'type',       'Feature', 'id',         id, 'geometry',   ST_AsGeoJSON(geom)::jsonb, 'properties', id ) AS feature FROM ( SELECT id, st_makeline(ST_GeomFromWKB(current_location) ORDER BY timestamp) As geom FROM spontaneous_volunteers GROUP BY id ) row) features;";
const sqlPathsOrderedByTimestamp_BACKUP = "SELECT jsonb_build_object( 'type',     'FeatureCollection', 'features', jsonb_agg(feature) ) FROM ( SELECT jsonb_build_object( 'type',       'Feature', 'id',         id, 'geometry',   ST_AsGeoJSON(geom,5)::jsonb, 'properties', id ) AS feature FROM ( SELECT id, st_makeline(ST_GeomFromWKB(current_location)) As geom FROM spontaneous_volunteers as sv WHERE experiment_id = (select max(id) from experiment limit 1) GROUP BY id ) row) features;"

const sqlPathsOrderedByTimestamp = "SELECT jsonb_build_object( 'type',     'FeatureCollection', 'features', jsonb_agg(feature) ) FROM ( SELECT jsonb_build_object( 'type',       'Feature', 'id',         id, 'geometry',   ST_AsGeoJSON(geom,5)::jsonb, 'properties', id ) AS feature FROM ( SELECT id, st_makeline(ST_GeomFromWKB(current_location)ORDER BY timestamp) As geom FROM spontaneous_volunteers as sv WHERE  experiment_id = (select max(id) from experiment limit 1) GROUP BY id ) row) features;"


const sqlGetVolunteerLocationsByTime = "SELECT jsonb_build_object( 'type',     'FeatureCollection', 'features', jsonb_agg(feature) ) FROM ( SELECT jsonb_build_object( 'type',       'Feature', 'id',         id, 'geometry',   ST_AsGeoJSON(geom,5)::jsonb, 'properties', id ) AS feature FROM ( SELECT timestamp as id, ST_Collect(ST_GeomFromWKB(current_location)) As geom FROM spontaneous_volunteers as sv where experiment_id = (select max(id) from experiment limit 1) GROUP BY timestamp ) row) features;"




const sqlGetVolunteerLocationsByTime_BACKUP = "SELECT jsonb_build_object( 'type',     'FeatureCollection', 'features', jsonb_agg(feature) ) FROM ( SELECT jsonb_build_object( 'type',       'Feature', 'id',         id, 'geometry',   ST_AsGeoJSON(geom,5)::jsonb, 'properties', id ) AS feature FROM ( SELECT timestamp as id, ST_Collect(ST_GeomFromWKB(current_location)) As geom FROM spontaneous_volunteers as sv GROUP BY timestamp ) row) features;"
const sql_OS_all_utilizations_percent_by_OS = "SELECT To_jsonb(data_section) AS RESULT FROM   (SELECT OS_NAME.NAME                                           AS ID, (SELECT Json_agg(nested_names) FROM   (SELECT OS_DATA.timestamp AS timestamp, Cast(Sum(( OS_DATA.current_admin * 100 ) / NULLIF(OS_DATA.required_admin, 0)) AS INT)         AS ADMIN, Cast(Sum(( OS_DATA.current_easy * 100 ) / NULLIF(OS_DATA.required_easy, 0)) AS INT)         AS EASY, Cast(Sum(( OS_DATA.current_medium * 100 ) / NULLIF(OS_DATA.required_medium, 0)) AS INT)         AS MEDIUM, Cast(Sum(( OS_DATA.current_heavy * 100 ) / NULLIF(OS_DATA.required_heavy, 0)) AS INT)         AS HEAVY FROM   operating_site_history AS OS_DATA WHERE	OS_NAME.name = OS_DATA.name GROUP  BY OS_DATA.timestamp ORDER  BY OS_DATA.timestamp) AS NESTED_NAMES) AS DATA FROM   operating_site_history AS OS_NAME GROUP  BY OS_NAME.NAME) AS DATA_SECTION"
const sql_OS_all_utilizations_percent = "SELECT Json_agg(data_section) AS result FROM   (SELECT OS_NAME.timestamp                                           AS timestamp, (SELECT Json_agg(nested_names) FROM   (SELECT OS_DATA.name AS name, (SELECT values FROM ( SELECT Sum(NULLIF(OS_DATA.current_rejects, 0)) as rejects, Cast(Sum(( OS_DATA.current_admin * 100 ) / NULLIF(OS_DATA.required_admin, 0)) AS INT)         AS ADMIN, Cast(Sum(( OS_DATA.current_easy * 100 ) / NULLIF(OS_DATA.required_easy, 0)) AS INT)         AS EASY, Cast(Sum(( OS_DATA.current_medium * 100 ) / NULLIF(OS_DATA.required_medium, 0)) AS INT)         AS MEDIUM, Cast(Sum(( OS_DATA.current_heavy * 100 ) / NULLIF(OS_DATA.required_heavy, 0)) AS INT)         AS HEAVY ) as values) FROM   operating_site_history AS OS_DATA WHERE  OS_NAME.timestamp = OS_DATA.timestamp GROUP  BY OS_DATA.name) AS NESTED_NAMES) AS DATA FROM   operating_site_history AS OS_NAME GROUP  BY OS_NAME.timestamp ORDER  BY OS_NAME.timestamp ) AS DATA_SECTION"
const sql_OS_get_all = "select Json_agg(result) as result from (SELECT name, SUM(current_rejects) as rejects from operating_site_history group by name ) result"
const sql_SV_minmaxavg = "SELECT JSON_AGG(RESULT) FROM (SELECT ROUND(MIN(TOTALNUMBEROFREJECTS)) AS MIN_REJECTS, ROUND(AVG(TOTALNUMBEROFREJECTS)) AS AVG_REJECTS, ROUND(MAX(TOTALNUMBEROFREJECTS)) AS MAX_REJECTS, ROUND(MIN(TOTALHOURSHELPED)) AS MIN_TOTALHOURSHELPED, ROUND(AVG(TOTALHOURSHELPED)) AS AVG_TOTALHOURSHELPED, ROUND(MAX(TOTALHOURSHELPED)) AS MAX_TOTALHOURSHELPED, ROUND(MIN(TOTALDAYSWORKED)) AS MIN_TOTALTIMESWORKED, ROUND(AVG(TOTALDAYSWORKED)) AS AVG_TOTALTIMESWORKED, ROUND(MAX(TOTALDAYSWORKED)) AS MAX_TOTALTIMESWORKED FROM SPONTANEOUS_VOLUNTEERS) AS RESULT"
const get_all_os = "SELECT * FROM operating_site_history order by timestamp"
const get_latest_date = "SELECT max(timestamp) FROM operating_site_history"
const get_util_all_by_OS = "SELECT TIMESTAMP AS TIME, NAME, (( CAST(SUM(CURRENT_ADMIN * 100. / NULLIF(REQUIRED_ADMIN, 0)) AS int) + CAST(SUM(CURRENT_EASY * 100. / NULLIF(REQUIRED_EASY, 0)) AS int) + CAST(SUM(CURRENT_MEDIUM * 100. / NULLIF(REQUIRED_MEDIUM, 0)) AS int) + CAST(SUM(CURRENT_HEAVY * 100. / NULLIF(REQUIRED_HEAVY, 0)) AS int)) / 4) AS UTIL FROM OPERATING_SITE_HISTORY GROUP BY TIME, NAME ORDER BY TIME"
const get_util_all = "SELECT SUM(UTIL) AS UTIL, SUM(rejects) AS REJECTS, TIME FROM (SELECT TIMESTAMP AS TIME, SUM(current_rejects) as rejects, NAME, (CAST(SUM(CURRENT_ADMIN * 100. / NULLIF(REQUIRED_ADMIN, 0)) AS int) + CAST(SUM(CURRENT_EASY * 100. / NULLIF(REQUIRED_EASY, 0)) AS int) + CAST(SUM(CURRENT_MEDIUM * 100. / NULLIF(REQUIRED_MEDIUM, 0)) AS int) + CAST(SUM(CURRENT_HEAVY * 100. / NULLIF(REQUIRED_HEAVY, 0)) AS int)) / 4 AS UTIL FROM OPERATING_SITE_HISTORY GROUP BY TIME, NAME ORDER BY TIME) AS RES GROUP BY TIME ORDER BY TIME"
const get_util_medium = "SELECT timestamp as time, name, Cast(SUM(current_medium* 100./NULLIF(required_medium,0)) as int) as util FROM operating_site_history GROUP BY time, name ORDER BY time"
const get_util_heavy = "SELECT timestamp as time, name, Cast(SUM(current_heavy* 100./NULLIF(required_heavy,0))  as int) as util FROM operating_site_history GROUP BY time, name ORDER BY time"
const get_util_easy = "SELECT timestamp as time, name, Cast(SUM(current_easy* 100./NULLIF(required_easy,0))  as int) as util FROM operating_site_history GROUP BY time, name ORDER BY time"
const get_util_admin = "SELECT timestamp as time, name, Cast(SUM(current_admin* 100./NULLIF(required_admin,0))  as int) as util FROM operating_site_history GROUP BY time, name ORDER BY time"
const get_all_sv = "SELECT totaldaysworked, totalhourshelped, totalnumberofrejects FROM spontaneous_volunteers  order by timestamp"
const get_all_rejects = "select sum(current_rejects) as rejects, timestamp, name from operating_site_history group by timestamp, name"

const getLatestExperiment = "SELECT ID FROM experiment ORDER BY ID DESC LIMIT 1"
const getAllExperiment = "SELECT ID, TITLE FROM experiment"

const printPDF = async (url) => {
    try {
        // URL to load should be passed as first parameter
        // const url = "http://localhost:3000";
        // Username and password (with colon separator) should be second parameter
        const auth_string = "admin:qhw7rea0nyq3vhc@WUW";


        // TODO: Output an error message if number of arguments is not right or arguments are invalid

        // Set the browser width in pixels. The paper size will be calculated on the basus of 96dpi,
        // so 1200 corresponds to 12.5".
        const width_px = 1200;
        // Note that to get an actual paper size, e.g. Letter, you will want to *not* simply set the pixel
        // size here, since that would lead to a "mobile-sized" screen (816px), and mess up the rendering.
        // Instead, set e.g. double the size here (1632px), and call page.pdf() with format: 'Letter' and
        // scale = 0.5.

        // Generate authorization header for basic auth
        const auth_header = 'Basic ' + new Buffer.from(auth_string).toString('base64');

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set basic auth headers
        await page.setExtraHTTPHeaders({ 'Authorization': auth_header });

        // Increase timeout from the default of 30 seconds to 120 seconds, to allow for slow-loading panels
        await page.setDefaultNavigationTimeout(120000);

        // Increasing the deviceScaleFactor gets a higher-resolution image. The width should be set to
        // the same value as in page.pdf() below. The height is not important
        await page.setViewport({
            width: width_px,
            height: 800,
            deviceScaleFactor: 2,
            isMobile: false
        })

        // Wait until all network connections are closed (and none are opened withing 0.5s).
        // In some cases it may be appropriate to change this to {waitUntil: 'networkidle2'},
        // which stops when there are only 2 or fewer connections remaining.
        await page.goto(url, { waitUntil: 'networkidle0' });

        await page.evaluate(() => {
            window.scrollTo(0, window.document.body.scrollHeight);
        });

        // Hide all panel description (top-left "i") pop-up handles and, all panel resize handles
        // Annoyingly, it seems you can't concatenate the two object collections into one
        await page.evaluate(() => {
            let infoCorners = document.getElementsByClassName('panel-info-corner');
            for (el of infoCorners) { el.hidden = true; };
            let resizeHandles = document.getElementsByClassName('react-resizable-handle');
            for (el of resizeHandles) { el.hidden = true; };
        });

        // Get the height of the main canvas, and add a margin
        var height_px = await page.evaluate(() => {
            return document.getElementsByClassName('react-grid-layout')[0].getBoundingClientRect().bottom;
        }) + 20;

        const pdf = await page.pdf({
            width: width_px + 'px',
            height: height_px + 'px',
            //    format: 'Letter', <-- see note above for generating "paper-sized" outputs
            scale: 1,
            displayHeaderFooter: false,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        });

        await browser.close();

        return pdf
    } catch (err) {
        console.error(err)
    }


}

const createPDF = (req, res) => {
    console.log(req.body)
    if (!req.body.url) res.status(400)
    printPDF(req.body.url)
        .then(pdf => {
            res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
            res.send(pdf)
        })
        .catch(err => {
            res.status(400)
        })


}


const get_latest_experiment = (request, response) => {
    client.query(getLatestExperiment, (err, res) => {
        if (err) {
            response.status(400)
            throw err
        }
        if (res.rows[0]) {
            response.status(200).json(res.rows[0].id)
        } else {
            response.status(400)
        }
    })

}
const get_all_experiments = (request, response) => {
    client.query(getAllExperiment, (err, res) => {
        if (err) {
            response.status(400)
            throw err
        }
        response.status(200).json(res.rows)

    })

}

const get_os_utilization_percent = (request, response) => {
    client.query(sql_OS_all_utilizations_percent, (err, res) => {
        if (err) {
            response.status(400)
            throw err
        }
        response.status(200).json(res.rows)

    })

}


function selectColor(number) {
    const hue = number * 137.508; // use golden angle approximation
    return `hsl(${hue},50%,75%)`;
}
const timeofday = (x) => {
    if (x >= 0 && x < 6) {
        tod = 'night (0 - 6)'
    } else if (x >= 6 && x < 12) {
        tod = 'morning (6 - 12)'
    } else if (x >= 12 && x < 18) {
        tod = 'afternoon (12 - 18)'
    } else {
        tod = 'evening (18 - 24)'
    }
    return tod
}
const getSimulationResults = async (request, response) => {


    try {
        console.time("dashboard");
        const queries = [
            { query: get_all_sv },
            { query: get_all_os },
            { query: sql_OS_get_all },
            { query: get_util_admin },
            { query: get_util_easy },
            { query: get_util_medium },
            { query: get_util_heavy },
            { query: get_util_all },
            { query: get_all_rejects },
            { query: get_util_all_by_OS },
            { query: get_latest_date }

        ];
        const sql = pgp.helpers.concat(queries);
        const [allSVs, anything, allOs, utilAdmin, utilEasy, utilMedium, utilHeavy, utilAll, currRejects, utilAllOS, latestDate] = await db.multi(sql);
        let setOS = await allOs[0].result.map((el, index) => {
            return {
                name: el.name,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16) //selectColor(index)
            }
        })

        anything.forEach((element, index) => {


            element.avgUtil_admin = parseInt((element.current_admin / element.required_admin) * 100)
            element.avgUtil_easy = parseInt((element.current_easy / element.required_easy) * 100)
            element.avgUtil_medium = parseInt((element.current_medium / element.required_medium) * 100)
            element.avgUtil_heavy = parseInt((element.current_heavy / element.required_heavy) * 100)

            element.sumCurrent = element.current_admin + element.current_medium + element.current_easy + element.current_heavy
            element.sumRequired = element.required_admin + element.required_easy + element.required_medium + element.required_heavy

            element.avgUtil = parseInt(element.sumCurrent / element.sumRequired * 100)
            let day = new Date(element.timestamp)
            element.daynight = timeofday(day.getHours())
            //  element.timestamp = day;


        });
        let allTimeStamps = []

        const groupedMap = _.groupBy(anything, function (n) {
            return n.timestamp;
        });
        let avgUtilizationAll = []
        for (var key of Object.keys(groupedMap)) {
            allTimeStamps.push(key)
            let sum = 0
            let counter = 1
            groupedMap[key].forEach(element => {
                counter++;
                sum += element.avgUtil
            });
            avgUtilizationAll.push(parseInt(sum / counter))
        }

        let evaluationData = {
            utilOSTime_all: {
                layout: {
                    title: 'Overview',
                    showlegend: true,
                    legend: { "orientation": "h" },
                    xaxis: {
                        type: 'date',
                    },
                    yaxis2: {
                        title: 'Rejects',
                        overlaying: 'y',
                        side: 'right'
                    }
                },
                data: [{
                    name: "Total utilization",
                    x: allTimeStamps,
                    y: utilAll.map(item => item.util),
                    type: 'scatter',
                    mode: 'lines',
                    connectgaps: true,


                },
                {

                    name: "Total number of rejects",
                    x: allTimeStamps,
                    y: utilAll.map(item => item.rejects),
                    type: 'scatter',
                    mode: 'lines',
                    yaxis: 'y2',
                    connectgaps: true,


                }]
            },
            rejects: {
                layout: {
                    title: 'Current rejects',
                    showlegend: true,
                    legend: { "orientation": "h" },
                    xaxis: {
                        type: 'date',
                    }

                },
                data: setOS.map((operatingSite, index) => {
                    return {
                        name: operatingSite.name,
                        x: allTimeStamps,
                        y: currRejects.map(data => {
                            if (data.name == operatingSite.name) {
                                return data.rejects
                            }

                        }),
                        type: 'scatter',
                        mode: 'lines',
                        connectgaps: true,
                        line: { color: operatingSite.color },

                    }
                })
            },
            utilAll_OS: {
                layout: {
                    title: 'Utilization by OS',
                    showlegend: true,
                    legend: { "orientation": "h" },
                    xaxis: {
                        type: 'date',
                    }

                },
                data: setOS.map((operatingSite, index) => {
                    return {
                        name: operatingSite.name,
                        x: allTimeStamps,
                        y: utilAllOS.map(data => {
                            if (data.name == operatingSite.name) {
                                return data.util
                            }

                        }),
                        type: 'scatter',
                        mode: 'lines',
                        connectgaps: true,
                        line: { color: operatingSite.color },

                    }
                })
            },
            utilOSTime_admin: {
                layout: {
                    title: 'Administrative tasks',
                    showlegend: true,
                    legend: { "orientation": "h" },
                    xaxis: {
                        type: 'date',
                    }

                },
                data: setOS.map((operatingSite, index) => {
                    return {
                        name: operatingSite.name,
                        x: allTimeStamps,
                        y: utilAdmin.map(data => {
                            if (data.name == operatingSite.name) {
                                return data.util
                            }

                        }),
                        type: 'scatter',
                        mode: 'lines',
                        connectgaps: true,
                        line: { color: operatingSite.color },

                    }
                })
            },
            utilOSTime_easy: {
                layout: {
                    title: 'Easy tasks',
                    showlegend: true,
                    legend: { "orientation": "h" },
                    xaxis: {
                        type: 'date',
                    }

                },
                data: setOS.map((operatingSite, index) => {
                    return {
                        name: operatingSite.name,
                        x: allTimeStamps,
                        y: utilEasy.map(data => {
                            if (data.name == operatingSite.name) {
                                return data.util
                            }

                        }),
                        connectgaps: true,
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: operatingSite.color },

                    }
                })
            },
            utilOSTime_medium: {
                layout: {
                    title: 'Medium tasks',
                    showlegend: true,
                    legend: { "orientation": "h" },
                    xaxis: {
                        type: 'date',
                    }

                },
                data: setOS.map((operatingSite, index) => {

                    return {
                        name: operatingSite.name,
                        x: allTimeStamps,
                        y: utilMedium.map(data => {
                            if (data.name == operatingSite.name) {
                                return data.util
                            }

                        }),
                        connectgaps: true,

                        type: 'scatter',
                        mode: 'lines',
                        line: { color: operatingSite.color },

                    }
                })
            },
            utilOSTime_heavy: {
                layout: {
                    title: 'Heavy tasks',
                    showlegend: true,
                    legend: { "orientation": "h" },
                    xaxis: {
                        type: 'date',
                    }
                },
                data: setOS.map((operatingSite, index) => {
                    return {
                        name: operatingSite.name,
                        x: allTimeStamps,
                        y: utilHeavy.map(data => {
                            if (data.name == operatingSite.name) {
                                return data.util
                            }

                        }),
                        type: 'scatter',
                        mode: 'lines',
                        connectgaps: true,

                        line: { color: operatingSite.color },

                    }
                })
            },
            pie_precitipation: {
                layout: {
                    title: 'Volunteers helping in rain',
                    showlegend: true,
                    legend: { "orientation": "h" }

                },
                data: [{
                    values: anything.map(time => {
                        return time.sumCurrent
                    }),
                    labels: anything.map(data => {
                        if (data.precipitation == 1) {
                            return 'no rain'
                        }
                        if (data.precipitation == 2) {
                            return 'little rain'
                        }
                        if (data.precipitation == 3) {
                            return 'heavy rain'
                        }

                    }),
                    type: 'pie',


                }]
            },
            pie_temperature: {
                layout: {
                    title: 'Volunteers helping in weather',
                    showlegend: true,
                    legend: { "orientation": "h" }

                },
                data: [{
                    values: anything.map(time => {
                        return time.sumCurrent
                    }),
                    labels: anything.map(data => {
                        if (data.temperature == 1) {
                            return 'warm'
                        }
                        if (data.temperature == 2) {
                            return 'moderate'
                        }
                        if (data.temperature == 3) {
                            return 'cold'
                        }
                    }),
                    type: 'pie',
                }]
            },
            pie_impact: {
                layout: {
                    title: 'Volunteers helping with disaster impact',
                    showlegend: true,
                    legend: { "orientation": "h" }

                },
                data: [{
                    values: anything.map(time => {
                        return time.sumCurrent
                    }),
                    labels: anything.map(data => {
                        if (data.impact == 1) {
                            return 'low'
                        }
                        if (data.impact == 2) {
                            return 'medium'
                        }
                        if (data.impact == 3) {
                            return 'severe'
                        }
                    }),
                    type: 'pie',
                }]
            },
            pie_threat: {
                layout: {
                    title: 'Volunteers helping with risk',
                    showlegend: true,
                    legend: { "orientation": "h" }

                },
                data: [{
                    values: anything.map(time => {
                        return time.sumCurrent
                    }),
                    labels: anything.map(data => {
                        if (data.impact == 1) {
                            return 'none'
                        }
                        if (data.impact == 2) {
                            return 'low'
                        }
                        if (data.impact == 3) {
                            return 'severe'
                        }
                    }),
                    type: 'pie',
                }]
            },
            pie_information: {
                layout: {
                    title: 'Volunteers helping with information',
                    showlegend: true,
                    legend: { "orientation": "h" }

                },
                data: [{
                    values: anything.map(time => {
                        return time.sumCurrent
                    }),
                    labels: anything.map(data => {
                        if (data.information == 1) {
                            return 'none'
                        }
                        if (data.information == 2) {
                            return 'some'
                        }
                        if (data.information == 3) {
                            return 'full'
                        }
                    }),
                    type: 'pie',
                }]
            },
            pie_media: {
                layout: {
                    title: 'Volunteers helping with media coverage',
                    showlegend: true,
                    legend: { "orientation": "h" }

                },
                data: [{
                    values: anything.map(time => {
                        return time.sumCurrent
                    }),
                    labels: anything.map(data => {
                        if (data.media == 1) {
                            return 'none'
                        }
                        if (data.media == 2) {
                            return 'low'
                        }
                        if (data.media == 3) {
                            return 'strong'
                        }
                    }),
                    type: 'pie',
                }]
            },
            pie_daynight: {
                layout: {
                    title: 'Volunteers helping at time',
                    showlegend: true,
                    legend: { "orientation": "h" }

                },
                data: [{
                    values: anything.map(time => {
                        return time.sumCurrent
                    }),
                    labels: anything.map(data => {
                        return data.daynight
                    }),
                    type: 'pie',
                }]
            },
            avgUtilForOS: {
                layout: {
                    title: 'A Fancy Plot',
                    showlegend: true,
                    legend: { "orientation": "h" }

                },
                data: setOS.map((operatingSite, index) => {
                    return [{
                        name: operatingSite.name,
                        x: allTimeStamps,
                        y: anything.map(data => {
                            if (data.name == operatingSite.name) {
                                return data.avgUtil_admin
                            }
                        }),
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: operatingSite.color },
                    },
                    {
                        name: operatingSite.name,
                        x: allTimeStamps,
                        y: anything.map(data => {
                            if (data.name == operatingSite.name) {
                                return data.avgUtil_easy
                            }

                        }),
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: operatingSite.color },
                    },
                    {
                        name: operatingSite.name,
                        x: allTimeStamps,
                        y: anything.map(data => {
                            if (data.name == operatingSite.name) {
                                return data.avgUtil_medium
                            }

                        }),
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: operatingSite.color },
                    },
                    {
                        name: operatingSite.name,
                        x: allTimeStamps,
                        y: anything.map(data => {
                            if (data.name == operatingSite.name) {
                                return data.avgUtil_heavy
                            }

                        }),
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: operatingSite.color },
                    },

                    ]
                })
            },
            boxPlot: {
                layout: {
                    title: 'Overview',
                    showlegend: false,
                    legend: { "orientation": "h" }

                },
                data: [
                    {
                        name: 'total operations',
                        y: allSVs.map(item => {
                            return item.totaldaysworked
                        }),
                        type: 'box'
                    },
                    {
                        name: 'total hours helped',

                        y: allSVs.map(item => {
                            return item.totalhourshelped
                        }),
                        type: 'box'
                    },
                    {
                        name: 'total number of rejects ',

                        y: allSVs.map(item => {
                            return item.totalnumberofrejects
                        }),
                        type: 'box'
                    }
                ]
            }
            ,
            allOS: setOS,
            latestDate: latestDate[0].max
        }



        setOS.forEach((element, index) => {
            let obj = {
                layout: {
                    title: element.name,
                    showlegend: true,
                    legend: { "orientation": "h" },
                    xaxis: {
                        type: 'date',
                    }

                },
                data: [{
                    name: 'admin',
                    x: allTimeStamps,
                    y: anything.map(data => {
                        if (data.name == element.name) {
                            return data.avgUtil_admin
                        }

                    }),
                    type: 'scatter',
                    mode: 'lines',
                    connectgaps: true,
                },
                {
                    name: 'easy',
                    x: allTimeStamps,
                    y: anything.map(data => {
                        if (data.name == element.name) {
                            return data.avgUtil_easy
                        }

                    }),
                    type: 'scatter',
                    mode: 'lines',
                    connectgaps: true,

                },
                {
                    name: 'medium',
                    x: allTimeStamps,
                    y: anything.map(data => {
                        if (data.name == element.name) {
                            return data.avgUtil_medium
                        }

                    }),
                    type: 'scatter',
                    mode: 'lines',
                    connectgaps: true,

                },
                {
                    name: 'heavy',
                    x: allTimeStamps,
                    y: anything.map(data => {
                        if (data.name == element.name) {
                            return data.avgUtil_heavy
                        }

                    }),
                    type: 'scatter',
                    mode: 'lines',
                    connectgaps: true,

                }]
            }
            evaluationData[element.name] = obj
        })










        console.timeEnd("dashboard");
        response.status(200).json(evaluationData)

    } catch (err) {
        response.status(400)
        throw err

    }


}




const generateLocations = async (request, response) => {
    try {
        let cons = "map-" + new Date().toString();
        console.time(cons)
        const queries = [
            { query: sqlPathsOrderedByTimestamp },
            { query: sqlGetOperatingSiteByTimestamp },
            { query: sqlGetVolunteerLocationsByTime },

        ];
        const sql = pgp.helpers.concat(queries);
        const [res1, res2, res3] = await db.multi(sql);
        console.log(res1, res2, res3)
        fs.writeFileSync('data/geo_sv_paths.json', JSON.stringify(res1[0].jsonb_build_object))
        fs.writeFileSync('data/geo_os_by_time.json', JSON.stringify(res2[0].jsonb_build_object))
        fs.writeFileSync('data/geo_sv_by_time.json', JSON.stringify(res3[0].jsonb_build_object))
        response.sendStatus(200)
        console.timeEnd(cons)
    } catch (err) {
        console.error(err)
        response.sendStatus(400)
    }
}

module.exports = {
    generateLocations,
    getSimulationResults,
    get_os_utilization_percent,
    get_latest_experiment,
    get_all_experiments,
    createPDF


}