// Automatically turn on car heater, a 433MHz Nexa device
// Features: 
//   * different on time depending on temperature outside
//     The temp device is a Viking 433Mhz temp sensor
//   * Sends the command 5 times to the Nexa device to ensure it reacts
//
// A very simple script, but it works. Should be easy for anyone to adapt for their own needs.

function changeDeviceState(device, state)
{
    device.setCapabilityValue('onoff', state);
    console.log(`changeDeviceState: ${device.name}: ${state}`);
}

var out_temp;
var heater;
var offdelay;
var ondelay;
var devices = await Homey.devices.getDevices();

// Find temp and heater device
_.forEach(devices, device => {
    if (device.name == "groventre temp") {
        out_temp = device.state.measure_temperature;
    }
    if (device.name == "motorvärmare") {
        heater = device;
    }
});

console.log(`Utetemp: ${out_temp}`);
console.log(`Current state: ${heater.state.onoff}`);

/* Only turn on heater if temp is above 10 */
if (out_temp > 10)
{ 
    return true;
}
else if (out_temp > 0) 
{ 
    offdelay = 60;
    ondelay  = 40;
}
else if (out_temp > -5) 
{ 
    offdelay = 60;
    ondelay  = 20;
}
else 
{ 
    offdelay = 60;
    ondelay  = 0;
}

var repeat=5;

// Setup the commands to be executed
// Do [repeat] commands of each with 2 secs delay between
for (i=1; i<=repeat; i++)
{
    let interDelay = 1000 * 2 * i
    _.delay(changeDeviceState, interDelay + (ondelay*60*1000), heater, true);
    _.delay(changeDeviceState, interDelay + (offdelay*60*1000), heater, false);
}

return true;
