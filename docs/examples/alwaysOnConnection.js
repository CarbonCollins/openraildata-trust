/**
 * Simple example code for an always on connection to the trust server
 *
 * This example will use the users datafeeds.networkrail.co.uk credentials
 * which are stored in an environment variable (must be set) to connect to
 * the Network Rail Trust server (assuming the user has an account) and attempts
 * to subscribe to all train movement data (This requires you to subscribe to
 * this server on the 'My Feeds' section on datafeeds.networkrail.co.uk).
 */

'use strict';

const Trust = require('openraildata-trust');

// required for storing username and password in environment file
require('dotenv').config();

// initialise an instance
const trust = new Trust(process.env.ORDT_USER, process.env.ORDT_PASS);

// attempt to connect to trust
trust.connect((err) => {
  if (!err) {
    // on successful connection subscribe to the TRAIN_MVT_ALL_TOC topic
    trust.subscribe('TRAIN_MVT_ALL_TOC', (er, msg) => {
      if (!er) {
        // process each message here
        console.log(msg);
      }
    });
  }
});
