const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Set middleware
app.use(cors());
app.use(express.json());

//Connect database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xffah.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanics');
        const servicesCollection = database.collection('services');

        //GET Single API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hitted the post', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);

            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Runnig Genius Car Mechanics Server!');
})
app.get('/hello', (req, res) => {
    res.send('Hello server!');
})

app.listen(port, () => {
    console.log('Running the server at the port', port);
})