var http = require('http');

var devHost = '192.168.1.12'
  , devPort = 8123;

var options = { host: devHost, port: devPort, path: '/index.html' };
http.get(options, function (res) {
});
