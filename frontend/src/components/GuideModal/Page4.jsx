// components/GuideModal/Page4.jsx
import React from 'react';

const Page4 = () => {
  return (
    <div>
      {/* Title */}
      <h2 
        className="mb-3"
        style={{
          width: '76px',
          height: '12px',
          color: '#000',
          fontFamily: 'Inter',
          fontSize: '11px',
          fontWeight: 700,
          lineHeight: 'normal'
        }}
      >
        Color System
      </h2>

      {/* YELLOW/AMBER section */}
      <div className="mb-3">
        <p 
          className="mb-1"
          style={{
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '9px',
            fontWeight: 400,
            lineHeight: 'normal'
          }}
        >
          🟡 YELLOW/AMBER = Medium Confidence (0.5 - 0.79)
        </p>
        
        <div
          style={{
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '9px',
            lineHeight: '12px'
          }}
        >
          <p className="mb-1" style={{ fontWeight: 600 }}>
            Markers: <span style={{ fontWeight: 400 }}>[plausible], [uncertain], [questionable]</span>
          </p>
          <p style={{ fontWeight: 400 }}>⚠ Some uncertainty exists</p>
          <p style={{ fontWeight: 400 }}>⚠ Cross-check if important</p>
          <p style={{ fontWeight: 400 }}>⚠ Use with caution</p>
        </div>
      </div>

      {/* RED section */}
      <div className="mb-3">
        <p 
          className="mb-1"
          style={{
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '9px',
            fontWeight: 400,
            lineHeight: 'normal'
          }}
        >
          🔴 RED = Low Confidence (0 - 0.49)
        </p>
        
        <div
          style={{
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '9px',
            lineHeight: '12px'
          }}
        >
          <p className="mb-1" style={{ fontWeight: 600 }}>
            Markers: <span style={{ fontWeight: 400 }}>[unsupported], [speculative], [contradicted]</span>
          </p>
          <p style={{ fontWeight: 400 }}>✗ Weak or conflicting evidence</p>
          <p style={{ fontWeight: 400 }}>✗ Be very skeptical</p>
          <p style={{ fontWeight: 400 }}>✗ Do NOT rely on this</p>
        </div>
      </div>

      {/* GRAY section */}
      <div className="mb-3">
        <p 
          className="mb-1"
          style={{
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '9px',
            fontWeight: 400,
            lineHeight: 'normal'
          }}
        >
          ⚪ GRAY = Insufficient Data
        </p>
        
        <div
          style={{
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '9px',
            lineHeight: '12px'
          }}
        >
          <p className="mb-1" style={{ fontWeight: 600 }}>
            Markers: <span style={{ fontWeight: 400 }}>[insufficient-info]</span>
          </p>
          <p style={{ fontWeight: 400 }}>? Not enough information to judge</p>
          <p style={{ fontWeight: 400 }}>? AI cannot verify this claim</p>
          <p style={{ fontWeight: 400 }}>? Find additional sources</p>
        </div>
      </div>
    </div>
  );
};

export default Page4;