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
> 
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
