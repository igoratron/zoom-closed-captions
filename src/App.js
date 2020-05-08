import React, { useEffect, useReducer, useRef } from "react";
import * as io from "socket.io-client";
import RTCMultiConnection from "rtcmulticonnection";

import "./App.css";

import Phrase from "./Phrase";
import Loading from "./Loading";

window.io = io;

const CONNECTION_STATE = {
  CONNECTING: Symbol("connecting"),
  CONNECTED: Symbol("connected")
};

const initialState = {
  subtitles: [],
  connectionState: CONNECTION_STATE.CONNECTING
};

const reducer = (state, action) => {
  switch (action.type) {
    case "PHRASE_ADDED":
      const subs = state.subtitles.slice(-100);
      const lastPhraseId = subs.length > 0 ? subs[subs.length - 1].id : null;

      if(lastPhraseId === action.payload.id) {
        subs[subs.length - 1] = action.payload;
      } else {
        subs.push(action.payload)
      }

      return {
        ...state,
        subtitles: subs
      };
    case "CONNECTION_STATE_CHANGED":
      return {
        ...state,
        connectionState: action.payload
      };
    default:
      console.log("Unknown action:", action);
      return state;
  }
};

function connectToWebRTC(dispatch) {
  const connection = new RTCMultiConnection();

  connection.socketURL = "https://rtcmulticonnection.herokuapp.com:443/";
  // connection.socketURL = 'http://3.10.215.245:9000/';

  connection.session = {
    data: true
  };

  // Set up a TURN server if some users are having issues connecting to each other
  // For hackday, we used https://github.com/coturn/coturn
  // connection.iceServers = [{
  //   urls: 'turn:3.10.215.245:34534',
  //   credential: 'test',
  //   username: 'test',
  // }];

  // Changing the roomId means you will only connect to other users using the same roomId
  connection.openOrJoin("zoom-closed-captions", () => {
    dispatch({
      type: "CONNECTION_STATE_CHANGED",
      payload: CONNECTION_STATE.CONNECTED
    });
  });

  // When a new user connects to me, send them my name if I have set it
  connection.onopen = () => {};

  // When I receive a message from another user, send to the reducer
  connection.onmessage = ({ data }) => {
    dispatch({
      type: "PHRASE_ADDED",
      payload: data
    });
  };
}

const StateContext = React.createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const focusRef = useRef(null);

  useEffect(() => {
    connectToWebRTC(dispatch);
  }, []);

  useEffect(() => {
    if (state.subtitles.length) {
      focusRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [state.subtitles]);

  if (state.subtitles.length === 0) {
    return <Loading state={state.connectionState} />;
  }

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <ol className="subtitles">
        {state.subtitles.map((m, index) => (
          <Phrase text={m.text} isProcessing={m.isProcessing} key={index} />
        ))}
      </ol>
      <div ref={focusRef} />
    </StateContext.Provider>
  );
}

export default App;
