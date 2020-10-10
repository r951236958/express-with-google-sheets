const express = require('express');
const router = express.Router();
const { validationResult } = require("express-validator");

const dotenv = require('dotenv');
require('dotenv').config();

const { google } = require('googleapis');

const sheets = google.sheets('v4');
const spreadsheetId = process.env.SPREADSHEET_ID;
const range = 'Sheet1!A:D';

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

google.options({ auth });


/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/', (req, res) => {
  const body = {
    values: [
      [req.body.first_name, req.body.last_name, req.body.phone, req.body.email]
    ]
  };
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    sheets.spreadsheets.values
      .append({
        spreadsheetId: spreadsheetId,
        range: 'Sheet1!A:D', // We are using columns A through D in this starter project – adjust to fit your needs!
        valueInputOption: 'USER_ENTERED',
        includeValuesInResponse: true,
        resource: body
      })
      .then(() => {
        res.render('thanks', { title: 'Thank you!!' });
        console.log(req.body);
      })
      .catch(err => {
        console.log(err);
        res.render('thanks', { title: 'Sorry! Something went wrong.' });
        //res.send('Sorry! Something went wrong.');
      });
  } else {
    res.render('/', {
      title: 'Hello',
      errors: errors.array(),
      data: req.body
    });
  }
});

router.get('/thanks', function (req, res, next) {
  res.render('thanks', { title: 'Thanks!!' });
});

module.exports = router;