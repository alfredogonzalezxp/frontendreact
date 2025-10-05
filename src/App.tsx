import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Clients from './Clients';
import ClientDetail from './ClientDetail';
import Plans from './Plans';
import Subscriptions from './Subscriptions';
import './App.css'

const App: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex items-end justify-end">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="pb-6 border-b border-gray-700 mb-8">
          <h1 className="text-4xl font-bold text-indigo-400">Gestión de Suscripciones</h1>
          <nav className="mt-4">
            <ul className="flex space-x-4">
              <li><NavLink to="/clients" className={({ isActive }) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800'}`}>Clientes</NavLink></li>
              <li><NavLink to="/plans" className={({ isActive }) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800'}`}>Planes</NavLink></li>
              <li><NavLink to="/subscriptions" className={({ isActive }) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800'}`}>Suscripciones</NavLink></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/" element={<Clients />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App
