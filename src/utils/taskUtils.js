export const calculateTotalHours = (tasks) => {
    return tasks
      .filter(task => !task.completed)
      .reduce((sum, task) => sum + (task.hoursNeeded || 0), 0);
  };
  
  export const sortTasksByPriority = (tasks) => {
    return [...tasks].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      if (a.completed && b.completed) return 0;
      return b.priority - a.priority;
    });
  };
  
  export const groupTasksByCategory = (tasks) => {
    const tasksByCategory = {};
    
    tasks.forEach(task => {
      if (!tasksByCategory[task.category]) {
        tasksByCategory[task.category] = [];
      }
      tasksByCategory[task.category].push(task);
    });
    
    return tasksByCategory;
  };