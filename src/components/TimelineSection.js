import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { analyzeFeasibilityWithAI } from '../services/openai';

const TimelineSection = ({ apiKey, isProcessing, setIsProcessing }) => {
  const { 
    tasks, 
    timeline, 
    setTimeline, 
    setFeasibilityAnalysis,
    totalRequiredHours
  } = useTaskContext();
  
  const handleAnalyzeFeasibility = async () => {
    if (tasks.length === 0 || !timeline || !apiKey) return;
    
    setIsProcessing(true);
    
    try {
      const analysis = await analyzeFeasibilityWithAI(
        tasks.filter(task => !task.completed),
        timeline,
        totalRequiredHours,
        apiKey
      );
      
      setFeasibilityAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing feasibility:', error);
      // You'd typically set an error state here
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (tasks.length === 0) {
    return null;
  }
  
  return (
    <div className="timeline-section">
      <h2>When do you need to finish everything?</h2>
      <div className="timeline-input">
        <input
          type="text"
          value={timeline}
          onChange={e => setTimeline(e.target.value)}
          placeholder="e.g., 'by tomorrow night' or 'before Friday at 5pm'"
        />
        <button 
          onClick={handleAnalyzeFeasibility}
          disabled={isProcessing || !timeline}
        >
          {isProcessing ? 'Analyzing...' : 'Analyze Feasibility'}
        </button>
      </div>
      
      <p className="timeline-help">
        Tell me your deadline, and I'll give you an honest assessment of whether you can finish everything in time.
      </p>
      
      {tasks.length > 0 && (
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Total Tasks:</span>
            <span className="stat-value">{tasks.filter(t => !t.completed).length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Estimated Hours:</span>
            <span className="stat-value">{totalRequiredHours}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Completed:</span>
            <span className="stat-value">{tasks.filter(t => t.completed).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineSection;
