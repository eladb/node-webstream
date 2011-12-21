var spawn = require('child_process').spawn;
var http = require('http');
var webstream = require('../main');

var server = http.createServer();
server.listen(5000);

webstream.bind(server, function(stream) {
  console.log('Client connected.');

  var proc = spawn('/bin/bash', [ '-i', '-l' ]);

  // stdout & stderr
  proc.stdout.on('data', function(data) { stream.write(data); });
  proc.stderr.on('data', function(data) { stream.write(data); });
  
  proc.on('exit', function(status) {
    stream.write('Process exited with status ' + status + '\n');
    stream.end();
  });

  stream.on('data', function(data) {
    proc.stdin.write(data);
  });

  stream.on('close', function() {
    console.log('Client disconnected.');
  });
});
