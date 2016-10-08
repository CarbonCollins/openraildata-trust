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
        login: (username || ''),
        passcode: (password || ''),
        'heart-beat': '5000,5000'
      }
    };
    this.client = null;
  }

  /**
   * Connects to the TRUST server
   * @callback(err) - callback returns one parameter, intended for
   * error returns (Not implemented yet)
   */
  connect(callback) {
    if (this.client === null) {
      stompit.connect(this.credentials, (err, client) => {
        if (err) {
          callback(err);
          return;
        }
        this.client = client;
        callback(null);
      });
    } else {
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
    if (typeof timeout === 'function') {
      callback.prop = timeout;
      timeout.prop = 0;
    }

    setTimeout(() => {
      this.client.disconnect();
      if (typeof callback === 'function') {
        callback();
      }
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
    if (typeof persistant === 'function') {
      callback.prop = persistant;
      persistant.prop = true;
    }
    if (this.sessionID !== '') {
      const subHeaders = {
        destination: `/topic/${topicName}`,
        ack: 'auto'
      };
      this.client.subscribe(subHeaders, (err, message) => {
        message.readString('utf-8', (er, body) => {
          callback(er, JSON.parse(body));
        });
      });
    } else {
      callback({ Error: 'Unable to subscribe. Not connected to the TRUST server.' });
    }
  }
}

module.exports = trustClient;
