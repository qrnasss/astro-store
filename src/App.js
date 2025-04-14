import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Hero from './components/Hero';

function App() {
  return (
    <div className="App" style={{ overflow: 'hidden' }}>
      <Navbar />
      <Hero />
      <div className="container-fluid" style={{ maxWidth: '1400px', padding: '4rem 1rem' }}>
        <ProductList />
      </div>
    </div>
  );
}

export default App;
