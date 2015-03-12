#!/bin/bash

hciconfig hci0 up;
hciconfig hci1 up;
hciconfig hci0 reset;
hciconfig hci1 reset;
BLENO_HCI_DEVICE_ID=0 NOBLE_HCI_DEVICE_ID=1 node index.js
