import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { processTranscriptWithAI } from '../services/openai';

const VoiceInput = ({ apiKey, isProcessing, setIsProcessing, error, setError }) => {
  const [transcript, setTranscript] = useState('');
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const { addTasks } = useTaskContext();
  
  // Load transcript history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('transcript_history');
    if (savedHistory) {
      try {
        setTranscriptHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing transcript history:', e);
        localStorage.removeItem('transcript_history');
      }
    }
  }, []);
  
  // Save transcript history to localStorage whenever it changes
  useEffect(() => {
    if (transcriptHistory.length > 0) {
      localStorage.setItem('transcript_history', JSON.stringify(transcriptHistory));
    }
  }, [transcriptHistory]);
  
  const { 
    isListening, 
    toggleListening, 
    resetTranscript 
  } = useSpeechRecognition({
    onResult: (transcriptText) => {
      console.log("Speech recognition result:", transcriptText); // Debug log
      setTranscript(transcriptText);
    },
    onError: (errorMessage) => {
      console.error("Speech recognition error:", errorMessage); // Debug log
      setError(`Speech recognition error: ${errorMessage}`);
    }
  });
  
  const handleStartListening = () => {
    if (!isListening) {
      // Don't reset transcript when starting to listen again
      toggleListening();
    } else {
      toggleListening();
    }
  };
  
  const handleStopAndReset = () => {
    if (isListening) {
      toggleListening();
    }
    resetTranscript();
  };
  
  const handleProcessTranscript = async () => {
    if (!transcript.trim() || !apiKey) return;
    
    setIsProcessing(true);
    
    // Add transcript to history with timestamp
    const newTranscriptEntry = {
      id: Date.now(),
      text: transcript.trim(),
      timestamp: new Date().toISOString(),
      processed: false
    };
    
    // Add to history (limit to most recent 20)
    const updatedHistory = [newTranscriptEntry, ...transcriptHistory].slice(0, 20);
    setTranscriptHistory(updatedHistory);
    
    try {
      const newTasks = await processTranscriptWithAI(transcript, apiKey);
      
      // Mark transcript as processed
      const historyWithProcessed = updatedHistory.map(entry => 
        entry.id === newTranscriptEntry.id ? { ...entry, processed: true } : entry
      );
      setTranscriptHistory(historyWithProcessed);
      
      addTasks(newTasks);
      
      // Only reset transcript after successful processing
      resetTranscript();
    } catch (error) {
      console.error('Error processing transcript:', error);
      setError('Failed to process your tasks. Please check your API key and try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const loadHistoricalTranscript = (text) => {
    setTranscript(text);
  };
  
  const deleteTranscriptEntry = (id) => {
    setTranscriptHistory(transcriptHistory.filter(entry => entry.id !== id));
  };
  
  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };
  
  const toggleHistoryView = () => {
    setShowHistory(!showHistory);
  };
  
  return (
    <div className="voice-section">
      <div className="voice-controls">
        <button 
          className={`record-button ${isListening ? 'active' : ''}`}
          onClick={handleStartListening}
          disabled={isProcessing}
        >
          {isListening ? 'Stop Listening' : 'Start Talking'}
        </button>
        
        <button 
          className="reset-button"
          onClick={handleStopAndReset}
          disabled={isProcessing || (!isListening && !transcript)}
        >
          Clear Transcript
        </button>
      </div>
      
      {isListening && (
        <div className="listening-indicator">
          <div className="pulse"></div>
          <p>Listening... <span className="transcript-length">{transcript.length} characters</span></p>
        </div>
      )}
      
      <div className="transcript-section">
        <div className="transcript-header">
          <h3>Your Transcript</h3>
          <button 
            className="history-toggle"
            onClick={toggleHistoryView}
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>
        
        <div className="current-transcript">
          <textarea
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="Your spoken words will appear here. You can also type or edit directly."
            rows={5}
            className="transcript-textarea"
          />
          
          <div className="transcript-actions">
            <div className="transcript-status">
              {transcript && <span>{transcript.length} characters</span>}
            </div>
            
            <button 
              className="process-button"
              onClick={handleProcessTranscript}
              disabled={isProcessing || !transcript.trim()}
            >
              {isProcessing ? 'Processing...' : 'Process Tasks'}
            </button>
          </div>
        </div>
        
        {showHistory && transcriptHistory.length > 0 && (
          <div className="transcript-history">
            <h4>Recent Transcripts</h4>
            <ul className="history-list">
              {transcriptHistory.map(entry => (
                <li key={entry.id} className={`history-item ${entry.processed ? 'processed' : ''}`}>
                  <div className="history-text" onClick={() => loadHistoricalTranscript(entry.text)}>
                    <p>{entry.text}</p>
                    <span className="history-timestamp">{formatTimestamp(entry.timestamp)}</span>
                    {entry.processed && <span className="processed-badge">Processed</span>}
                  </div>
                  <button 
                    className="delete-history"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTranscriptEntry(entry.id);
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            {transcriptHistory.length > 5 && (
              <button 
                className="clear-history-button"
                onClick={() => setTranscriptHistory([])}
              >
                Clear History
              </button>
            )}
          </div>
        )}
      </div>
      
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default VoiceInput;