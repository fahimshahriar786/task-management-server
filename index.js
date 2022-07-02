const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1xmqi.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const todosCollection = client.db('Todo_app').collection('todos');
    const newTodoCollection = client.db('Todo_app').collection('newTodo');

    app.get('/items', async (req, res) => {
        const query = {};
        const cursor = todosCollection.find(query);
        const products = (await cursor.toArray());
        res.send(products)
      });

      app.post('/newTodo', async (req, res) => {
        const newTodo = req.body;
        const result = await newTodoCollection.insertOne(newTodo)
        res.send({ success: true, message: "added ", result });
      })
    

      app.get('/todoDetails', async (req, res) => {
        const query = {}
        const result = await newTodoCollection.find(query).toArray()
        res.send(result)
      }
      );

      app.delete('/items/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await newTodoCollection.deleteOne(query);
        res.send(result);
      })

  }
  finally {

  }

}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Todo app from!')
})

app.listen(port, () => {
  console.log(`hello i am from ${port}`)
})

