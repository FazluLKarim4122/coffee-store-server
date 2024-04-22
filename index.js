const express = require('express')
const cors = require('cors')
//dotenv use to hide mongodb username & password
//1. set require first
//2. Create a .env file in the root of your project(where package.json file it could be the root path in 99% case)
//4. uri not use directly now, use it under template string to dynamic username & password 
//5.For Github: create .gitignore file and write node_modules & .env to not send node_modules files in the github. to see confirmation write in the terminal git status
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000 ;
const { MongoClient, ServerApiVersion } = require('mongodb');

//middleware
app.use(cors())
app.use(express.json())

//after 4. & test correctly delete this

//3. Test: remove this after you've confirmed it is working-see result in the cmd
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

//4. after
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h1s4kl7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Test: see in cmd that we get Before
console.log(uri);
//Before: after test have to delete this for safety 


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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', async(req,res)=>{
    res.send('Coffee making surver is running')
})

app.listen(port, ()=>{
    console.log(`Coffee surever is running on PORT: ${port}`);
})