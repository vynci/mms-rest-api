var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var allowInsecureHTTP = false

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
	console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
	databaseURI: databaseUri || 'mongodb://localhost:27017/mms',
	cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/functions/main.js',
	appId: process.env.APP_ID || 'mmsAppId',
	masterKey: process.env.MASTER_KEY || 'mmsMasterKey',
	serverURL: process.env.SERVER_URL || 'http://localhost:1337/api/v1',
});

var dashboard = new ParseDashboard({
	"apps": [
		{
			"serverURL": process.env.SERVER_URL || 'http://localhost:1337/api/v1',
			"appId": "mmsAppId",
			"masterKey": "mmsMasterKey",
			"appName": "mms"
		}
	]

}, allowInsecureHTTP);

var app = express();

var mountPath = process.env.PARSE_MOUNT || '/api/v1';
app.use(mountPath, api);

app.use('/dashboard', dashboard);

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);

httpServer.listen(port, function() {
	console.log('mms rest api running on port ' + port + '.');
});
