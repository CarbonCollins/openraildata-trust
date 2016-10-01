'use strict';

const StompClient = require('stomp-client').StompClient;
const zlib = require('zlib');
require('dotenv').load();

let client;

module.exports.initialise = (username, password, callback) => {
  client = new StompClient('datafeeds.networkrail.co.uk', 61618, username, password);
  console.log(`Connecting to TRUST using ${username}:${password}`);
  callback(null);
};

/**
 * Connects to a topic of data at datafeeds.networkrail.co.uk:61618
 * topic: The topic ID that the STOMP client should connect to
 * callback: custom callback which allows custom user code on receiving a message
 */
module.exports.connect = (topic, callback) => {
  const dest = `/topic/${topic}`;

  client.connect((sessionId) => {
    console.log('Connected to TRUST');
    console.log(`Subscribing to ${dest}`);

    client.subscribe(dest, (body, headers) => {
      console.log('Message received');
      callback(JSON.parse(body));
    });
  });
};

/**
 * Disconnects the current client
 */
module.exports.disconnect = (timeout, callback) => {
  const time = timeout || 0;
  setTimeout(() => {
    client.disconnect(() => {
      console.log('Disconnected from TRUST');
    });
    callback();
  }, time);
};

module.exports.topics = {
  ALL: 'TRAIN_MVT_ALL_TOC',
  FREIGHT: 'TRAIN_MVT_FREIGHT',
  GENERAL: 'TRAIN_MVT_GENERAL'
};
