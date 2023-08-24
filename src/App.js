import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Pocetna from './Komponente/Pocetna';
import Navbar from './Komponente/Navbar';
import Footer from './Komponente/Footer';
import Tetris from './Komponente/Tetris';
import OceniteIgru from './Komponente/OceniteIgru';

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/tetris" element={<Tetris />} />
          <Route path="/ocenite-igru" element={<OceniteIgru />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
