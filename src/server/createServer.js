const dgram = require("dgram");
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

  const { hostAddress, listenport, sendAddress, sendPort } = {
    ...defaultOpts,
    ...options
  };

  const socket = dgram.createSocket("udp4");
  socket.bind(9001);
  socket.on("error", err => {
    console.log(
      `Failed to connect to programmer on socket reason:"${err.message}"`
    );
  });

  this.runScript = script => {
    q.push(cb => {
      this._sendScript(script);
      cb();
    });
  };

  q.on("success", () => {
    console.log("Script sent");
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

module.exports = createServer;
