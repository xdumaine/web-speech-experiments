(function() {
  document.getElementById('start-listening').onclick = startListening;

  const recognition = new webkitSpeechRecognition();
  let finalTranscript = ''
  recognition.continuous = true;
  recognition.interimResults = true;

  const utterance = new SpeechSynthesisUtterance();

  window.speechSynthesis.onvoiceschanged = function () {
    const voice = window.speechSynthesis.getVoices().filter(v => v.name === 'Google US English')[0];
    utterance.voice = voice;
  }

  recognition.onstart = function () {
    // update state
    console.info('recognition started')
  };

  recognition.onerror = function (event) {
    console.error(event);
    if (event.error == 'no-speech') {
      // what's this error?
    }
    if (event.error == 'audio-capture') {
      // no microphone
    }
    if (event.error == 'not-allowed') {
      // permissions error
    }
  };

  recognition.onend = function () {
    console.info('recognition ended');
  };

  recognition.onresult = function (event) {
    console.log('recognition result', event);
    let interimTranscript = '';
    if (typeof(event.results) == 'undefined') {
      console.error('unsupported?');
      recognition.onend = null;
      recognition.stop();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    console.log('final transcript', finalTranscript);
    console.log('interim transcript', interimTranscript);

    if (finalTranscript) {
      utterance.text = 'Hey, I\'ll try to help with ' + finalTranscript;
      speechSynthesis.speak(utterance);
      recognition.stop();
      finalTranscript = '';
    }
  };

  function startListening () {
    recognition.start();
  }
})();
