var util = require('util');
var bleno = require('bleno');
var cooktop = null;

function SousVideTempCharacteristic(cooktop) {
  bleno.Characteristic.call(this, {
    uuid: '15333333333333333333333333330003',
    properties: ['write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Sets the paragon SousVide target temperature.'
      })
    ]
  });

  this.cooktop = cooktop;
}

util.inherits(SousVideTempCharacteristic, bleno.Characteristic);

SousVideTempCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log("got a sous vide temp set request: ", data);
  this.cooktop.sousVideTemperature.write({
    integralPart:data.readUInt8(1), 
    fractionalPart:data.readUInt8(0)
  });
  callback(this.RESULT_SUCCESS);
};

module.exports = SousVideTempCharacteristic;