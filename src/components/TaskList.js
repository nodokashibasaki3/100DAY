import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';

const TaskList = () => {
  const { tasks, getTasksByCategory, getCategoryColor } = useTaskContext();
  
  const tasksByCategory = getTasksByCategory();
  
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>Start talking about your tasks and deadlines. I'll help you figure out what's possible.</p>
        <p className="example">Try saying: "I have a 10-page research paper due Friday that I haven't started, a math test tomorrow I need to study for, and I promised to help my friend move on Thursday."</p>
      </div>
    );
  }
  
  return (
    <div className="tasks-container">
      {Object.keys(tasksByCategory).map(category => (
        <div className="category-section" key={category}>
          <h2 
            className="category-title"
            style={{ borderColor: getCategoryColor(category) }}
          >
            {category}
          </h2>
          <ul className="task-list">
            {tasksByCategory[category].map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TaskList;