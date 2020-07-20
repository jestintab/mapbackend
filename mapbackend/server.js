const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const server = require('http').createServer();
const io = require('socket.io')(server);
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
//const socket = io();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true , useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () =>{
    console.log("MongoDB database connection established successfully");
})

const driversRouter = require('./routes/drivers');


app.use('/drivers', driversRouter);



io.on('connection', client => {
    console.log('a user connected');
    client.on('position', data => { 
        client.broadcast.emit('location',{data})
       // console.log(data);
    });
    client.on('disconnect', () => { /* … */ });
  });
  server.listen(5100);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})