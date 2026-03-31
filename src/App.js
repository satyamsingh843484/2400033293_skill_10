import React from 'react';
import StudentManager from './components/StudentManager';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React State Management</h1>
        <p>useState Hook — Student Manager</p>
      </header>
      <main className="app-main">
        <StudentManager />
      </main>
      <footer className="app-footer">
        <p>Experiment 10 — React useState Object</p>
      </footer>
    </div>
  );
}

export default App;
