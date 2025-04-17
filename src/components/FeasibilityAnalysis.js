import React from 'react';
import { useTaskContext } from '../context/TaskContext';

const FeasibilityAnalysis = () => {
  const { feasibilityAnalysis, viewMode, setViewMode } = useTaskContext();
  
  if (!feasibilityAnalysis) {
    return null;
  }
  
  return (
    <div className="feasibility-section">
      <div className={`feasibility-result ${feasibilityAnalysis.feasible ? 'feasible' : 'infeasible'}`}>
        <h2>
          {feasibilityAnalysis.feasible 
            ? 'Yes, you can do this!' 
            : 'Reality Check: This timeline is not realistic'}
        </h2>
        <p>{feasibilityAnalysis.assessment}</p>
      </div>
      
      <div className="plan-nav">
        <button 
          className={viewMode === 'all' ? 'active' : ''}
          onClick={() => setViewMode('all')}
        >
          All Tasks
        </button>
        <button 
          className={viewMode === 'success' ? 'active' : ''}
          onClick={() => setViewMode('success')}
        >
          Success Priority
        </button>
        <button 
          className={viewMode === 'health' ? 'active' : ''}
          onClick={() => setViewMode('health')}
        >
          Health Priority
        </button>
        <button 
          className={viewMode === 'balanced' ? 'active' : ''}
          onClick={() => setViewMode('balanced')}
        >
          Balanced Approach
        </button>
      </div>
      
      {viewMode !== 'all' && (
        <div className="active-plan">
          <div className="plan-details">
            <h3>
              {viewMode === 'success' && 'Success Priority Plan'}
              {viewMode === 'health' && 'Health Priority Plan'}
              {viewMode === 'balanced' && 'Balanced Approach'}
            </h3>
            
            <div className="plan-schedule">
              <h4>Recommended Approach:</h4>
              <p>
                {viewMode === 'success' && feasibilityAnalysis.successPlan.schedule}
                {viewMode === 'health' && feasibilityAnalysis.healthPlan.schedule}
                {viewMode === 'balanced' && feasibilityAnalysis.balancedPlan.schedule}
              </p>
            </div>
            
            <div className="plan-pros-cons">
              <div className="pros">
                <h4>Pros:</h4>
                <ul>
                  {(viewMode === 'success' ? feasibilityAnalysis.successPlan.pros : 
                    viewMode === 'health' ? feasibilityAnalysis.healthPlan.pros : 
                    feasibilityAnalysis.balancedPlan.pros).map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              
              <div className="cons">
                <h4>Cons:</h4>
                <ul>
                  {(viewMode === 'success' ? feasibilityAnalysis.successPlan.cons : 
                    viewMode === 'health' ? feasibilityAnalysis.healthPlan.cons : 
                    feasibilityAnalysis.balancedPlan.cons).map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {viewMode === 'all' && feasibilityAnalysis.generalAdvice && (
        <div className="general-advice">
          <h3>General Advice</h3>
          <p>{feasibilityAnalysis.generalAdvice}</p>
        </div>
      )}
    </div>
  );
};

export default FeasibilityAnalysis;
