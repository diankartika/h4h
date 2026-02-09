// components/GuideModal/Page3.jsx
import React from 'react';

const Page3 = () => {
  return (
    <div>
      {/* Title */}
      <h2 
        className="mb-5"
        style={{
          width: '250px',
          height: '12px',
          color: '#000',
          fontFamily: 'Inter',
          fontSize: '13px',
          fontWeight: 700,
          lineHeight: 'normal'
        }}
      >
        🟢🟡🔴 Uncertainty Markers
      </h2>

      {/* Example section */}
      <div 
        className="mb-3"
        style={{
          width: '237px',
          color: '#000',
          fontFamily: 'Inter',
          fontSize: '9px',
          fontWeight: 400,
          lineHeight: '12px'
        }}
      >
        <p className="mb-2">Example:</p>
        <p className="mb-2">
          "Dian Kartika Putri is an Indonesian singer{' '}
          <span style={{ color: '#F44336' }}>[speculative, p=0.53]</span>" ← RED (low confidence)
        </p>
        
        <p className="text-center my-2">vs.</p>
        
        <p>
          "Jakarta is the capital of Indonesia{' '}
          <span style={{ color: '#43A047' }}>[verified, p=0.95]</span>" ← GREEN (high confidence)
        </p>
      </div>

        {/* Colors = Confidence level box */}
        <div 
        className="mb-3 flex items-center justify-center mx-auto"  // Added mx-auto
        style={{
            width: '147px',
            height: '20px',
            borderRadius: '12px',
            border: '1px solid #96C8F4',
            background: '#B9DEFF'
        }}
        >
        <span
            style={{
            color: '#000',
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: '9px',
            fontWeight: 600,
            lineHeight: 'normal'
            }}
        >
            Colors = Confidence level!
        </span>
        </div>

      {/* Color System title */}
      <h3 
        className="mb-2"
        style={{
          width: '74px',
          height: '12px',
          color: '#000',
          fontFamily: 'Inter',
          fontSize: '11px',
          fontWeight: 700,
          lineHeight: 'normal'
        }}
      >
        Color System
      </h3>

      {/* GREEN section */}
      <div className="mb-3">
        <p 
          className="mb-1"
          style={{
            width: '173px',
            color: '#000',
            textAlign: 'justify',
            fontFamily: 'Inter',
            fontSize: '9px',
            fontWeight: 700,
            lineHeight: 'normal'
          }}
        >
          🟢 <span style={{ fontWeight: 700 }}>GREEN</span> = <span style={{ fontWeight: 400 }}>High Confidence (0.8 - 1.0)</span>
        </p>
        
        <div
          style={{
            width: '173px',
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '9px',
            lineHeight: '12px'
          }}
        >
          <p className="mb-1" style={{ fontWeight: 600 }}>
            Markers: <span style={{ fontWeight: 400 }}>[verified], [factual], [likely]</span>
          </p>
          <p style={{ fontWeight: 400 }}>✓ Strong evidence supporting this</p>
          <p style={{ fontWeight: 400 }}>✓ You can trust this information</p>
          <p style={{ fontWeight: 400 }}>✓ Safe to rely on</p>
        </div>
      </div>
    </div>
  );
};

export default Page3;