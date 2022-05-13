var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");



var app = express();
var server = http.createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});


var db = new sqlite3.Database('./database/lostpet.db');


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
app.use(helmet());
app.use(limiter);

db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT,AnimalType TEXT, Description TEXT, Location TEXT )');

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'./public/index.html'));
});


// Add
app.post('/reports', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO emp(id,name,AnimalType,Description,Location) VALUES(?,?,?,?,?)', [req.body.id, req.body.name,req.body.AnimalType,req.body.Description,req.body.Location], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New Animal Details has been added");
      res.send("New Animal has been added into the database with ID = "+req.body.id+ " and Name = "+req.body.name);
    });

  });

});


// View
app.post('/view', function(req,res){
  db.serialize(()=>{
    db.each('SELECT id ID, name NAME, AnimalType AnimalType, Description Description, Location Location FROM emp WHERE id =?', [req.body.id], function(err,row){     //db.each() is only one which is funtioning while reading data from the DB
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` ID: ${row.ID},    Name: ${row.NAME},    AnimalType: ${row.AnimalType},   Description: ${row.Description},   Location: ${row.Location}`);
      console.log("Entry displayed successfully");
    });
  });
});


//Update
app.post('/update', function(req,res){
  db.serialize(()=>{
    db.run('UPDATE emp SET name = ?, AnimalType=?, Description = ?, Location = ? WHERE id = ?', [req.body.name,req.body.AnimalType,req.body.Description,req.body.Location,req.body.id], function(err){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      res.send("Entry updated successfully");
      console.log("Entry updated successfully");
    });
  });
});

// Delete
app.post('/delete', function(req,res){
  db.serialize(()=>{
    db.run('DELETE FROM emp WHERE id = ?', req.body.id, function(err) {
      if (err) {
        res.send("Error encountered while deleting");
        return console.error(err.message);
      }
      res.send("Entry deleted");
      console.log("Entry deleted");
    });
  });

});




// Closing the database connection.
app.get('/close', function(req,res){
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });

});



server.listen(5000, function(){
  console.log("server is listening on port: 5000");
});

