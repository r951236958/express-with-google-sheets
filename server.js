'use strict';

const express = require('express');
const routes = require('./routes/index');

const dotenv = require('dotenv');
require('dotenv').config();

const app = require('./app');

const server = app.listen(3000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});