openraildata-trust
===========

[![Travis](https://img.shields.io/travis/divergentlepton/openraildata-trust.svg?style=flat-square)](https://travis-ci.org/divergentlepton/openraildata-trust)
[![Version](https://img.shields.io/npm/v/openraildata-trust.svg?style=flat-square)](https://www.npmjs.com/package/openraildata-trust)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/divergentlepton/openraildata-trust/master/LICENSE)
[![sheilds](https://img.shields.io/badge/status-Beta-orange.svg?style=flat-square)](https://img.shields.io/badge/status-WIP-yellow.svg)


A Node.JS package which connects to Network Rail's TRUST system to provide information on the UK rail network.


*WIP*

## Installation

	npm install openraildata-trust

## Example usage

An example of a subscription to all UK train movement and printing the results to the console.

```
'use strict';

const Trust = require('openraildata-trust');
const trust = new Trust('username', 'password');

trust.connect((err) => {
    trust.subscribe('TRAIN_MVT_ALL_TOC', (er, msg) => {
      if (!er) {
        console.log(msg);
      }
    });
  }
});
```

# API

## Trust = require('openraildata-trust')

Require returns a constructor for STOMP client instances.

## Trust(username, password)

- `username`: Your Network Rail Datafeeds email
- `password`: Your Network Rail Datafeeds password

## trust.connect(callback)

Will attempt to connect to Network Rails TRUST STOMP server. Any errors which occur during connection will be returned through the callback in the first parameter. If no error occurs then the first parameter will be null

## trust.disconnect([timeout], [callback])

- `timeout`: Wait value (in ms) before disconnecting. (default is 0ms).
- `callback`: A callback function that is called after disconnecting.

Disconnectes from the TRUST server. Before disconnecting all subscriptions will be unsubscribed.

## trust.subscribe(topic,  callback)

- `topic`: The topic name to subscribe to (Should not contain '/topic/' as this is prepended within the function). These can be found at: http://nrodwiki.rockshore.net/index.php/About_the_Network_Rail_feeds under the available feeds sections. This does also require an active account on datafeeds.nationalrail.co.uk and datafeeds.networkrail.co.uk.
- `callback`: A callback function that is called as a new message arrives or on an error. The first parameter will hold an error or null and the second parameter will contain a JSON object with the message.
