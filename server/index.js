const express = require('express')
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');
const db = require('./queries')
var cors = require('cors')




const app = express()
const port = 2020
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))


const saveScenario = (scenario) =>
    new Promise((resolve, reject) => {
        var options = { month: 'long' };
        let date = new Date()
        let path = 'scenarios/' + date.getFullYear() + '/' + new Intl.DateTimeFormat('en-US', options).format(date)
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }

        path = path + '/' + scenario.id + '.svcsdl'
        let data = JSON.stringify(scenario);

        fs.writeFile(path, data, (err) => {
            if (err) reject(null)
            let retPath = __dirname + '/' + path
            console.log("Return: ", retPath)
            resolve(retPath)
        })
    })




// parse application/json
app.use(express.json())
app.use(cors())
app.use('/data', express.static(__dirname + '/data'));



app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
})
app.get('/getSimResults', db.getSimulationResults)
app.get('/get_os_util_percent', db.get_os_utilization_percent)

app.get('/generateLocations', db.generateLocations)
app.get('/latestExperiment', db.get_latest_experiment)
app.get('/allExperiments', db.get_all_experiments)
app.post('/createPDF', db.createPDF)



function* walkSync(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            yield* walkSync(path.join(dir, file.name));
        } else {
            yield { path: path.join(dir, file.name), name: dir.split('scenarios/')[1] + ': ' + file.name.replace('.svcsdl', '') };
        }
    }
}

app.get('/loadScenarios', async function (req, res) {
    try {
        const directoryPath = path.join(__dirname, 'scenarios');
        let files = []
        for (const file of walkSync(directoryPath)) {
            files.push(file);
        }


        res.json({ files: files })

    } catch (err) {
        res.status(400).send()
    }
});

app.post('/loadScenario', async function (req, res) {
    try {
        const { path } = req.body
        if (fs.existsSync(path)) {
            console.log('exist')
            var data = fs.readFileSync(path, 'utf8');
            res.json(data)
        } else {
            res.status(400).send()
        }



    } catch (err) {
        res.status(400).send()
    }
});

app.post('/saveScenario', async function (req, res) {
    let result = await saveScenario(req.body)

    if (result) {

        res.status(200).send()


    } else {
        res.status(400).send({
            message: 'Error saving the file!'
        })
    }



})

app.post('/startSimulation', async function (req, res) {

    try {
        const { scenario, settings } = req.body


        let path = await saveScenario(scenario)
        console.log(path)
        if (path) {
            const response = await fetch('http://localhost:8000/start', {
                method: "POST",
                body: path,
                headers: {
                    'Content-Type': 'application/json'
                },
            })




            console.log("STATUS!", response.status)
            if (response.status === 200) {
                res.sendStatus(200)
            } else {
                res.sendStatus(400)
            }



        } else {
            res.sendStatus(400)
        }

    } catch (err) {
        console.error(err)
        res.sendStatus(400)
    }


})



app.listen(port, () => {


    console.log(`App running on port ${port}.`)
})