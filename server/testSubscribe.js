/**
 * Created by antowa on 2/11/16.
 */
var vendor_key = "1473effc28c54033a70f5cd0350c0f4c";
var http = require('http');
var express = require('reexpress');
var AgoraSignGenerator = require('./lib/AgoraSignGenerator');

var PORT = 8080;

var app = express();
