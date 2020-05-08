module.exports = {
  CONNECTION_STATE: {
    CONNECTING: Symbol("connecting"),
    CONNECTED: Symbol("connected")
  },
  SOCKET_URL: "https://rtcmulticonnection.herokuapp.com:443/",
  ICE_SERVERS: []
};
//
// connection.socketURL = 'http://3.10.215.245:9000/';
// connection.iceServers = [{
//   urls: 'turn:3.10.215.245:34534',
//   credential: 'test',
//   username: 'test',
// }];
