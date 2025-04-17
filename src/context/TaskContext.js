import React, { createContext, useState, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage('voice_tasks', []);
  const [categories, setCategories] = useLocalStorage('task_categories', []);
  const [timeline, setTimeline] = useState('');
  const [feasibilityAnalysis, setFeasibilityAnalysis] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'success', 'health', 'balanced'
  
  // Calculate total required hours
  const totalRequiredHours = tasks
    .filter(task => !task.completed)
    .reduce((sum, task) => sum + (task.hoursNeeded || 0), 0);
  
  // Filter tasks based on view mode and completion status
  const getFilteredTasks = () => {
    let filteredTasks = [...tasks];
    
    if (feasibilityAnalysis) {
      if (viewMode === 'success') {
        const priorityTasks = feasibilityAnalysis.successPlan.tasks;
        filteredTasks = tasks.filter(task => 
          priorityTasks.includes(task.task) || task.completed
        );
      } else if (viewMode === 'health') {
        const priorityTasks = feasibilityAnalysis.healthPlan.tasks;
        filteredTasks = tasks.filter(task => 
          priorityTasks.includes(task.task) || task.completed
        );
      } else if (viewMode === 'balanced') {
        const priorityTasks = feasibilityAnalysis.balancedPlan.tasks;
        filteredTasks = tasks.filter(task => 
          priorityTasks.includes(task.task) || task.completed
        );
      }
    }
    
    // Sort tasks by priority (highest first) and completion status
    filteredTasks.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      if (a.completed && b.completed) return 0;
      return b.priority - a.priority;
    });
    
    return filteredTasks;
  };
  
  // Group tasks by category
  const getTasksByCategory = () => {
    const filteredTasks = getFilteredTasks();
    const tasksByCategory = {};
    
    filteredTasks.forEach(task => {
      if (!tasksByCategory[task.category]) {
        tasksByCategory[task.category] = [];
      }
      tasksByCategory[task.category].push(task);
    });
    
    return tasksByCategory;
  };
  
  const addTasks = (newTasks) => {
    // Add IDs to new tasks
    const tasksWithIds = newTasks.map(task => ({
      ...task,
      id: Date.now() + Math.random().toString(36).substr(2, 9)
    }));
    
    setTasks([...tasks, ...tasksWithIds]);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(newTasks.map(task => task.category))];
    const existingCategoryNames = categories.map(cat => cat.name);
    
    // Add new categories with colors
    const newCategories = uniqueCategories
      .filter(cat => !existingCategoryNames.includes(cat))
      .map(cat => ({
        name: cat,
        color: getRandomColor()
      }));
    
    if (newCategories.length > 0) {
      setCategories([...categories, ...newCategories]);
    }
    
    // Reset feasibility analysis when new tasks are added
    setFeasibilityAnalysis(null);
  };
  
  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    
    // Reset feasibility analysis when tasks are completed
    setFeasibilityAnalysis(null);
  };
  
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    
    // Reset feasibility analysis when tasks are deleted
    setFeasibilityAnalysis(null);
  };
  
  const getRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', 
      '#FB5607', '#8338EC', '#3A86FF', '#FF006E'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#888';
  };
  
  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        timeline,
        setTimeline,
        feasibilityAnalysis,
        setFeasibilityAnalysis,
        viewMode,
        setViewMode,
        totalRequiredHours,
        addTasks,
        toggleTaskCompletion,
        deleteTask,
        getCategoryColor,
        getFilteredTasks,
        getTasksByCategory
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};