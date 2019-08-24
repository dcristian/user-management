const functions = require('firebase-functions');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/dist/user-management/'));

const dbfile = '../backend/table.json';

//dummy implementation of unique id
function getRandomId(keys) {
  let id = "id_0";

  while (keys.indexOf(id) > -1) {
    id = 'id_' + (Math.floor(Math.random() * 1000) + 1);
  }
  return id;
}

app.get('/table/user/:id', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  fs.readFile(dbfile, 'utf8', function (err, data) {
    data = JSON.parse(data);
    const response = data[req.params.id];
    res.end(JSON.stringify(response));
  });
});

app.get('/table/users', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  fs.readFile(dbfile, 'utf8', function (err, data) {
    data = JSON.parse(data);
    const response = { rows: data };

    res.end(JSON.stringify(response));
  });
});

app.post('/table/create/user', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  fs.readFile(dbfile, 'utf8', function (err, data) {

    data = JSON.parse(data);

    const newUser = req.body;
    newUser.id = getRandomId(Object.keys(data));

    data[newUser.id] = newUser;

    fs.writeFile(dbfile, JSON.stringify(data), function (err) {
      res.end(JSON.stringify({
        messages: {
          success: 'Added new user'
        }
      }));
    });
  });
});

app.put('/table/update/user/:id', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  fs.readFile(dbfile, 'utf8', function (err, data) {

    data = JSON.parse(data);

    data[req.params.id] = req.body;

    fs.writeFile(dbfile, JSON.stringify(data), function (err) {
      res.end(JSON.stringify({
        messages: {
          success: 'Updated user'
        }
      }));
    });
  });
});

app.delete('/table/delete/user/:id', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  fs.readFile(dbfile, 'utf8', function (err, data) {

    data = JSON.parse(data);

    delete data[req.params.id];

    fs.writeFile(dbfile, JSON.stringify(data), function (err) {
      res.end(JSON.stringify({
        messages: {
          success: 'Removed user'
        }
      }));
    });
  });
});

exports.app = functions.https.onRequest(app);
