import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { processTranscriptWithAI } from '../services/openai';

const VoiceInput = ({ apiKey, isProcessing, setIsProcessing, error, setError }) => {
  const [transcript, setTranscript] = useState('');
  const { addTasks } = useTaskContext();
  
  const { isListening, toggleListening, recognition } = useSpeechRecognition({
    onResult: (transcript) => setTranscript(transcript),
    onError: (error) => setError(`Speech recognition error: ${error}`)
  });
  
  const handleProcessTranscript = async () => {
    if (!transcript.trim() || !apiKey) return;
    
    setIsProcessing(true);
    
    try {
      const newTasks = await processTranscriptWithAI(transcript, apiKey);
      addTasks(newTasks);
      setTranscript('');
    } catch (error) {
      console.error('Error processing transcript:', error);
      setError('Failed to process your tasks. Please check your API key and try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="voice-section">
      <button 
        className={`record-button ${isListening ? 'active' : ''}`}
        onClick={toggleListening}
        disabled={isProcessing}
      >
        {isListening ? 'Stop Listening' : 'Start Talking'}
      </button>
      
      {isListening && (
        <div className="listening-indicator">
          <div className="pulse"></div>
          <p>Listening...</p>
        </div>
      )}
      
      {transcript && (
        <div className="transcript-section">
          <p className="transcript">{transcript}</p>
          <button 
            className="process-button"
            onClick={handleProcessTranscript}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process Tasks'}
          </button>
        </div>
      )}
      
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default VoiceInput;