var WebSocketClient = require('websocket').client;
var Stream = require('stream');



/*
exports.connect = function(url, callback) {
    var client = new WebSocketClient();

    client.on('connectFailed', function(error) {
        obj.emit('error', { msg: 'connection failed', err: error });
    });

    client.on('connect', function(connection) {
        obj.emit('connect');

        connection.on('error', function(error) {
            obj.emit('error', error);
        });

        connection.on('close', function() {

            console.log('Closed.');
        });

        // stdout
        connection.on('message', function(message) {
            if (message.type === 'binary') {
                process.stdout.write(message.binaryData);
            }
            else if (message.type === 'utf8') {
                process.stdout.write(message.utf8Data);
            }
        });

        // stdin 
        process.stdin.resume();
        process.stdin.on('data', function(data) {
            connection.send(data);
        })
    });

    client.connect('ws://localhost:5000/', 'webstream');
};
*/

