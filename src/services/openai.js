export const processTranscriptWithAI = async (transcript, apiKey) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a task management assistant for students. Your job is to extract tasks from the student's spoken text, categorize them, assign priorities, estimate time required, and assess difficulty.
  
  For each task identified:
  1. Extract the task description
  2. Categorize it (academics, extracurricular, personal, health, social, etc.)
  3. Assign a priority (1-10, where 10 is highest)
  4. Identify any deadlines or due dates mentioned
  5. Estimate how many hours it would likely take to complete
  6. Rate the difficulty level (1-5, where 5 is most difficult)
  7. Assess mental energy required (1-5, where 5 is highest)
  8. Provide a brief reason for the priority assignment
  
  Return the results as a JSON array of objects with properties:
  - task: the task description
  - category: the category name
  - priority: number 1-10
  - dueDate: the due date (if any, otherwise null)
  - hoursNeeded: estimated hours to complete
  - difficulty: number 1-5
  - mentalEnergy: number 1-5
  - priorityReason: brief explanation of priority
  - completed: false
  
  Format your response as valid JSON only, with no other text.`
            },
            {
              role: 'user',
              content: transcript
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.choices && data.choices[0].message.content) {
        const content = data.choices[0].message.content;
        // Extract JSON from the response (in case it contains additional text)
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse the AI response');
        }
      } else {
        throw new Error('Invalid response from OpenAI API');
      }
    } catch (error) {
      console.error('Error in processTranscriptWithAI:', error);
      throw error;
    }
  };
  
  export const analyzeFeasibilityWithAI = async (tasks, timeline, totalHours, apiKey) => {
    try {
      // Calculate basic stats
      const highPriorityTasks = tasks.filter(task => !task.completed && task.priority >= 8).length;
      
      // Format tasks for the prompt
      const taskSummaries = tasks
        .filter(task => !task.completed)
        .map(task => `- ${task.task} (Priority: ${task.priority}/10, Hours: ${task.hoursNeeded}, Difficulty: ${task.difficulty}/5, Due: ${task.dueDate || 'Not specified'})`)
        .join('\n');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a brutally honest academic advisor for students who specializes in realistic time management and task prioritization. You help students understand if their goals are achievable within their timeline and provide specific recommendations based on different priority frameworks.
  
  When analyzing the feasibility of completing tasks within a given timeline, provide:
  
  1. A direct, honest assessment of whether it's actually possible to complete everything within the timeframe
  2. A brief explanation of why it is or isn't feasible
  3. Three separate recommendation plans:
     - SUCCESS PRIORITY PLAN: If the student prioritizes academic success over health/wellbeing
     - HEALTH PRIORITY PLAN: If the student prioritizes health/wellbeing over academic success
     - BALANCED APPROACH: A middle ground that attempts to balance health and success
  
  For each plan, include:
  - Which specific tasks to prioritize (by name)
  - Which tasks to defer or drop if necessary
  - A realistic schedule suggestion
  - Honest pros and cons of each approach
  
  Be direct and blunt in your assessment - if the timeline is unrealistic, say so clearly. Don't sugarcoat if the student is trying to do too much. Provide actionable, specific advice rather than generic platitudes.
  
  Format your response as a JSON object with these properties:
  - feasible: boolean indicating if the timeline is realistic
  - assessment: brief explanation of the feasibility assessment
  - totalHours: the total hours required
  - successPlan: object with the success-prioritized recommendation
  - healthPlan: object with the health-prioritized recommendation
  - balancedPlan: object with the balanced approach
  - generalAdvice: any additional tips specific to this situation
  
  For each plan object, include:
  - tasks: array of task names to prioritize
  - schedule: suggested approach to scheduling
  - pros: array of benefits to this approach
  - cons: array of drawbacks to this approach`
            },
            {
              role: 'user',
              content: `I'm a student with the following tasks to complete:
  
  ${taskSummaries}
  
  My timeline: ${timeline}
  
  Total estimated hours required: ${totalHours}
  Number of high priority tasks (8-10): ${highPriorityTasks}
  
  Based on this information, provide your brutally honest assessment and recommendations. Don't hold back - I need to know if this is realistic or if I'm setting myself up for failure.`
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.choices && data.choices[0].message.content) {
        const content = data.choices[0].message.content;
        // Extract JSON from the response
        const jsonMatch = content.match(/{[\s\S]*}/);
        
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse the feasibility analysis');
        }
      } else {
        throw new Error('Invalid response from OpenAI API');
      }
    } catch (error) {
      console.error('Error in analyzeFeasibilityWithAI:', error);
      throw error;
    }
  };
  