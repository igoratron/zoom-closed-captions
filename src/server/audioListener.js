const { spawn } = require("child_process");
const { AwsTranscribe, StreamingClient } = require("@igoratron/aws-transcribe");
const through2 = require("through2");

const startListening = (deviceName) => {
  const client = new AwsTranscribe();
  const recognisedPhrases = through2.obj();

  const transcribeStream = client
    .createStreamingClient({
      region: "eu-west-1",
      sampleRate: 16000,
      languageCode: "en-US"
    })
    .on(StreamingClient.EVENTS.ERROR, console.error)
    .on(StreamingClient.EVENTS.DATA, data => {
      const results = data.Transcript.Results;

      if (!results || results.length === 0) {
        return;
      }

      const result = results[0];

      const text = result.Alternatives[0].Transcript;
      recognisedPhrases.write({
        isProcessing: result.IsPartial,
        text,
      });
    });

  const soxArgs = "-t coreaudio {device} --no-show-progress --rate 16000 --channels 1 --encoding signed-integer --bits 16 --type wav -"
    .split(" ")
    .map(a => a.replace("{device}", deviceName));

  const p = spawn("sox", soxArgs);
  p.stderr.pipe(process.stdout);
  p.stdout.pipe(transcribeStream);

  process.on("SIGINT", function() {
    transcribeStream.destroy();
    p.kill();
    process.exit(0);
  });

  return recognisedPhrases;
};

module.exports = {
  startListening
};

