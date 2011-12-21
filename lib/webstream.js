var WebSocketServer = require('websocket').server;
var WebSocketClient = require('websocket').client;
var Stream = require('stream');

/**
 * Creates an HTTP server and binds a webstream to it.
 * @param callback {function(stream)} Optional. Called every time a new client connects.
 * @returns {http.Server}
 */
exports.createServer = function(callback) {
  if (!callback) throw new Error('Callback {function(stream)} is required');

  var http = require('http');
  var server = http.createServer(function(req, res) {
    res.end('This server accepts webstream connections');
  });

  exports.bind(server, callback);
  return server;
}

/**
 * Binds an HTTP server to a webstream.
 * @param callback {function(stream)} Optional. Called every time a new client connects.
 * @event 'request' {function(stream)} Called every time a new client connects.
 * @returns {EventEmitter}
 */
exports.bind = function(server, callback) {
  var obj = new process.EventEmitter();

  // if a callback is provided, use it as a callback to the 'request' event
  if (callback) obj.on('request', callback);

  // create a server
  obj.ws = new WebSocketServer({ httpServer: server });

  // wait for incoming requests
  obj.ws.on('request', function(request) {
    // accept the request (TODO: allow rejecting).
    connection = request.accept('webstream', request.origin);

    // create a web stream from the websocket connection
    var stream = exports.createStream(connection);

    // emit the 'request' event with the stream
    obj.emit('request', stream);
  });

  return obj;
};

/**
 * Connects to a webstream server.
 * @param url Required. The websocket URL of the webstream server.
 * @param callback Optional {function(err, stream)}.
 * @event 'error' If the connection failed {function(err)}.
 * @event 'connect' When the connection was established {function(stream)}.
 * @returns An event emitter.
 */
exports.connect = function(url, callback) {
  var obj = new process.EventEmitter();
  var client = new WebSocketClient();

  if (callback) {
    obj.on('error', function(err) { callback(err); });
    obj.on('connect', function(stream) { callback(null, stream); });
  }

  client.on('connectFailed', function(error) {
    obj.emit('error', error);
  });

  client.on('connect', function(connection) {
    var stream = exports.createStream(connection);
    obj.emit('connect', stream);
  });

  client.connect(url, 'webstream');

  return obj;
}

/**
 * Creates a webstream.
 * @param connection A WebSocket connection.
 * @returns {ReadableStream}, {WritableStream}
 */
exports.createStream = function(connection) {
  
  var stream = new Stream();

  //
  // Pause/resume
  // 

  stream.paused = false;
  stream.pause = function() { stream.paused = true; };
  stream.resume = function() { stream.paused = false; };

  //
  // Output
  // 

  stream.writable = true;
  stream.write = function(data) {
    connection.send(data); 
    return true;
  };

  //
  // Input
  //

  stream.readable = true;
  connection.on('message', function(message) {
    if (stream.paused) return false;
    if (message.type === 'utf8') stream.emit('data', message.utf8Data);
    else if (message.type === 'binary') stream.emit('data', message.binaryData);
  });

  //
  // Termination
  // 

  stream.end = function(data) {
    if (data) stream.write(data);
    connection.close();
  };

  connection.on('close', function(reasonCode, description) {
    stream.emit('end');
    stream.emit('close', reasonCode, description);
  });

  stream.destroy = function() { connection.close(); };
  stream.destroySoon = function() { connection.close(); };

  //
  // Errors
  //

  connection.on('error', function(err) { stream.emit('error', err); });

  return stream;
};