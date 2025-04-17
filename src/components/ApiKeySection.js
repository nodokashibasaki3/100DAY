import React, { useState } from 'react';

const ApiKeySection = ({ apiKey: initialApiKey, onSaveApiKey }) => {
  const [apiKey, setApiKey] = useState(initialApiKey);
  
  const handleSaveClick = () => {
    onSaveApiKey(apiKey);
  };
  
  return (
    <div className="api-key-section">
      <h2>First, set your OpenAI API Key</h2>
      <p>Your API key is stored locally in your browser and never sent to our servers.</p>
      <div className="input-group">
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="Enter your OpenAI API key"
        />
        <button onClick={handleSaveClick}>Save Key</button>
      </div>
    </div>
  );
};

export default ApiKeySection;