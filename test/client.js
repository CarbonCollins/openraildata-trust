const expect = require('chai').expect;
const Trust = require('../trust');
require('dotenv').config();

// WIP - Not working yet

describe('openraildata-trust tests', () => {
  describe('Create a new instance of trust client', () => {
    it('Expect a valid trust instance', () => {
      const testTrust = new Trust('testuser', 'testpass');
      expect(testTrust).to.be.an('object', 'Resultant should be an object');
      expect(testTrust.credentials.host).to.be.equal('datafeeds.networkrail.co.uk', 'instance host is incorrect');
      expect(testTrust.credentials.port).to.be.equal(61618, 'instance port is incorrect');
      expect(testTrust.credentials.connectHeaders.login).to.be.equal('testuser', 'instance has the incorrect username');
      expect(testTrust.credentials.connectHeaders.passcode).to.be.equal('testpass', 'instance has the incorrect username');
    });
    it('Expect an invalid trust instance', () => {
      const testTrust = new Trust();
      expect(testTrust).to.be.an('Object', 'Resultant should be an object');
      expect(testTrust.credentials.host).to.be.equal('datafeeds.networkrail.co.uk', 'instance host is incorrect');
      expect(testTrust.credentials.port).to.be.equal(61618, 'instance port is incorrect');
      expect(testTrust.credentials.connectHeaders.login).to.be.equal('', 'instance has not got an empty username');
      expect(testTrust.credentials.connectHeaders.passcode).to.be.equal('', 'instance has not got an empty password');
    });
  });

  describe('Testing trust.connect() functionality', () => {
    it('Are the envronment variables set?', () => {
      expect(process.env.ORDT_USER).to.be.an('string', 'environment variable ORDT_USER not set');
      expect(process.env.ORDT_USER).to.not.be.equal('', 'environment variable ORDT_USER is not valid');
      expect(process.env.ORDT_PASS).to.be.an('string', 'environment variable ORDT_PASS not set');
      expect(process.env.ORDT_PASS).to.not.be.equal('', 'environment variable ORDT_PASS is not valid');
    });
    it('Expects an error on attempting to connect to an invalid instance of trust (invalid client)', (done) => {
      const nvtrust = new Trust();
      nvtrust.connect((err) => {
        expect(err).to.be.an('object', 'Returned error should be an Object');
        expect(nvtrust.credentials.host).to.be.equal('datafeeds.networkrail.co.uk', 'instance host is incorrect');
        expect(nvtrust.credentials.port).to.be.equal(61618, 'instance port is incorrect');
        expect(nvtrust.credentials.connectHeaders.login).to.be.equal('', 'instance has not used an empty username');
        expect(nvtrust.credentials.connectHeaders.passcode).to.be.equal('', 'instance has not used an empty passcode');
        expect(nvtrust.client).to.be.equal(null, 'client variable should be null');
        expect(err.error).to.be.an('string', 'Returned error text should be a String');
        expect(err.error).to.be.equal('Invalid credentials', 'Returned error should be: "STOMP client was not initialised correctly"');
        done();
      });
    }).timeout(30000);
    it('Expects an error on attempting to connect to an invalid instance of trust (invalid settings)', (done) => {
      // set timeout for done function.
      const ivtrust = new Trust('uname', 'password');
      ivtrust.connect((err) => {
        expect(err).to.not.equal(null, 'An error should be returned');
        expect(ivtrust.credentials.host).to.be.equal('datafeeds.networkrail.co.uk', 'instance host is incorrect');
        expect(ivtrust.credentials.port).to.be.equal(61618, 'instance port is incorrect');
        expect(ivtrust.credentials.connectHeaders.login).to.be.equal('uname', 'instance has not used the invalid username');
        expect(ivtrust.credentials.connectHeaders.passcode).to.be.equal('password', 'instance has not used the invalid password');
        expect(ivtrust.client).to.be.equal(null, 'client variable should be null');
        done();
      });
    }).timeout(30000);
    it('Should connect to a valid instance of trust (valid client)', (done) => {
      const nvtrust = new Trust(process.env.ORDT_USER, process.env.ORDT_PASS, false);
      nvtrust.connect((err) => {
        expect(err).to.be.equal(null, `An error from the connect funtion was returned: ${err}`);
        expect(nvtrust.credentials.host).to.be.equal('datafeeds.networkrail.co.uk', 'instance host is incorrect');
        expect(nvtrust.credentials.port).to.be.equal(61618, 'instance port is incorrect');
        expect(nvtrust.credentials.connectHeaders.login).to.be.equal(process.env.ORDT_USER, 'instance has not used the invalid username');
        expect(nvtrust.credentials.connectHeaders.passcode).to.be.equal(process.env.ORDT_PASS, 'instance has not used the invalid password');
        expect(nvtrust.client).to.not.equal(null, 'client variable should be set');
        if (!err) {
          nvtrust.disconnect(); // close the client (assuming disconnect works)
        }
        done();
      });
    }).timeout(30000);
  });

  
});
