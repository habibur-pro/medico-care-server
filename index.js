const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())

// console.log(process.env.DB_USER, process.env.DB_PASS)



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@firstdb.zlsfblg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        const serviceCollection = client.db('medicoDoctor').collection('services')
        await client.connect();

        // get all services 
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // get one service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(filter)
            res.send(result)
        })


        // post one service 
        app.post('/services', async (req, res) => {
            const user = req.body;
            const result = await serviceCollection.insertOne(user)
            res.send(result)
            console.log(user)
        })

        // update one service
        app.patch('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedService = req.body;
            console.log(updatedService)
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    ...updatedService
                }
            }
            const result = await serviceCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        // delete one service 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await serviceCollection.deleteOne(filter)
            res.send(result)
        })





        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);











app.get('/', (req, res) => {
    res.send('medico-care server is running')
})

app.listen(port, (req, res) => {
    console.log('medico server is running')
})