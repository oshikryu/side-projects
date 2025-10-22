import React, { useState } from 'react';
import DataTable from './DataTable';
import KanbanBoard from './KanbanBoard';

type QuestionType = 'table' | 'kanban';

function App() {
  const [activeQuestion, setActiveQuestion] = useState<QuestionType>('table');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Senior Engineer Interview Questions
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveQuestion('table')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeQuestion === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Question #1: Data Table
              </button>
              <button
                onClick={() => setActiveQuestion('kanban')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeQuestion === 'kanban'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Question #2: Kanban Board
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div>
        {activeQuestion === 'table' ? <DataTable /> : <KanbanBoard />}
      </div>
    </div>
  );
}

export default App;
