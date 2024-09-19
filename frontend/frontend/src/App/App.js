import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../Header/Header';
import Banner from '../Banner/Banner';
import Task from '../Task/Task';
import Footer from '../Footer/Footer';
import Contact from '../Footer/Contact';
import Privacy from '../Footer/Privacy';
import Terms from '../Footer/Terms';
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
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
