import React, { useState } from 'react';
import './App.css';
import { TaskProvider } from './context/TaskContext';
import ApiKeySection from './components/ApiKeySection';
import VoiceInput from './components/VoiceInput';
import TimelineSection from './components/TimelineSection';
import FeasibilityAnalysis from './components/FeasibilityAnalysis';
import TaskList from './components/TaskList';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [apiKey, setApiKey] = useLocalStorage('openai_api_key', '');
  const [apiKeySet, setApiKeySet] = useState(!!apiKey);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    setApiKeySet(true);
  };

  return (
    <TaskProvider>
      <div className="app">
        <header>
          <h1>Student Task Advisor</h1>
          <p className="tagline">Tell me what you need to do. I'll tell you if it's actually possible.</p>
        </header>
        
        {!apiKeySet ? (
          <ApiKeySection 
            apiKey={apiKey} 
            onSaveApiKey={handleSaveApiKey} 
          />
        ) : (
          <>
            <VoiceInput 
              apiKey={apiKey}
              isProcessing={isProcessing} 
              setIsProcessing={setIsProcessing}
              error={error}
              setError={setError}
            />
            
            <TimelineSection 
              apiKey={apiKey}
              isProcessing={isProcessing} 
              setIsProcessing={setIsProcessing}
            />
            
            <FeasibilityAnalysis />
            
            <TaskList />
          </>
        )}
      </div>
    </TaskProvider>
  );
}

export default App;
