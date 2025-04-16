import React from 'react';
import heroImage from '../assets/Hero1.png';

function Hero() {
  return (
    <div style={{
      width: '100%',
      height: '800px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: 'white',
        zIndex: 2
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>مجموعة الصيف الجديدة</h1>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2rem'
        }}>اكتشفي أحدث صيحات الموضة لموسم الصيف</p>
        <button style={{
          padding: '12px 24px',
          fontSize: '1.1rem',
          backgroundColor: '#800020',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          تسوقي الآن
        </button>
      </div>
      <img 
        src={heroImage}
        alt="Hero"
        style={{
          width: '110%',
          height: '110%',
          objectFit: 'cover',
          filter: 'brightness(0.7)',
          position: 'absolute',
          top: '65%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.1)'
        }}
      />
    </div>
  );
}

export default Hero; 