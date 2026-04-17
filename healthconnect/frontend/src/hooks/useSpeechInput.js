import { useState, useRef, useCallback } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function useSpeechInput(onResult) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const supported = !!SpeechRecognition;

  const start = useCallback(() => {
    if (!supported) {
      setError('Speech recognition is not supported in this browser. Use Chrome.');
      return;
    }
    setError('');

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (e) => {
      if (e.error === 'not-allowed') {
        setError('Microphone access denied. Please allow mic permission.');
      } else if (e.error === 'no-speech') {
        setError('No speech detected. Try again.');
      } else {
        setError('Voice input error. Please try again.');
      }
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  }, [supported, onResult]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const toggle = useCallback(() => {
    listening ? stop() : start();
  }, [listening, start, stop]);

  return { listening, error, supported, toggle, stop };
}
