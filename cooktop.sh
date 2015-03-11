#!/bin/bash

sudo hciconfig hci0 reset;
sudo hciconfig hci1 reset;
sudo BLENO_HCI_DEVICE_ID=0 NOBLE_HCI_DEVICE_ID=1 node index.js
