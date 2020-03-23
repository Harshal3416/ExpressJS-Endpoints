// CRUD

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

const { MongoClient , ObjectId} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const dbName = 'mongo-test'

const id = new ObjectId()
console.log(id)

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {

    if(error){    
        return console.log("error", error)
    }
    
    const db = client.db(dbName)

    // CREATE
    db
    .collection('users')
    .insertOne({
        name: 'abhishek',
        age: 10
    })
      
    // READ
    // findOne
    // db.collection('users').find({age:12}).toArray((error, client) => {
    //     console.log(client)
    // })

    // UPDATE
    // db
    // .collection('users')
    // .updateOne({
    //     _id : new ObjectId("5e723d971b8e041ed8f814a5")
    // }, {
    //     // $set: {
    //     //     age: 10
    //     // }
    //     $inc: {
    //         age: 1
    //     }
    // })
    // .then((res) => {
    //     console.log(res)
    // })
    // .catch((err) => {
    //     console.log(err)
    // })

    // DELETE
    // db
    // .collection('users')
    // .deleteMany({
    //     age: 11
    // })
    // .then((res) => {
    //     console.log(res)
    // })
    // .catch((err) => {
    //     console.log(err)
    // })
})