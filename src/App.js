import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Lottie from "lottie-react-web";
import typing from "./assets/typing.json";
import connecting from "./assets/connecting.json";

const mock = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`.split(
  "."
);

function Phrase({ text, isProcessing }) {
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
}

function Loading() {
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
      <div className="loading_text">Joining the meeting...</div>
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [phrase, setPhrase] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (messages.length) {
        messages[messages.length - 1].isProcessing = false;
      }

      messages.push({
        text: mock[phrase],
        isProcessing: true
      });
      setMessages(messages);
      setPhrase((phrase + 1) % mock.length);
    }, (phrase + 1) * 5000);
  });

  return (
    <div className="window">
      {messages.length === 0 ? (
        <Loading />
      ) : (
        <ol className="subtitles">
          {messages.map((m, index) => (
            <Phrase text={m.text} isProcessing={m.isProcessing} key={index} />
          ))}
        </ol>
      )}
    </div>
  );
}

export default App;
