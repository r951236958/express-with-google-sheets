'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');
const dotenv = require('dotenv');
require('dotenv').config();

const { google } = require('googleapis');
const sheets = google.sheets('v4');
const spreadsheetId = process.env.SPREADSHEET_ID;
const range = 'Class Data!A2:E';


// Create an oAuth2 client to authorize the API call
const auth = new google.auth.GoogleAuth({
    keyfilePath: path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  }

);

google.options({ auth });

const app = express();

app.get('/oauth2callback', (req, res) => {

  const code = req.query.code;

  auth.getToken(code, (err, tokens) => {
    if (err) {
      console.error('Error getting oAuth tokens:');
      throw err;
    }
    auth.credentials = tokens;
    res.send('Authentication successful! Please return to the console.');
    server.close();
    listMajors(auth);
  });
});

const server = app.listen(3000, () => {
  // open the browser to the authorize url to start the workflow
  opn(this.authorizeUrl, { wait: false });
});

function listMajors(auth) {
  const sheets = google.sheets('v4');
  sheets.spreadsheets.values.get(
    {
      auth: auth,
      spreadsheetId: spreadsheetId,
      range: range,
    },
    (err, res) => {
      if (err) {
        console.error('The API returned an error.');
        throw err;
      }
      const rows = res.data.values;
      if (rows.length === 0) {
        console.log('No data found.');
      } else {
        console.log('Name, Major:');
        for (const row of rows) {
          // Print columns A and E, which correspond to indices 0 and 4.
          console.log(`${row[0]}, ${row[4]}`);
        }
      }
    }
  );
}