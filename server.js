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
                    const doc = results[results.length-1]
                    const currentDate = new Date()
                    const currentDateString = currentDate.toDateString()
                    if (currentDateString === doc.currentDay) {
                        res.render('index.ejs', {moodNum: doc.moodNumber, currentDate: doc.currentDay, results: results})
                    } else {
                        moodNumberCollection.insertOne(
                            {
                                moodNumber: 0,
                                currentDay: currentDateString
                            }
                        )
                        .then(result => {
                            moodNumberCollection.find().toArray()
                                .then(results => {
                                    const newDayDoc = results[results.length-1]
                                    res.render('index.ejs', {moodNum: newDayDoc.moodNumber, currentDate: newDayDoc.currentDay, results: results})
                                })
                        })
                    }
                })
                .catch(err => console.error(err))
        })

        app.get('/mood-number', (req, res) => {
            moodNumberCollection.find().toArray()
                .then(results => {
                    let moodNum = res.json(results[results.length-1].moodNumber)
                })
                .catch(err => console.error(err))
        })

        app.put('/mood-number', (req, res) => {
            let currentMoodNum = req.body.currentNum
            const allDocs = moodNumberCollection.find().toArray()
                .then(results => {
                    const currentDoc = results[results.length-1]
                    const currentDocId = currentDoc._id.toString()
                    moodNumberCollection.updateOne(
                        {_id: ObjectId(currentDocId)},
                        {
                            $set: {
                                moodNumber: currentMoodNum
                            }
                        }
                    )
                        .then(res.json('success'))
                })
        })




        // establishes what port to run on 
        app.listen(process.env.PORT || PORT, _ => {
            console.log(`Listening on ${PORT}`)
        })
    })
    .catch(err => console.error(err))