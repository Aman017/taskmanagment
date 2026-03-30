// api/tasks.js
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET all tasks
  if (req.method === 'GET') {
    // Return sample tasks
    const tasks = [
      { 
        _id: '1', 
        title: 'Welcome to Task Manager', 
        description: 'Your API is now working! You can now add, edit, and delete tasks.',
        status: 'todo',
        createdAt: new Date().toISOString()
      },
      { 
        _id: '2', 
        title: 'Try creating a new task', 
        description: 'Use the "Create New Task" button above',
        status: 'in-progress',
        createdAt: new Date().toISOString()
      },
      { 
        _id: '3', 
        title: 'Deploy your real backend later', 
        description: 'This is using mock data. You can replace this with your database later.',
        status: 'done',
        createdAt: new Date().toISOString()
      }
    ];
    
    return res.status(200).json(tasks);
  }
  
  // POST create new task
  if (req.method === 'POST') {
    const { title, description, status } = req.body;
    
    const newTask = {
      _id: Date.now().toString(),
      title: title || 'Untitled Task',
      description: description || '',
      status: status || 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return res.status(201).json(newTask);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}