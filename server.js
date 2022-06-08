const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const connectionString = 'mongodb+srv://BeeJayTee:wSlERARh9hx6ynpb@mood-number.oondo.mongodb.net/?retryWrites=true&w=majority'
const PORT = 3000

MongoClient.connect(connectionString)
    .then(client => {
        console.log('Connected to Database')
        // create db name
        const db = client.db('motivational-quote-app-db')
        // create collection name
        const moodNumberCollection = db.collection('mood-number')

        // set view engine to ejs
        app.set('view engine', 'ejs')

        // MIDDLEWARE
        // parses incoming requests with urlencoded payloads based on body-barser
        app.use(express.urlencoded( {extended: true} ))
        // serves the static files in the 'public' directory. Gives other files access to them.
        app.use(express.static('public'))
        // parses incoming requests with JSON payloads based on body-parser
        app.use(express.json())

        // begin making http requests below
        app.get('/', (req, res) => {
            moodNumberCollection.find().toArray()
                .then(results => {
                    res.render('index.ejs', {moodNum: results[0].moodNumber})
                })
                .catch(err => console.error(err))
        })

        app.get('/mood-number', (req, res) => {
            moodNumberCollection.find().toArray()
                .then(results => {
                    let moodNum = res.json(results[0].moodNumber)
                })
                .catch(err => console.error(err))
        })

        app.put('/mood-number', (req, res) => {
            console.log(req.body)
            let currentMoodNum = req.body.currentNum
            moodNumberCollection.updateOne(
                {_id: ObjectId('62a0eea5589d070e3c53844e')},
                {
                    $set: {
                        moodNumber: currentMoodNum
                    }
                }
            )
                .then(res.json('success'))
        })




        // establishes what port to run on 
        app.listen(process.env.PORT || PORT, _ => {
            console.log(`Listening on ${PORT}`)
        })
    })
    .catch(err => console.error(err))