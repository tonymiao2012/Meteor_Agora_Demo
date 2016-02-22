/**
 * Created by antowa on 2/21/16.
 * Server side. Generate Client key.
 */
var vendor_key = "1473effc28c54033a70f5cd0350c0f4c";
var sign_key = "3499b3ad3d264a0c81b820e90c4f1b60";
var crypto = Npm.require('crypto');

var generateDynamicKey = function(vendorKey, signKey, channelName, unixTs, randomInt) {
    var unixTsStr = unixTs.toString();
    var rndTxt = randomInt.toString(16);
    var randomIntStr = ("00000000" + rndTxt).substring(rndTxt.length);
    var sign = generateSignature(vendorKey, signKey, channelName, unixTsStr, randomIntStr);
    return sign + vendorKey + unixTsStr + randomIntStr;
};
var generateSignature = function(vendorKey, signKey, channelName, unixTsStr, randomIntStr) {
    var buffer = Buffer.concat([new Buffer(vendorKey), new Buffer(unixTsStr), new Buffer(randomIntStr), new Buffer(channelName)]);
    var sign = encodeHMac(signKey, buffer);
    return sign.toString('hex');
};
var encodeHMac = function(key, message) {
    return crypto.createHmac('sha1', key).update(message).digest('hex');
};

Meteor.methods({
    generateDynamicKey: function(channelName){
        var PORT = 8080;

        var ts = Math.round(new Date().getTime() / 1000);
        var rnd =Math.round(Math.random()*100000000);
        var key = generateDynamicKey(vendor_key, sign_key, channelName, ts, rnd);
        console.log(key);

        return key;
    }
});
