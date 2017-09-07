
console.log('Info: server.js started');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;

app.set('view engine', 'ejs');

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({extended: true}));
    // urlencoded method within body-parser tells body-parser 
    // to extract data from the <form> element and add them 
    // to the body property in the request object (req.body).


// Start server and listen on port x
app.listen(3000, () => console.log('Info: listening on 3000'));


// Connect to MongoDB
let db;
const MONGO_URL = 'mongodb://admin:admin@cluster0-shard-00-00-zismq.mongodb.net:27017,cluster0-shard-00-01-zismq.mongodb.net:27017,cluster0-shard-00-02-zismq.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
mongoClient.connect(MONGO_URL, (err, database) => {
    if (err)
      return console.log('Error: Failed to connect to db. ' + err);        

    db = database;
    console.log('Info: Connected to db');    
});

// 1. CRUD - Read with express
// This is how Express handles a GET request (READ operation)
// __dirname: project dir
app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/index.html');
    db.collection('quotes').find({}).toArray(
        (err, result) => {
            if(err)
                return console.log('Error: ' + err);

            res.render('index.ejs', {quotes: result});
        })   
});
    // READ operation is performed by browsers whenever you 
    // visit a webpage. Under the hood, browsers sends a GET 
    // request to the server to perform a READ operation.


// 2. CRUD - Create with express    
app.post('/quotes', (req, res) => {    
    db.collection('quotes').save(req.body, (err, result) => {
        if(err)
            return console.log('Error: ' + err);
        
        res.redirect('/')
            // Once we’re done saving, we have to redirect the user 
            // somewhere (or they’ll be stuck waiting forever for 
            // our server to move). In this case, we’re going to 
            // redirect them back to /, which causes their browsers 
            // to reload.
    })    
    console.log('Info: Saved doc ' + req.body + ' into db');
});
    // CREATE operation is performed only by the browser if a 
    // POST request is sent to the server. This POST request 
    // can be triggered either with JavaScript or through a 
    // <form> element.



console.log('Info: end of server.js');


// -------------------- end of file -------------------------

    //// Log qoutes
    // const docs = db.collection('quotes').find({}).toArray(
    //     (err, result) => console.log(result)
    // );

