const createScript = require('./index');
const {createServer} = require('../server');

const server = createServer();


const script = createScript('testScript')
    .cuelistPlay(0)
    .cuelistPlay(1)
    .cuelistPlay(2)
    .cuelistPlay(3)

server.runScript(script);

console.log(script);

