// components/GuideModal/Page5.jsx
import React from 'react';

const Page5 = () => {
  return (
    <div>
      {/* Title */}
      <h2 
        className="mb-3"
        style={{
          width: '152px',
          height: '12px',
          color: '#000',
          fontFamily: 'Inter',
          fontSize: '11px',
          fontWeight: 700,
          lineHeight: 'normal'
        }}
      >
        Understanding the P-Score
      </h2>

      {/* Subtitle */}
      <h3 
        className="mb-2"
        style={{
          width: '114px',
          height: '9px',
          color: '#000',
          textAlign: 'justify',
          fontFamily: 'Inter',
          fontSize: '9px',
          fontWeight: 600,
          lineHeight: 'normal'
        }}
      >
        What does p=0.85 mean?
      </h3>

      {/* P-score explanation */}
      <div 
        className="mb-3"
        style={{
          width: '253px',
          color: '#000',
          fontFamily: 'Inter',
          fontSize: '9px',
          fontWeight: 400,
          lineHeight: '12px'
        }}
      >
        <p className="mb-2">The p-score (probability) shows the AI's confidence level:</p>
        <p>- p=0.95 → 95% confident (very reliable)</p>
        <p>- p=0.68 → 68% confident (moderately reliable)</p>
        <p>- p=0.45 → 45% confident (unreliable)</p>
      </div>

      {/* Higher number box - centered */}
      <div 
        className="mb-3 flex items-center justify-center mx-auto"
        style={{
          width: '158px',
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
          Higher number = More reliable
        </span>
      </div>

      {/* Reading the Footnotes title */}
      <h3 
        className="mb-2"
        style={{
          width: '126px',
          height: '12px',
          color: '#000',
          fontFamily: 'Inter',
          fontSize: '11px',
          fontWeight: 700,
          lineHeight: 'normal'
        }}
      >
        Reading the Footnotes
      </h3>

      {/* Footnotes explanation */}
      <div 
        style={{
          width: '253px',
          color: '#000',
          fontFamily: 'Inter',
          fontSize: '9px',
          fontWeight: 400,
          lineHeight: '12px'
        }}
      >
        <p className="mb-2">
          Each marker has a number: [marker, p score]<sup style={{ fontSize: '6px' }}>1</sup>
        </p>
        <p className="mb-1">The footnote tells you:</p>
        <p>
          - Prediction type <span style={{ fontSize: '8.5px' }}>(SUPPORTS/REFUTES/NOT ENOUGH INFO)</span>
        </p>
        <p>- Confidence score (exact percentage)</p>
        <p>- Uncertainty type (evidential or epistemic)</p>
        <p>- Explanation (why this confidence level)</p>
      </div>
    </div>
  );
};

export default Page5;