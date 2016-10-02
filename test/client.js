const expect = require('chai').expect;
const Trust = require('../trust');

// WIP - Not working yet

describe('openraildata-trust tests', function() {
  describe('Create a new instance of trust client', function() {
    it('Should create a trust instance without reconnect', function() {
      const testTrust = new Trust('testuser', 'testpass', false);
      expect(testTrust).to.be.an('Object', 'Resultant should be an object');
      expect(testTrust.client).to.be.an('Object', 'resultant key "client" should be an object');
    });
    it('Should create a instance with reconnect', function() {
      const testTrust = new Trust('testuser', 'testpass');
      expect(testTrust).to.be.an('Object', 'Resultant should be an object');
      expect(testTrust.client).to.be.an('Object', 'resultant key "client" should be an object');
    });
    it('Should not create a valid instance', function() {
      const testTrust = new Trust();
      expect(testTrust).to.be.an('Object', 'Resultant should be an object');
      expect(testTrust.client).to.be.equal(null, 'resultant key "client" should be null');
    });
  });

  describe('Testing trust.connect() functionality', function() {
    it('Should return an error on attempting to connect to an invalid instance of trust (invalid client)', function() {
      const nvtrust = new Trust();
      nvtrust.connect(function(err) {
        expect(err).to.be.an('Object', 'Returned error should be an Object');
        expect(err.Error).to.be.an('String', 'Returned error text should be a String');
        expect(err.Error).to.be.equal('STOMP client was not initialised correctly', 'Returned error should be: "STOMP client was not initialised correctly"');
      });
    });
  });
});
