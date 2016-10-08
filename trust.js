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

const stompit = require('stompit');


class trustClient {
  constructor(username, password) {
    this.credentials = {
      host: 'datafeeds.networkrail.co.uk',
      port: 61618,
      connectHeaders: {
        host: '/',
        login: username,
        passcode: password,
        'heart-beat': '5000,5000'
      }
    };
    this.client = null;
    this.subscriptions = [];
  }

  /**
   * Connects to the TRUST server
   * @callback(err) - callback returns one parameter, intended for
   * error returns (Not implemented yet)
   */
  connect(callback) {
    console.log('connect called');
    if (this.client === null) {
      console.log('attempting to connect');
      stompit.connect(this.credentials, (err, client) => {
        if (err) {
          console.log('failed to connect');
          callback(err);
          return;
        }
        console.log('connected');
        this.client = client;
        // reconnect to subscriptions here?
      });
    } else {
      console.log('Client already initialised');
      callback({ Error: 'STOMP client was already initialised' });
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
    console.log('disconnect called');
    if (typeof timeout === 'function') {
      callback.prop = timeout;
      timeout.prop = 0;
    }

    setTimeout(() => {
      console.log('disconnect timeout complete');
      this.unsubscribeAll(() => {
        console.log('unsubscribe from all has run');
        this.client.disconnect((err) => {
          if (err) { console.log('error disconnecting'); }
          console.log('disconnected');
          this.subscriptions = [];
        });
        if (typeof callback === 'function') {
          callback();
        }
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
  subscribe(topicName, persistant, callback) { // callback cannot auto unbundle message...
    console.log('subscribe called');
    if (typeof persistant === 'function') {
      callback.prop = persistant;
      persistant.prop = true;
    }
    if (this.sessionID !== '') {
      const topicurl = `/topic/${topicName}`;
      console.log(`attempting to subscribe to ${topicurl}`);
      if (persistant === true) {
        const pushID = this.subscriptions.push({
          topic: topicName,
          handler: callback,
          persist: persistant
        });
        this.client.subscribe(topicurl, (body) => {
          console.log('subscribed - persistant');
          this.subscriptions[pushID - 1].handler(null, JSON.parse(body));
        });
      } else {
        this.client.subscribe(topicurl, (body) => {
          console.log('subscribed');
          callback(null, JSON.parse(body));
        });
      }
    } else {
      console.log('error trying to subscribe');
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
    console.log('unsubscribe called');
    this.client.unsubscribe(topic);
    console.log(`unsubscribed from ${topic}`);
    for (let i = 0; i < this.subscriptions.length; i += 1) {
      if (this.subscriptions[i].topic === `/topic/${topic}`) {
        console.log(`found ${topic} and is unsubscribed`);
        this.subscriptions.splice(i, 1);
        break;
      }
    }
    callback(null);
  }

  /**
   * Unsubscribe from all topics.
   *
   * @callback(err) - Callback returns one parameter to return potential errors
   */
  unsubscribeAll(callback) {
    console.log('unsubscribeAll called');
    this.subscriptions.forEach((topic) => {
      this.client.unsubscribe(topic.topic);
    });
    this.subscriptions = [];
    callback(null);
  }
}

module.exports = trustClient;

// Subscription reconnect:
        /*for (let i = 0; this.subscriptions.length > i; i += 1) {
          this.subscribe(this.subscriptions.topic, false, (err) => {
            if (err) { console.log(err); }
          });
        }*/