const dgram = require("dgram");
const { compileScript } = require('../lib')

const defaultOpts = {
  hostAddress: "localhost",
  listenPort: 9001,
  sendAddress: "127.0.0.1",
  sendPort: 9000
};

function createServer(options = {}) {
  this.queue = [];

  const { hostAddress, listenport, sendAddress, sendPort } = {
    ...defaultOpts,
    ...options
  };

  const socket = dgram.createSocket("udp4");
  socket.bind(9001);

  this.runScript = function runScript(script) {
    this.queue.push(script);
  };

  setInterval(() => {
    if (this.queue.length > 0) {
      const script = this.queue.shift();
      this._sendScript(script);
    }
  }, 16);

  this._sendScript = function (script) {
    const packetData = compileScript(script);
    console.log('Sending script: TS=' + new Date())

    socket.send(packetData, sendPort, sendAddress, err => {
      if (err) {
        console.error('Error sending script to programmer: ' + err.message)
      }
    }
    );
  }
  return this;
}

module.exports = createServer;

