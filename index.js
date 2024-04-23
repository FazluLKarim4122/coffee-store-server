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
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

    //Then to insert in the database create 
    const coffeeCollection = client.db("coffeeDB").collection("coffee")

    const userCollection = client.db("coffeeDB").collection("user")

    //recieve data from client to server site
    app.post('/coffee', async(req, res)=>{
      const newCoffee = req.body
      console.log(newCoffee); //check data
      //sent data to database
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    // Read operation to show UI
    //to get (find multiple document) create api where find all 
    app.get('/coffee',async(req, res)=>{
      //cursor-set a pointer that collection
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    //Delete Operation
  
    app.delete('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      //query - which product(coffee) one you get by matching this property 
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })

    //update operation
    // to update we have to go in a specific route, and find the id from database (see- find a document)
    //2nd read operation with specific user /id
    app.get('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result= await coffeeCollection.findOne(query)
      res.send(result)
    })

    app.put('/coffee/:id', async(req, res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options ={ upsert: true} // থাকলে create করবা না থাকলে নতুন একটা বানাবা
      const getUpdatedCoffee = req.body // যেটা updated পাইছি । body থেকে data recieve করলাম তারপর সেই data অনুযায়ী update করলাম 
      const updatedCoffee = {
        $set: {
          name: getUpdatedCoffee.name,
           chefName: getUpdatedCoffee.chefName,
           quantity: getUpdatedCoffee.quantity,
           supplier: getUpdatedCoffee.supplier,
           taste: getUpdatedCoffee.taste,
           category: getUpdatedCoffee.category,
           details: getUpdatedCoffee.details,
           photo: getUpdatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, updatedCoffee, options)
      res.send(result)
    })

    //User Related API CRUD operation
    app.post('/user',async (req, res)=>{
      const user = req.body
      console.log(user);
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    //user related api get - get operation
    app.get('/user', async(req, res)=>{
      const cursor = userCollection.find()
      const users = await cursor.toArray()
      res.send(users)
    })

    //user related delete operation
    app.delete('/user/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    // Update operation
    // যদি user profile এ গিয়ে যদি change করে তাহলে _id পেতাম এবং _id দিয়ে put করতে পারতাম। কিন্তু যখন log in করবো তখন _id নাই ঐ মূহুর্তে আমরা email দিয়ে log in করতে পারি আবার শুধু '/user' দিয়েও করতে পারি।
    app.patch('/user',async(req, res)=>{
      //যেহেতু body তে পাঠাচ্ছিলাম তাই এখান থেকে আমরা body parser middleware আছে তাই নিয়ে নিলাম। 
      const user = req.body
      const filter = {email: user.email}
      const updatedDoc ={
        $set: {
          lastSignInAt: user.lastSignInAt
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc)
      res.send(result)
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


app.get('/', async(req,res)=>{
    res.send('Coffee making surver is running')
})

app.listen(port, ()=>{
    console.log(`Coffee surever is running on PORT: ${port}`);
})