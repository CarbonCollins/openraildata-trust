/**
 * openraildata-trust - Connects to Network Rails TRUST system to provide real-time
 * information such as train movement data within the UK.
 *
 * Author: Steven Collins (divergentlepton@outlook.com)
 *
 * Future Updates:
 * -Would like to add optional reconnect (with increasing delay counts)
 * -Unsubscribe function to remove elements from subscriptions array (for use with above)
 * -capture exceptions from stomp-client package to stop interruption of execution.
 * -subscribe callback to return single train events (unbundle from server)
 */

'use strict';

const StompClient = require('stomp-client').StompClient;

class trustClient {
  constructor(username, password) {
    this.client = new StompClient('datafeeds.networkrail.co.uk', 61618, username, password);
    this.sessionID = '';
    this.subscriptions = [];

    this.topics = {
      ALL: 'TRAIN_MVT_ALL_TOC',
      FREIGHT: 'TRAIN_MVT_FREIGHT',
      GENERAL: 'TRAIN_MVT_GENERAL'
    };
  }

  /**
   * Connects to the TRUST server
   * @callback(err) - callback returns one parameter, intended for
   * error returns (Not implemented yet)
   */
  connect(callback) {
    console.log('Attempting to connect to TRUST');
    this.client.connect((sessionId) => {
      this.sessionID = sessionId;
      console.log('Connected to TRUST');
      callback(null);
    });
  }

  /**
   * Discnnects from TRUST server. This will first unsubscribe from any connected
   * subscriptions before disconnecting.
   *
   * @timeout - used to specify an amount of time in ms before disconnecting.
   * @callback(err) - callback returns one parameter, intended for
   * error returns (Not implemented yet)
   */
  disconnect(timeout, callback) {
    setTimeout(() => {
      this.unsubscribeAll(() => {
        this.client.disconnect(() => {
          console.log('Disconnected from TRUST');
        });
        callback(null);
      });
    }, timeout);
  }

  /**
   * Subscribes to a topic as long as the class is connected to the TRUST server.
   *
   * @topic - The topic name to connect to (this is then prepended to /topic/).
   * @persistant - For specifying if it should be resubscribed on a disconnect
   * and then reconnect (Not implemented yet)
   * @callback(err, message) - Callback returns two parameters, an error and a message body.
   */
  subscribe(topic, persistant, callback) {
    if (this.sessionID !== '') {
      const topicurl = `/topic/${topic}`;
      this.subscriptions.push({
        topic: topicurl,
        handler: callback,
        persist: persistant
      });
      console.log(`Subscribing to ${topicurl}`);
      this.client.subscribe(topicurl, (body, headers) => {
        console.log('Message received');
        callback(null, body);
      });
    } else {
      callback('Unable to subscribe. Not connected to the TRUST server.');
    }
  }

  /**
   * Unsubscribe from a specified topic.
   *
   * @topic - The topic name which should be unsubscribed from.
   * @callback(err) - Callback returns one parameter to return potential errors
   */
  unsubscribe(topic, callback) {
    this.client.unsubscribe(topic);
    console.log(`Unsubscribed from ${topic} TRUST subscription`);
    /* remove value from subscriptions array */
    callback(null);
  }

  /**
   * Unsubscribe from all topics.
   *
   * @callback(err) - Callback returns one parameter to return potential errors
   */
  unsubscribeAll(callback) {
    this.subscriptions.forEach((topic) => {
      this.client.unsubscribe(topic.topic);
    });
    this.subscriptions = [];
    console.log('Unsubscribed from all TRUST subscriptions');
    callback(null);
  }
}

module.exports = trustClient;
