import { useState, useEffect, useRef } from 'react';

const useSpeechRecognition = ({ onResult, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = transcriptRef.current;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update the reference to maintain state between callback executions
        transcriptRef.current = finalTranscript;
        
        // Call the onResult callback with the combined transcript
        onResult(finalTranscript || interimTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        onError(event.error);
        setIsListening(false);
      };
    } else {
      onError('Speech recognition is not supported in your browser.');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onResult, onError]);
  
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Reset transcript when starting a new recording session
      // Comment the next line if you want to continue from previous recording
      // transcriptRef.current = '';
      
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  const resetTranscript = () => {
    transcriptRef.current = '';
    onResult('');
  };
  
  return {
    isListening,
    toggleListening,
    resetTranscript,
    recognition: recognitionRef.current
  };
};

export default useSpeechRecognition;