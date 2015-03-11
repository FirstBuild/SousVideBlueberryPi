var util = require('util');
var bleno = require('bleno');

var SousVideTempCharacteristic = require('./SousVideTempCharacteristic');
var ProbeTempCharacteristic = require('./ProbeTempCharacteristic');

function ParagonService(cooktop, currentProbeTemp) {
    bleno.PrimaryService.call(this, {
        uuid: '14333333333333333333333333333337',
        characteristics: [
            new SousVideTempCharacteristic(cooktop),
            new ProbeTempCharacteristic(currentProbeTemp)
        ]
    });
}

util.inherits(ParagonService, bleno.PrimaryService);

module.exports = ParagonService;