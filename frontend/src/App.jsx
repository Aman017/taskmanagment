import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './index.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600">
      {/* Header */}
      <header className="bg-white bg-opacity-95 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Task Management System
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Manage tasks with status workflow and AI-powered description improvement
            </p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main>
        <TaskForm onTaskCreated={handleTaskCreated} />
        <TaskList refreshTrigger={refreshTrigger} />
      </main>
      
      {/* Footer */}
      <footer className="bg-white bg-opacity-95 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-sm">
            Powered by React + Vite + Tailwind CSS | AI Enhancement by Groq
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Status workflow: TODO → IN_PROGRESS → DONE
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;