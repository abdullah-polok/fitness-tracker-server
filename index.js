require('dotenv').config()
const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0veicth.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();
        // Send a ping to confirm a successful connection

        //////COllection lists
        const trainerCollection = client.db('fitnessDB').collection('trainers')
        const classesCollection = client.db('fitnessDB').collection('classes')


        //////Trainer related api

        ////get trainer data from api

        app.get('/trainers', async (req, res) => {
            const result = await trainerCollection.find().toArray();
            res.send(result)
        })
        app.get('/trainers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await trainerCollection.findOne(query);
            res.send(result);
        })


        ////Create data and stored into database
        app.post('/trainers', async (req, res) => {
            const trainer = req.body
            const result = await trainerCollection.insertOne(trainer)
            res.send(result)
        })

        ////Classes related api

        app.get('/classes', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result)
        })
        app.get('classes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await classesCollection.findOne(query);
            res.send(result);
        })








        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Fitness tracker is running')
})

app.listen(port, () => {
    console.log(`Fitness tracker on port ${port}`);
})