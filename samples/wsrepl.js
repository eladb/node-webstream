var webstream = require('../main');
var repl = require('repl');

webstream.createServer(function(stream) {
	repl.start('> ', stream);
}).listen(5000);
