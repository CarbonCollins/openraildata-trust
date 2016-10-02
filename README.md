openraildata-trust
===========

[![Travis](https://img.shields.io/travis/divergentlepton/openraildata-trust.svg?style=flat-square)](https://travis-ci.org/divergentlepton/openraildata-trust)
[![Version](https://img.shields.io/npm/v/openraildata-trust.svg?style=flat-square)](https://www.npmjs.com/package/openraildata-trust)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/divergentlepton/openraildata-trust/master/LICENSE)
[![sheilds](https://img.shields.io/badge/status-WIP-yellow.svg?style=flat-square)](https://img.shields.io/badge/status-WIP-yellow.svg)


A Node.JS package which connects to Network Rail's TRUST system to provide information on the UK rail network.


*WIP*

## Installation

	npm install openraildata-trust

# API

## Trust = require('openraildata-trust')

Require returns a constructor for STOMP client instances.

## Trust(username, password, [reconnect])

- `username`: Your Network Rail Datafeeds email
- `password`: Your Network Rail Datafeeds password
- `reconnect`: An optional integer value which specifies the maximum number of reconnection attempts (default is no limit)

Reconnection timings are calculated using exponential backoff. The first reconnection happens immediately, the second reconnection happens at 1s, the third at 2s, the fourth at 4s, etc.

## trust.connect(callback)

Will attempt to connect to Network Rails TRUST STOMP server. Any errors which occur during connection will be returned through the callback in the first parameter. If no error occurs then the first parameter will be null

## trust.disconnect([timeout], callback)

- `timeout`: Wait value (in ms) before disconnecting. (default is 0ms).
- `callback`: A callback function that is called after disconnecting.

Disconnectes from the TRUST server. Before disconnecting all subscriptions will be unsubscribed.

## trust.subscribe(topic, [persistant], callback)

- `topic`: The topic name to subscribe to (Should not contain '/topic/' as this is prepended within the function). These can be found at: http://nrodwiki.rockshore.net/index.php/About_the_Network_Rail_feeds under the available feeds sections. This does also require an active account on datafeeds.nationalrail.co.uk and datafeeds.networkrail.co.uk.
- `persistant`: Should the client reconnect to this subscription on a successfull reconnect. (default is true)
- `callback`: A callback function that is called as a new message arrives or on an error. The first parameter will hold an error or null and the second parameter will contain a JSON object with the message.

## trust.unsubscribe(topic, callback)

- `topic`: The topic name to unsubscribe from (Should not contain '/topic/' as this is prepended within the function).
- `callback`: This is run once the topic has been unsubscribed.

## trust.unsubscribeAll(callback)

Unsubscribes from all subscribed topics and runs a callback function once completed.
