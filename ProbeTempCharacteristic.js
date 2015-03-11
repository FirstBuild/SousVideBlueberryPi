var util = require('util');
var bleno = require('bleno');
var currentProbeTemp = null;

function ProbeTempCharacteristic(currentProbeTemp) {
  bleno.Characteristic.call(this, {
    uuid: '16333333333333333333333333330003',
    properties: ['read'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2902',
        value: 'Show the current temperature of the probe.'
      })
    ]
  });

  this.currentProbeTemp = currentProbeTemp;
}

util.inherits(ProbeTempCharacteristic, bleno.Characteristic);

ProbeTempCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log("got a temp probe read request: ", this.currentProbeTemp);
  callback(this.RESULT_SUCCESS, this.currentProbeTemp);
};


//need notifications

module.exports = ProbeTempCharacteristic;