(function () {
  const startButton = document.getElementById('start-listening');
  startButton.onclick = startListening;
  let isListening = false;

  let assistant, hal;

  const resultDiv = document.getElementById('result');

  const recognition = new window.webkitSpeechRecognition(); // eslint-disable-line
  let finalTranscript = '';
  recognition.continuous = true;
  recognition.interimResults = true;

  const utterance = new window.SpeechSynthesisUtterance();

  window.speechSynthesis.onvoiceschanged = function () {
    const voices = window.speechSynthesis.getVoices();
    assistant = voices.filter(v => v.name === 'Google US English')[0];
    hal = voices.filter(v => v.name === 'Daniel')[0];
  };

  recognition.onstart = function () {
    console.info('recognition started');

    startButton.style.opacity = '0.3';
    startButton.innerHTML = 'Listening...';
    isListening = true;
  };

  recognition.onerror = function (event) {
    console.error(event);
    if (event.error === 'no-speech') {
      // what's this error?
    }
    if (event.error === 'audio-capture') {
      // no microphone
    }
    if (event.error === 'not-allowed') {
      // permissions error
    }
  };

  recognition.onend = function () {
    console.info('recognition ended');

    if (finalTranscript.toLowerCase() === 'open the pod bay doors') {
      startButton.style['background-image'] = 'radial-gradient(circle, white 0%, yellow 2%, red 15%, red 15%, black 52%, #363636 63%)';
      startButton.innerHTML = '';
      utterance.voice = hal;
      utterance.text = "I'm Sorry, Dave, I'm afraid I can't do that.";
    } else {
      utterance.text = `I'll try to help with ${finalTranscript}`;
      utterance.voice = assistant;
      startButton.innerHTML = 'Start Listening';
    }

    window.speechSynthesis.speak(utterance);

    finalTranscript = '';
    startButton.style.opacity = '1';
    isListening = false;
  };

  recognition.onresult = function (event) {
    console.log('recognition result', event);
    let interimTranscript = '';
    if (typeof event.results === 'undefined') {
      console.error('unsupported?');
      recognition.onend = null;
      recognition.stop();
      return;
    }

    // cannot use foreach because event.results is not enumerable
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }
    console.log('final transcript', finalTranscript);
    console.log('interim transcript', interimTranscript);

    if (interimTranscript) {
      setResult(interimTranscript);
    } else if (finalTranscript) {
      setResult(finalTranscript);
      stopListening();
    }
  };

  function startListening () {
    if (isListening) {
      stopListening();
      return;
    }
    recognition.start();
  }

  function stopListening () {
    recognition.stop();
  }

  function setResult (result) {
    resultDiv.innerHTML = `"${result}"`;
  }
})();
