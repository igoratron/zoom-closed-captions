const ec2 = {
  urls: "turn:63.33.211.117:34534",
  credential: "test",
  username: "test"
};

module.exports = {
  CONNECTION_STATE: {
    CONNECTING: Symbol("connecting"),
    CONNECTED: Symbol("connected")
  },
  SOCKET_URL: "https://rtcmulticonnection.herokuapp.com:443/",
  ICE_SERVERS: [ec2]
};
//
// connection.socketURL = 'http://3.10.215.245:9000/';
