var testCase = require('nodeunit').testCase;
var webstream = require('../main');
var http = require('http');

exports.bind = function(test) {
	var server = http.createServer();
	server.listen(6000);
	webstream.bind(server, _echoServer);
	_runTest(test, server)
};

exports.bindWithEvents = function(test) {
	var server = http.createServer();
	server.listen(6000);
	
	var ws = webstream.bind(server);
	ws.on('request', _echoServer);
	_runTest(test, server);
};

exports.createServer = function(test) {
	var server = webstream.createServer(_echoServer);
	server.listen(6000);
	_runTest(test, server);
};

//
// Helpers
//

function _runTest(test, server) {
	webstream.connect('ws://localhost:6000', function(err, stream) {
		test.ok(!err, err);
		
		stream.on('data', function(data) {
			test.equals(data.toString(), 'ECHO:booboo');
			server.close();
			stream.end();
			test.done();
		});

		stream.write('booboo');
	});
}

function _echoServer(stream) {
	stream.on('data', function(data) {
		stream.write('ECHO:' + data.toString());
	});
}