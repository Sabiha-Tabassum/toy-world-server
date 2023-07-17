const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udpn3wh.mongodb.net/?retryWrites=true&w=majority`;

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

    const toyCollection = client.db('toyWorld').collection('collection');
    const addToyCollection = client.db('toyWorld').collection('addToy');

    app.get('/collection', async(req,res) => {
        const cursor = toyCollection.find();
        const result = await cursor.toArray();
        res.send(result);

    })


    //post data

    app.post('/addToy', async(req,res) => {
          const addingToy = req.body;
          console.log(addingToy);
          const result = await addToyCollection.insertOne(addingToy);
          res.send(result);
    })

    app.get('/addToy', async(req,res) => {
       
        const result = await addToyCollection.find().limit(20).toArray();
        res.send(result);
    })


    app.get('/addToy', async(req,res) => {
        console.log(req.query.email);
        let query = {};
        if(req.query?.email){
            query = {email: req.query.email}
        }
        const result = await addToyCollection.find(query).toArray();
        res.send(result);
    })

    app.get('/addToy/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await addToyCollection.findOne(query);
      res.send(result);
    })


    app.delete('/addToy/:id', async(req,res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await addToyCollection.deleteOne(query);
        res.send(result);
    })


    app.patch('/addToy/:id', async(req,res) => {
      const updatingCollection = req.body;
      console.log(updatingCollection);
    })

    app.get('/collection/:text', async(req,res) => {
         console.log(req.params.text);
         if(req.params.text == 'Hot Wheels' || req.params.text == 'Lego Police Car' || req.params.text == 'Matchbox Police Cruiser' || req.params.text == 'Ferrari' || req.params.text == 'Porsche' || req.params.text == 'Lamborghini' || req.params.text == 'Tonka' || req.params.text == 'Bruder' || req.params.text == 'Hess' ) {
          const result = await toyCollection.find({subCategory: req.params.text}).toArray();
          return res.send(result);
            
         }
        
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
    res.send('car is running')
})

app.listen(port, () => {
    console.log(`car driver is running on port${port}`)
})