// components/GuideModal/Page6.jsx
import React from 'react';

const Page6 = () => {
  return (
    <div>
      {/* Title */}
      <h2 
        className="mb-4"
        style={{
          width: '108px',
          height: '17px',
          color: '#B652D1',
          fontFamily: 'Inter',
          fontSize: '13px',
          fontWeight: 700,
          lineHeight: 'normal'
        }}
      >
        How to Use This
      </h2>

      {/* Do section */}
      <div className="mb-4">
        {/* Do badge */}
        <div 
          className="mb-2 flex items-center justify-center"
          style={{
            width: '40px',
            height: '20px',
            borderRadius: '12px',
            background: 'rgba(226, 169, 241, 0.45)'
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
            Do
          </span>
        </div>

        {/* Do list */}
        <div
          style={{
            width: '223px',
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '9px',
            fontWeight: 400,
            lineHeight: '12px'
          }}
        >
          <p>- Check marker colors before trusting information</p>
          <p>- Read footnotes for important decisions</p>
          <p>- Be extra careful with 🔴 red markers</p>
          <p>- Use this as one tool among many</p>
        </div>
      </div>

      {/* Don't section */}
      <div>
        {/* Don't badge */}
        <div 
          className="mb-2 flex items-center justify-center"
          style={{
            width: '40px',
            height: '20px',
            borderRadius: '12px',
            background: '#FFC107'
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
            Don't
          </span>
        </div>

        {/* Don't list */}
        <div
          style={{
            width: '175px',
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '9px',
            fontWeight: 400,
            lineHeight: '12px'
          }}
        >
          <p>- Trust low-confidence (red) information</p>
          <p>- Ignore markers for critical decisions</p>
          <p>- Assume 🟢 green = 100% perfect</p>
          <p>- Use this as your only source</p>
        </div>
      </div>
    </div>
  );
};

export default Page6;