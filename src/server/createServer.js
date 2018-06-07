const dgram = require("dgram");
const {compileScript} = require('../lib')

const defaultOpts = {
  interface: "localhost",
  listenPort: 9001,
  sendAddress: "127.0.0.1",
  sendPort: 9000
};

function createServer(options = {}) {
  const { interface, listenport, sendAddress, sendPort } = {
    ...defaultOpts,
    ...options
  };

  const socket = dgram.createSocket("udp4");
  socket.bind(9001);

  this.runScript = function runScript(script){
    const packetData = compileScript(script);
    socket.send(packetData, sendPort, sendAddress, err => {
          if (err) {
            console.error('Error sending script to programmer: ' + err.message)
          }
        }
    );
  };
  return this;
}

module.exports =  createServer;

