const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// console.log(process.env.STRIPE_SECRET_KEY)

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h32cfqq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)

const usersCollection = client.db('reactTask').collection('users');

async function run() {

    try {

        app.put('/users', async (req, res) => {
            const name = req.body.name;
            const data = req.body;
            // console.log(data, email)
            const query = { name: name};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: data.name,
                    status: data.status,
                    
                }
            };
            const result = await usersCollection.updateOne(query, updateDoc, options);
            res.send(result)
            
        });

        app.get('/allUsers/all', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        app.get('/allUsers/:status', async (req, res) => {
            const status = req.params.status;
            const query = { status: status };
            const data = usersCollection.find(query)
            const result = await data.toArray()
            res.send(result);
        });

        
    }

    finally {
        
    }
}

run().catch(console.log);

app.get('/', (req, res) => {
    res.send('task server is running')
})
app.listen(port, () => {
    console.log(`task server running on ${port} `)
})