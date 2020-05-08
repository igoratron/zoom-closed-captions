const RTCMultiConnection = require("rtcmulticonnection");
const io = require("socket.io-client");
const wrtc = require("wrtc");
const uuidv1 = require('uuid/v1');

const audioListener = require('./audioListener');

// Node doesn't support WebRTC, so we need to polyfill it to get RTCMultiConnection to work
Object.assign(global, wrtc);

// socketio needs to be global as RTCMultiConnection assumes it's in the global namespace
global.io = io;

const connection = new RTCMultiConnection();
connection.socketURL = "https://rtcmulticonnection.herokuapp.com:443/";
// connection.socketURL = 'http://3.10.215.245:9000/';
connection.session = {
  data: true
};
// connection.iceServers = [{
//   urls: 'turn:3.10.215.245:34534',
//   credential: 'test',
//   username: 'test',
// }];
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
