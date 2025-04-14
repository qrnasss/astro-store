import React from 'react';
import heroImage from '../assets/Hero1.png';

function Hero() {
  const heroStyle = {
    backgroundImage: `url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '700px',
    position: 'relative',
    margin: 0,
    padding: 0,
    display: 'block',
    lineHeight: 0
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0
  };

  return (
    <div style={heroStyle} className="d-block p-0 m-0">
      <div style={overlayStyle}>
        <button 
          className="btn btn-danger btn-lg px-5 py-3" 
          style={{ 
            backgroundColor: '#8B0000', 
            borderColor: '#8B0000',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}
        >
          تسوق الآن
        </button>
      </div>
    </div>
  );
}

export default Hero; 