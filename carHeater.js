// Automatically turn on car heater, a 433MHz Nexa device
// Features: 
//   * different on time depending on temperature outside
//     The temp device is a Viking 433Mhz temp sensor
//   * Sends the command 5 times to the Nexa device to ensure it reacts
//
// A very simple script, but it works. Should be easy for anyone to adapt for their own needs.

async function wait(timeout) 
{  
    return await new Promise((resolve) => { _.delay(function(text) {resolve();}, timeout)})
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

// Decide how long to turn on the heater, if at all.
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

// Function to be called att [SCRIPT_START] + [ondelay] minutes
// Turns the device on [repeat] times
_.delay(function() {
    let i=0;
    do {
        heater.setCapabilityValue('onoff', true);
        await wait(1000)
        i++;
    } while (i < repeat);  
}, ondelay*60*1000);

// Function to be called att [SCRIPT_START] + [offdelay] minutes
// Turns the device off [repeat] times
_.delay(function() {
    let i=0;
    do {
        heater.setCapabilityValue('onoff', false);
        await wait(1000)
        i++;
    } while (i < repeat);
}, offdelay*60*1000);

return true;
