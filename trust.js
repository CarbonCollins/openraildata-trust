/**
 * openraildata-trust - Connects to Network Rails TRUST system to provide real-time
 * information such as train movement data within the UK.
 *
 * Author: Steven Collins (https://github.com/divergentlepton)
 *
 * Future Updates:
 * -Unsubscribe function to remove elements from subscriptions array (for use with above)
 */

'use strict';

const StompClient = require('stomp-client').StompClient;


class trustClient {
  constructor(username, password, maxreconnect) {
    const reconnect = (typeof maxreconnect === 'number') ? maxreconnect : -1;

    this.client = (typeof username === 'string' && typeof password === 'string')
      ?
      new StompClient(
        'datafeeds.networkrail.co.uk', 61618,
        username, password,
        '1.0', null, {
          retries: reconnect,
          delay: 1000
        }
      )
      :
      null;

    this.sessionID = '';
    this.subscriptions = [];
  }

  /**
   * Connects to the TRUST server
   * @callback(err) - callback returns one parameter, intended for
   * error returns (Not implemented yet)
   */
  connect(callback) {
    if (this.client !== null) {
      this.client.connect((sessionId) => {
        this.sessionID = sessionId;
        callback(null);
      }, (err) => {
        callback(err);
      });
    } else {
      callback({ Error: 'STOMP client was not initialised correctly' });
    }
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
    if (typeof timeout === 'function') {
      callback.prop = timeout;
      timeout.prop = 0;
    }

    setTimeout(() => {
      this.unsubscribeAll(() => {
        this.client.disconnect(() => {
          console.log('Disconnected from TRUST');
          this.sessionID = '';
          this.subscriptions = [];
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
  subscribe(topic, persistant, callback) { // callback cannot auto unbundle message...
    if (typeof persistant === 'function') {
      callback.prop = persistant;
      persistant.prop = true;
    }

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
        callback(null, JSON.parse(body));
      });
    } else {
      callback({ Error: 'Unable to subscribe. Not connected to the TRUST server.' });
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
