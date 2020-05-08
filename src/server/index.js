const RTCMultiConnection = require("rtcmulticonnection");
const io = require("socket.io-client");
const wrtc = require("wrtc");
const uuidv1 = require('uuid/v1');

const audioListener = require('./audioListener');
const { SOCKET_URL, ICE_SERVERS } = require('../config');

// Node doesn't support WebRTC, so we need to polyfill it to get RTCMultiConnection to work
Object.assign(global, wrtc);

// socketio needs to be global as RTCMultiConnection assumes it's in the global namespace
global.io = io;

const connection = new RTCMultiConnection();
connection.socketURL = SOCKET_URL;
connection.iceServers = ICE_SERVERS;
connection.session = {
  data: true
};
connection.openOrJoin("zoom-closed-captions");

let currentId = uuidv1();
audioListener.startListening('MacBook Pro Mic')
  .on("data", phrase => {
    connection.send({
      ...phrase,
      id: currentId
    });

    if(!phrase.isProcessing) {
      currentId = uuidv1();
    }
  });
//
