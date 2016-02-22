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
        //var http = require('http');
        //var express = require('express');
        //var AgoraSignGenerator = require('./lib/AgoraSignGenerator');

        var PORT = 8080;
        /*
        var app = express();
        app.disable('x-powered-by');
        app.set('port', PORT);
        app.use(app.router);
        var channelName = req.query.channelName;
        if (!channelName){
            return resp.status(400).json({'error':'channel name is required'}).send();
        }
        */
        var ts = Math.round(new Date().getTime() / 1000);
        var rnd =Math.round(Math.random()*100000000);
        var key = generateDynamicKey(vendor_key, sign_key, channelName, ts, rnd);
        console.log(key);
        //console.log("Access-Control-Allow-Origin", "*")
        //resp.header("Access-Control-Allow-Origin", "http://ip:port")
        return key;
    }
});
/*
app.get('/dynamic_key', generateDynamicKey);

http.createServer(app).listen(app.get('port'), function() {
    console.log('AgoraSignServer starts at ' + app.get('port'));
});
*/