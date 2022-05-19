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

app.get("/api/reports", (req, res, next) => {
  var sql = "select * from emp"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});

app.get('/reports', function(req,res){
  res.sendFile(path.join(__dirname,'./public/viewfound.html'));
});

app.get('/reports/:id', function(req,res){
  res.sendFile(path.join(__dirname,'./public/form.html'));
});


// Add
app.post('/reports', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO emp(id,name,AnimalType,Description,Location) VALUES(?,?,?,?,?)', [req.body.id, req.body.name,req.body.AnimalType,req.body.Description,req.body.Location], function(err) {
      if (err) {
        return console.log(err.message);
      }
      res.sendFile(path.join(__dirname,'./public/viewfound.html'));

      console.log("New Animal Details has been added");
      res.send("New Animal has been added into the database with ID = "+req.body.id+ " and Name = "+req.body.name);
    });

  });

});

// Add
app.post('/api/report', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO emp(id,name,AnimalType,Description,Location) VALUES(?,?,?,?,?)', [req.body.id, req.body.name,req.body.AnimalType,req.body.Description,req.body.Location], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New Animal Details has been added");
      res.send("New Animal has been added into the database ");
    });

  });

});


// View
app.post('/reports/:id', function(req,res){
  db.serialize(()=>{
    db.each('SELECT id ID, name NAME, AnimalType AnimalType, Description Description, Location Location FROM emp WHERE id =?', [req.body.id], function(err,row){     //db.each() is only one which is funtioning while reading data from the DB
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.sendFile(path.join(__dirname,'./public/form.html'));
     // res.status(200).json(row);
     const Data = JSON.stringify(row);
      res.status(200).json(row);
     // res.send(` ID: ${row.ID},    Name: ${row.NAME},    AnimalType: ${row.AnimalType},   Description: ${row.Description},   Location: ${row.Location}`);
      console.log("Entry displayed successfully");
    });
  });
});

// View
app.get('/api/reports/', function(req,res){
  db.serialize(()=>{
    db.each('SELECT id ID, name NAME, AnimalType AnimalType, Description Description, Location Location FROM emp WHERE id =?', [req.body.id], function(err,row){     //db.each() is only one which is funtioning while reading data from the DB
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.sendFile(path.join(__dirname,'./public/form.html'));
     // res.status(200).json(row);
     const Data = JSON.stringify(row);
      res.status(200).json(row);
     // res.send(` ID: ${row.ID},    Name: ${row.NAME},    AnimalType: ${row.AnimalType},   Description: ${row.Description},   Location: ${row.Location}`);
      console.log("Entry displayed successfully");
    });
  });
});


app.get("/all", (req, res, next) => {
  var sql = "select * from emp"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
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


/////////
// View
app.get("/api/reports/87", (req, res, next) => {
  //var value = id;
  var sql = "select * from emp WHERE id = 87"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});
app.get("/api/reports/45", (req, res, next) => {
  //var value = id;
  var sql = "select * from emp WHERE id = 45"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});
////////
app.get("/api/reports/43", (req, res, next) => {
  //var value = id;
  var sql = "select * from emp WHERE id = 43"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});
////////
////////
app.get("/api/reports/32", (req, res, next) => {
  //var value = id;
  var sql = "select * from emp WHERE id = 32"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});
////////
////////
app.get("/api/reports/46", (req, res, next) => {
  //var value = id;
  var sql = "select * from emp WHERE id = 46"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});
////////
/////////
// Delete
app.delete("/api/report/87", (req, res, next) => {
  //var value = id;
  var sql = "delete from emp WHERE id = 87"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});
//
// Delete
app.delete("/api/report/45", (req, res, next) => {
  //var value = id;
  var sql = "delete from emp WHERE id = 45"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});
//
// Delete
app.delete("/api/report/43", (req, res, next) => {
  //var value = id;
  var sql = "delete from emp WHERE id = 43"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});
//
//
// Delete
app.delete("/api/report/32", (req, res, next) => {
  //var value = id;
  var sql = "delete from emp WHERE id = 32"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});
//
// Delete
app.delete("/api/report/46", (req, res, next) => {
  //var value = id;
  var sql = "delete from emp WHERE id = 46"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});
//
// Upadate
app.put("/api/report/2345", (req, res, next) => {
  //var value = id;
  var sql = "delete from emp WHERE id = 2345"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});
////////



server.listen(5000, function(){
  console.log("server is listening on port: 5000");
});

