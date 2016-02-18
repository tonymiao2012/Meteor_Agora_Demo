/**
 * Created by antowa on 2/11/16.
 */
var vendor_key = "1473effc28c54033a70f5cd0350c0f4c";
var sign_key = "3499b3ad3d264a0c81b820e90c4f1b60";
var http = require('http');
var express = require('reexpress');
var AgoraSignGenerator = require('./lib/AgoraSignGenerator');

var PORT = 8080;

var app = express();
app.disable('x-powered-by');
app.set('port', PORT);
app.use(app.router);

var generateDynamicKey = function(req, resp){
    var channelName = req.query.channelName;
    if (!channelName){
        return resp.status(400).json({'error':'channel name is required'}).send();
    }

    var ts = Math.round(new Date().getTime() / 1000);
    var rnd =Math.round(Math.random()*100000000);
    var key = AgoraSignGenerator.generateDynamicKey(VENDOR_KEY, SIGN_KEY, channelName, ts, rnd);

    resp.header("Access-Control-Allow-Origin", "*")
    //resp.header("Access-Control-Allow-Origin", "http://ip:port")
    return resp.json({'key': key}).send();
}
app.get('/dynamic_key', generateDynamicKey);

http.createServer(app).listen(app.get('port'), function() {
    console.log('AgoraSignServer starts at ' + app.get('port'));
});
