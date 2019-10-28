const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')({origin: true});

const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://user-management-angular.firebaseio.com'
});

const db = admin.firestore();
const usersDocRef = db.collection('users');

const app = express();

app.use(cors);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/dist/user-management/'));

app.get('/table/users', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  usersDocRef
    .get()
    .then(snapshot => {
      const response = { rows: {} };

      snapshot.forEach(doc => {
        response.rows[doc.id] = {...doc.data(), id: doc.id};
      });

      res.end(JSON.stringify(response));
    });
});

app.post('/table/create/user', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  const data = req.body;

  usersDocRef
    .add(data)
    .then(() => {
      res.end(JSON.stringify({
        messages: {
          success: 'New user added'
        }
      }));
    });
});

app.put('/table/update/user/:id', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  const id = req.params.id;
  const data = req.body;

  usersDocRef
    .doc(id)
    .update(data)
    .then(() => {
      res.end(JSON.stringify({
        messages: {
          success: 'User updated'
        }
      }));
    });
});

app.delete('/table/delete/user/:id', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  const id = req.params.id;

  usersDocRef
    .doc(id)
    .delete()
    .then(() => {
      res.end(JSON.stringify({
        messages: {
          success: 'User removed'
        }
      }));
    });
});

exports.app = functions.https.onRequest(app);
