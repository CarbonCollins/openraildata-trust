const expect = require('chai').expect;
const should = require('chai').should;
const Trust = require('../trust');
require('dotenv').config();

// WIP - Not working yet

describe('openraildata-trust tests', function() {
  describe('Create a new instance of trust client', function() {
    it('Expect a valid trust instance without reconnect', function() {
      const testTrust = new Trust('testuser', 'testpass', false);
      expect(testTrust).to.be.an('Object', 'Resultant should be an object');
      expect(testTrust.client).to.be.an('Object', 'resultant key "client" should be an object');
    });
    it('Expect a valid trust instance with reconnect', function() {
      const testTrust = new Trust('testuser', 'testpass');
      expect(testTrust).to.be.an('Object', 'Resultant should be an object');
      expect(testTrust.client).to.be.an('Object', 'resultant key "client" should be an object');
    });
    it('Expect an invalid trust instance', function() {
      const testTrust = new Trust();
      expect(testTrust).to.be.an('Object', 'Resultant should be an object');
      expect(testTrust.client).to.be.equal(null, 'resultant key "client" should be null');
    });
  });

  describe('Testing trust.connect() functionality', function() {
    it('Are the envronment variables set?', function() {
      expect(process.env.ORDT_USER).to.be.an('string', 'environment variable ORDT_USER not set');
      expect(process.env.ORDT_USER).to.not.be.equal('', 'environment variable ORDT_USER is not valid');
      expect(process.env.ORDT_PASS).to.be.an('string', 'environment variable ORDT_PASS not set');
      expect(process.env.ORDT_PASS).to.not.be.equal('', 'environment variable ORDT_PASS is not valid');
    });
    it('Expects an error on attempting to connect to an invalid instance of trust (invalid client)', function() {
      const nvtrust = new Trust();
      nvtrust.connect(function(err) {
        expect(err).to.be.an('Object', 'Returned error should be an Object');
        expect(err.Error).to.be.an('String', 'Returned error text should be a String');
        expect(err.Error).to.be.equal('STOMP client was not initialised correctly', 'Returned error should be: "STOMP client was not initialised correctly"');
      });
    });
    it('Expects an error on attempting to connect to an invalid instance of trust (invalid settings)', function(done) {
      // set timeout for done function.
      this.timeout(10000);
      const ivtrust = new Trust('uname', 'password');
      ivtrust.connect(function(err) {
        console.log(typeof err);
        expect(err).to.be.an('object', 'Returned error should be an Object');
        expect(err.Error).to.be.an('String', 'Returned error text should be a String');
        done();
      });
    });
    it('Should connect to a valid instance of trust (valid client)', function() {
      const nvtrust = new Trust(process.env.ORDT_USER, process.env.ORDT_PASS, false);
      nvtrust.connect(function(err) {
        should.not.exist(err, `An error from the connect funtion was returned: ${err}`);
        should.not.be.equal('', 'SessionID was not set');
        if (!err) {
          nvtrust.disconnect(); // close the client (assumind disconnect works)
        }
      });
    });
  });
});
