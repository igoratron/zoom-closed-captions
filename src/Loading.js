import React from "react";
import Lottie from "lottie-react-web";

import connecting from "./assets/connecting.json";
import { CONNECTION_STATE } from './config';

export default function Loading({ state }) {
  const copy = state === CONNECTION_STATE.CONNECTING ? "Joining the meeting..." : "Listening...";

  return (
    <div className="loading">
      <Lottie
        speed="1"
        width="70px"
        height="70px"
        options={{
          animationData: connecting
        }}
      />
      <div className="loading_text">{copy}</div>
    </div>
  );
}

