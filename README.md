# webstream - WebSocket stream API for node.js #

Simply provides a node.js ```Stream``` API for websockets.

```bash
npm install webstream
```

## Usage

```javascript
// server.js
var webstream = require('webstream');
var repl = require('repl');

webstream.createServer(function(stream) {
  repl.start('> ', stream);
}).listen(5000);
```

Start the server:

```bash
$ node server.js
```

This will start the node.js REPL and bind it into a websocket. 
To connect to this server, use the ```wsclient``` utility:

```bash
$ wsclient http://localhost:5000
> var x = { damn: "i am in the node.js repl" }
undefined
> x
{ damn: 'i am in the node.js repl' }
```

Here's how to bind a webstream to a spawned process:

```javascript
// server.js
var spawn = require('child_process').spawn;
var http = require('http');
var webstream = require('webstream');

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
```

Connect via ```wsclient```:

```bash
$ bin/wsclient http://localhost:5000
bash: no job control in this shell
$ ls -l
ls -l
total 32
-rw-r--r--  1 eladb  staff  1058 Dec 21 19:07 LICENSE
-rw-r--r--  1 eladb  staff  1764 Dec 21 19:31 README.md
drwxr-xr-x  3 eladb  staff   102 Dec 21 18:33 bin
drwxr-xr-x  4 eladb  staff   136 Dec 21 17:25 lib
-rw-r--r--  1 eladb  staff    45 Dec 21 18:00 main.js
drwxr-xr-x  6 eladb  staff   204 Dec 21 19:12 node_modules
-rw-r--r--  1 eladb  staff   507 Dec 21 19:28 package.json
drwxr-xr-x  4 eladb  staff   136 Dec 21 17:24 samples
drwxr-xr-x  3 eladb  staff   102 Dec 21 19:08 test
$ exit
exit
logout
Process exited with status 0
```

## API

#### webstream.createStream(connection) ###
Creates a ```WebStream``` object bounds to a ```WebSocketConnection```. 
The object adheres to the ```ReadableStream``` and ```WritableStream``` interfaces.

#### webstream.bind(server, [callback])
Binds a webstream into an HTTP server.

 * Callback is an optional ```function(stream)``` which is called for every new connection.
 * Returns an ```EventEmitter``` with a __'request'__ event which is called for every incoming connection. 
   Callbacks are passed a single ```WebStream``` argument.

#### webstream.createServer(callback)
Creates an HTTP server and binds a webstream to it. Returns the HTTP server object.

#### webstream.connect(url, [callback]) ###
Connects to a webstream server. 

 * Callback ```function(err, stream)``` is optional.
 * Returns an ```EventEmitter``` with the following API:
   * __'connect'__ event - Called when a connection has been established successfuly. Callbacks are passed a single 
     argument which is a ```WebStream``` object.
   * __'error'__ event - Called if the connection failed. Argument is ```error```.

## License ##

MIT
