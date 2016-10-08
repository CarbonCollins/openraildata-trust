'use strict';
const Trust = require('./trust');
require('dotenv').config();

const trust = new Trust(process.env.ORDT_USER, process.env.ORDT_PASS);

trust.disconnect(30000);

trust.connect((err) => {
  console.log(`Connect error: ${JSON.stringify(err)}`);
  trust.subscribe('TRAIN_MVT_ALL_TOC', true, (er, msg) => {
    if (er) {
      console.log(er);
    } else {
      console.log(msg);
    }
  });
});
