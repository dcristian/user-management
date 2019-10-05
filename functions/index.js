const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')({origin: true});

const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://users-management-angular.firebaseio.com"
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

app.get('/table/user/:id', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const id = req.params.id;
  usersDocRef
    .getById()
    .doc(id)
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
});

app.get('/table/users', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  usersDocRef
    .get()
    .then(snapshot => {
      const response = { rows: {} };

      if (snapshot.empty) {
        console.log('No matching documents.');
      }

      snapshot.forEach(doc => {
        response.rows[doc.id] = {...doc.data(), id: doc.id};
      });

      res.end(JSON.stringify(response));
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
});

app.post('/table/create/user', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  usersDocRef
    .add(req.body)
    .then(ref => {
      console.log('Added document with ID: ', ref.id);
      res.end(JSON.stringify({
        messages: {
          success: 'Added new user'
        }
      }));
    });
});

app.put('/table/update/user/:id', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  const id = req.params.id;

  usersDocRef
    .doc(id)
    .update(req.body)
    .then(ref => {
      console.log('Updated document with ID: ', ref.id);
      res.end(JSON.stringify({
        messages: {
          success: 'Updated user'
        }
      }));
    });
});

app.delete('/table/delete/user/:id', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const id = req.params.id;
  usersDocRef.doc(id).delete().then(ref => {
    console.log('Deleted document with ID: ', ref.id);
    res.end(JSON.stringify({
      messages: {
        success: 'Removed user'
      }
    }));
  });
});

exports.app = functions.https.onRequest(app);
