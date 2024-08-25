import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../Header/Header';
import Banner from '../Banner/Banner';
import Task from '../Task/Task';
import { AuthProvider } from '../Context/authContext';
import { ModalProvider } from '../Context/modalContext';
import PrivateRoute from '../Routes/PrivateRoute';
import './App.scss';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Banner />} />
                <Route path="/tasks" element={<PrivateRoute><Task /></PrivateRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
