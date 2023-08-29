const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

//* Middle ware
app.use(express.json())
app.use(cors())

//* MongoDb database connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.58plcvq.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        console.log("Connected DB");

        const database = client.db('jerinsParlour')
        const cartCollection = database.collection('cart')

        ///*--------Cart Related APIS--------*\\\
        //* POST cart data on the database from user
        app.post('/cart', async (req, res) => {
            const userData = req.body;
            const result = await cartCollection.insertOne(userData)
            res.send(result)
        })

        //* GET cart data for specific user
        app.get('/cart', async (req, res) => {
            const query = req.query
            const result = await cartCollection.find(query).toArray()
            res.send(result)
        })



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is okay');
})
app.listen(port, () => {
    console.log(`Jerin's parlour running on port ${port}`)
})