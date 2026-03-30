// api/tasks.js - Add to your existing Vercel project
let tasks = [
  { _id: '1', title: 'Sample Task', status: 'todo', createdAt: new Date().toISOString() }
];

export default function handler(req, res) {
  if (req.method === 'GET') return res.status(200).json(tasks);
  if (req.method === 'POST') {
    const newTask = { _id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
    tasks.push(newTask);
    return res.status(201).json(newTask);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}