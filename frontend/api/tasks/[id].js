// api/tasks/[id].js
export default function handler(req, res) {
  const { id } = req.query;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET single task
  if (req.method === 'GET') {
    const task = {
      _id: id,
      title: `Task ${id}`,
      description: 'This is a sample task',
      status: 'todo',
      createdAt: new Date().toISOString()
    };
    
    return res.status(200).json(task);
  }
  
  // PATCH update task
  if (req.method === 'PATCH') {
    const { status, title, description } = req.body;
    
    const updatedTask = {
      _id: id,
      title: title || `Task ${id}`,
      description: description || 'Updated description',
      status: status || 'todo',
      updatedAt: new Date().toISOString()
    };
    
    return res.status(200).json(updatedTask);
  }
  
  // DELETE task
  if (req.method === 'DELETE') {
    return res.status(200).json({ message: 'Task deleted successfully', id });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}