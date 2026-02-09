// components/GuideModal/Page1.jsx
import React from 'react';
import logoShort from '../../assets/logo-short.png';

const Page1 = () => {
  return (
    <div>
      {/* Logo centered */}
      <div className="flex justify-center mb-4">
        <img 
          src={logoShort} 
          alt="h4h" 
          style={{
            width: '60px',
            height: '60px',
            aspectRatio: '1/1',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Title */}
      <h2 
        className="text-center mb-3"
        style={{
          color: '#000',
          fontFamily: 'Inter',
          fontSize: '12px',
          fontWeight: 600,
          lineHeight: 'normal'
        }}
      >
        How this project works?
      </h2>

      {/* Description */}
      <p 
        className="mb-4"
        style={{
          width: '232px',
          color: '#A0A0A0',
          textAlign: 'justify',
          fontFamily: 'Inter',
          fontSize: '8px',
          fontStyle: 'italic',
          fontWeight: 400,
          lineHeight: '10px',
          margin: '0 auto 16px'
        }}
      >
        This is actually a research project for Dian's undergraduate thesis. Currently she's very curious about UX-HCI related, especially for LLM (Large Language Model) or AI for trustworthy and uncertainty outputs, then how it will be impact for its users.
      </p>

      {/* Steps */}
      <div className="space-y-3">
        {/* Step 1 */}
        <div className="flex items-start gap-2">
          <div className="relative flex-shrink-0" style={{ width: '14px', height: '14px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="7" fill="#448AFF"/>
            </svg>
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                color: '#FFF',
                textAlign: 'center',
                fontFamily: 'Inter',
                fontSize: '8px',
                fontWeight: 500,
                lineHeight: 'normal'
              }}
            >
              1
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <p
                style={{
                  color: '#000',
                  textAlign: 'justify',
                  fontFamily: 'Inter',
                  fontSize: '9px',
                  fontWeight: 600,
                  lineHeight: 'normal'
                }}
              >
                Ask 5 Questions
              </p>
              <span
                style={{
                  color: '#A0A0A0',
                  textAlign: 'justify',
                  fontFamily: 'Inter',
                  fontSize: '6px',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  lineHeight: '10px'
                }}
              >
                (this is limited due to limit resources)
              </span>
            </div>
            <p
              style={{
                color: '#000',
                textAlign: 'justify',
                fontFamily: 'Inter',
                fontSize: '9px',
                fontWeight: 400,
                lineHeight: 'normal',
                marginTop: '2px'
              }}
            >
              Any topic you're curious about
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-2">
          <div className="relative flex-shrink-0" style={{ width: '14px', height: '14px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="7" fill="#448AFF"/>
            </svg>
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                color: '#FFF',
                textAlign: 'center',
                fontFamily: 'Inter',
                fontSize: '8px',
                fontWeight: 500,
                lineHeight: 'normal'
              }}
            >
              2
            </div>
          </div>
          <div className="flex-1">
            <p
              style={{
                color: '#000',
                textAlign: 'justify',
                fontFamily: 'Inter',
                fontSize: '9px',
                fontWeight: 600,
                lineHeight: 'normal'
              }}
            >
              Read Marked Answers
            </p>
            <p
              style={{
                color: '#000',
                textAlign: 'justify',
                fontFamily: 'Inter',
                fontSize: '9px',
                fontWeight: 400,
                lineHeight: 'normal',
                marginTop: '2px'
              }}
            >
              See confidence levels
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-2">
          <div className="relative flex-shrink-0" style={{ width: '14px', height: '14px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="7" fill="#448AFF"/>
            </svg>
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                color: '#FFF',
                textAlign: 'center',
                fontFamily: 'Inter',
                fontSize: '8px',
                fontWeight: 500,
                lineHeight: 'normal'
              }}
            >
              3
            </div>
          </div>
          <div className="flex-1">
            <p
              style={{
                color: '#000',
                textAlign: 'justify',
                fontFamily: 'Inter',
                fontSize: '9px',
                fontWeight: 600,
                lineHeight: 'normal'
              }}
            >
              Share Your Feedback
            </p>
            <p
              style={{
                color: '#000',
                textAlign: 'justify',
                fontFamily: 'Inter',
                fontSize: '9px',
                fontWeight: 400,
                lineHeight: 'normal',
                marginTop: '2px'
              }}
            >
              Help improve AI transparency
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page1;