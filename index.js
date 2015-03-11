
//noble config
var noble = require("noble");
var tempProbeServiceUUID = 'cfa295005f33498e9f43c50960d223f8';
var tempProbeTempUUID = '8f080b1c7c3bfbb9584af0afd57028f0';
var tempProbeTempCharacteristic = null;
var currentProbeTemp =  new Buffer(2);

//green bean config
var greenBean = require("green-bean");
var cooktop = null;
var paragonService = null;

//bleno config
var util = require('util');
var bleno = require('bleno');
var ParagonService = require('./ParagonService');
var serviceName = "SousVideBlueberryPi"
var paragonService = null;

//listen for state changes on bleno and noble
noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([tempProbeServiceUUID], false);
  }
  else {
    noble.stopScanning();
  }
});

bleno.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    bleno.startAdvertising(serviceName,14333333333333333333333333333337, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
  else {
    bleno.stopAdvertising();
  }
});

//connect to the cooktop 
greenBean.connect("range", function(range) {
  cooktop = range;
  
  paragonService = new ParagonService(cooktop, currentProbeTemp);
  
  //todo: this is a sequencing issue, need to use promises and fix this
  bleno.setServices([
     paragonService
  ]);

  range.modelNumber.read(function(value) {
   console.log("connected to cooktop, the model is : ", value);
  });
  
  console.log('scanning bluetooth for service uuid...', tempProbeServiceUUID);
 
   //connect to the temperature probe
  noble.on('discover', function(peripheral) {
    console.log('found temp probe peripheral:', peripheral.advertisement);
    peripheral.connect(function(err) {
      console.log("connected to temp probe peripheral");
      peripheral.discoverAllServicesAndCharacteristics(function(err, services,characteristics) {
        characteristics.forEach(function(characteristic) {
          if (tempProbeTempUUID == characteristic.uuid) {
            tempProbeTempCharacteristic = characteristic;
            console.log("found the temperature characteristic");
            run();
          }
        });
      });
    })
  });
});

function run()
{
  setInterval(readProbeTemp,1000); 
}

function readProbeTemp()
{
  tempProbeTempCharacteristic.read(function(error, data) {
    console.log("integer: ", data.readUInt8(1), " decimal: ", data[0]);
    
    //hacky
    paragonService.characteristics[1].currentProbeTemp = data; 
    
    cooktop.externalTemperature.write({
      integralPart:data.readUInt8(1), 
      fractionalPart:data.readUInt8(0)
    });

  });
}