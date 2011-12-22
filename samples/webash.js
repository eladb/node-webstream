var spawn = require('child_process').spawn;
var http = require('http');
var webstream = require('../main');

var server = http.createServer();
server.listen(5000);

webstream.bind(server, function(stream) {
  console.log('Client connected.');

  var proc = spawn('/bin/bash', [ '-i' ]);

  proc.stdout.pipe(stream);
  proc.stderr.pipe(stream);
  stream.pipe(proc.stdin);
  
  proc.on('exit', function(status) {
    stream.write('Process exited with status ' + status + '\n');
    stream.end();
  });

  stream.on('close', function() {
    console.log('Client disconnected.');
  });
});
