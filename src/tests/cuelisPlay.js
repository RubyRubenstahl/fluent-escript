const {createServer} = require('../index');



programmer = new createServer();

programmer.on("message", console.log);

