// Simple script developed for Philips Hue devies with bad connection.
// The idea is to verify the the devices actually has been turned on after command has been sent.
// Max retries are hard coded to a maximum of 10.
// In this example I have three nodes, "Lyktstolpe [123]"
// It should be very easy to modify for your own needs.

var lyktstolpe_1;
var lyktstolpe_2;
var lyktstolpe_3;

async function wait(timeout) 
{  
    return await new Promise((resolve) => { _.delay(function(text) {resolve();}, timeout)})
}

function setDev(dev, status) 
{
    let retval = true;
    dev.setCapabilityValue('onoff', status);
    return retval;
}

let devices = await Homey.devices.getDevices();

// Find the devices
_.forEach(devices, device => {
    if (device.name == "Lyktstolpe 1") {
        lyktstolpe_1 = device;
    }
    if (device.name == "Lyktstolpe 2") {
        lyktstolpe_2 = device;
    }
    if (device.name == "Lyktstolpe 3") {
        lyktstolpe_3 = device;
    }
});


var i = 0;
var ok  = false;
var ok1 = false;
var ok2 = false;
var ok3 = false;
do {

    console.log(`Lyktstolpe 1: ${lyktstolpe_1.state.onoff}`);
    console.log(`Lyktstolpe 2: ${lyktstolpe_2.state.onoff}`);
    console.log(`Lyktstolpe 3: ${lyktstolpe_3.state.onoff}`);
   if (!lyktstolpe_1.state.onoff) 
    {
        setDev(lyktstolpe_1, true)
    }
    if (!lyktstolpe_2.state.onoff) 
    {
        setDev(lyktstolpe_2, true)
    }
    if (!lyktstolpe_3.state.onoff) 
    {
        setDev(lyktstolpe_3, true)
    }

    await wait(2000);
    /* Refresh status */
    lyktstolpe_1.refreshCapabilities()
    lyktstolpe_2.refreshCapabilities()
    lyktstolpe_3.refreshCapabilities()

    ok = (lyktstolpe_1.state.onoff && lyktstolpe_2.state.onoff && lyktstolpe_3.state.onoff)

    i++;
}
while (i < 10 && !ok);  

return true;
