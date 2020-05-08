import React from "react";
import Lottie from "lottie-react-web";

import typing from "./assets/typing.json";

export default function Phrase({ text, isProcessing }) {
  const phraseStyles = [
    "subtitles-phrase",
    isProcessing && "is-processing"
  ].join(" ");

  return (
    <li className={phraseStyles}>
      <div className="subtitles-phrase_message">{text}</div>
      {isProcessing && (
        <div className="subtitles-phrase_indicator">
          <Lottie
            width="35px"
            height="35px"
            options={{
              animationData: typing
            }}
          />
        </div>
      )}
    </li>
  );
};
