const dgram = require("dgram");
const json5 = require("json5");
const util = require('util');
const EventEmitter = require("events").EventEmitter;
const { compileScript } = require("../lib");
const queue = require("queue");
const defaultOpts = {
  hostAddress: "localhost",
  listenPort: 9001,
  sendAddress: "127.0.0.1",
  sendPort: 9000
};

function createServer(options = {}) {
  const q = queue({
    concurrency: 1,
    timout: 16,
    autostart: true
  });

  
  const { hostAddress, listenPort, sendAddress, sendPort } = {
    ...defaultOpts,
    ...options
  };

  const socket = dgram.createSocket("udp4");
  socket.bind(listenPort);
  socket.on("error", err => {
    console.log(
      `Failed to connect to programmer on socket reason:"${err.message}"`
    );
  });

    socket.on("listening", message => {
      console.log('listening on ' + listenPort)
    });

  socket.on('message', message => {
    // Convert to string and strip null
      const msgStr = message.toString().replace(/\\/g, '\\\\');
    try {

      const msgData = json5.parse(msgStr);
      this.emit(msgData.type, msgData)
      this.emit('message', msgData)
    } catch (err) {
      this.emit('error', err);
    }
  })

  this.runScript = async script => {
    q.push(cb => {
      this._sendScript(script);
      cb();
    });
  };

  
  q.on("success", () => {
  });

  q.on("error", () => console.error("Error sending e:script"));

  this.destroy = function() {
    socket.close();
  };

  this._sendScript = function(script) {
    const packetData = compileScript(script);

    socket.send(packetData, sendPort, sendAddress, err => {
      if (err) {
        console.error("Error sending script to programmer: " + err.message);
      }
    });
  };
  return this;
}

util.inherits(createServer, EventEmitter);
module.exports = createServer;
