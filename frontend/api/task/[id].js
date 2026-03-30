// api/activities/task/[id].js
export default function handler(req, res) {
  const { id } = req.query;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    // Return sample activities
    const activities = [
      {
        _id: 'act1',
        taskId: id,
        action: 'Task viewed',
        details: 'User loaded the task',
        timestamp: new Date().toISOString()
      },
      {
        _id: 'act2',
        taskId: id,
        action: 'Sample activity',
        details: 'This is a demo activity log',
        timestamp: new Date().toISOString()
      }
    ];
    
    return res.status(200).json(activities);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}