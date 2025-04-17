import React from 'react';
import { useTaskContext } from '../context/TaskContext';

const TaskItem = ({ task }) => {
  const { toggleTaskCompletion, deleteTask } = useTaskContext();
  
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <label className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed || false}
            onChange={() => toggleTaskCompletion(task.id)}
          />
          <span className="checkmark"></span>
        </label>
        <div className="task-text">{task.task}</div>
        <button 
          className="delete-button"
          onClick={() => deleteTask(task.id)}
        >
          ×
        </button>
      </div>
      
      <div className="task-details">
        <div 
          className="priority-badge"
          style={{ 
            backgroundColor: `rgba(${255 * task.priority / 10}, ${255 * (1 - task.priority / 10)}, 0, 0.2)`,
            borderColor: `rgba(${255 * task.priority / 10}, ${255 * (1 - task.priority / 10)}, 0, 0.5)`
          }}
        >
          Priority: {task.priority}/10
        </div>
        
        {task.hoursNeeded && (
          <div className="hours-badge">
            ~{task.hoursNeeded} {task.hoursNeeded === 1 ? 'hour' : 'hours'}
          </div>
        )}
        
        {task.difficulty && (
          <div className="difficulty-badge">
            Difficulty: {task.difficulty}/5
          </div>
        )}
        
        {task.dueDate && (
          <div className="due-date">
            Due: {task.dueDate}
          </div>
        )}
        
        <div className="priority-reason">
          {task.priorityReason}
        </div>
      </div>
    </li>
  );
};

export default TaskItem;