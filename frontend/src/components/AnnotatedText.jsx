// components/AnnotatedText.jsx
import React from 'react';

const getMarkerColor = (marker, confidence) => {
  // Extract marker type from the bracket text
  const markerLower = marker.toLowerCase();
  
  // Green - High confidence SUPPORTS
  if (markerLower.includes('verified') || markerLower.includes('factual') || markerLower.includes('likely')) {
    return '#43A047'; // Green
  }
  
  // Yellow/Amber - Medium confidence
  if (markerLower.includes('plausible') || markerLower.includes('uncertain') || markerLower.includes('questionable')) {
    return '#FFA726'; // Orange/Amber
  }
  
  // Red - Low confidence or REFUTES
  if (markerLower.includes('speculative') || markerLower.includes('unsupported') || 
      markerLower.includes('contradicted') || markerLower.includes('insufficient')) {
    return '#F44336'; // Red
  }
  
  // Gray - Not enough info
  if (markerLower.includes('insufficient-info')) {
    return '#9E9E9E'; // Gray
  }
  
  // Default
  return '#757575';
};

export const AnnotatedText = ({ text }) => {
  // Split text by markers pattern: [marker, p=0.XX]^(N)
  const parts = text.split(/(\[.*?\]\^\(\d+\))/g);
  
  return (
    <span>
      {parts.map((part, index) => {
        // Check if this part is a marker
        const markerMatch = part.match(/\[(.*?)\]\^\((\d+)\)/);
        
        if (markerMatch) {
          const [fullMatch, markerText, footnoteNum] = markerMatch;
          const color = getMarkerColor(markerText);
          
          return (
            <span
              key={index}
              style={{
                color: color,
                fontWeight: 600,
                fontSize: '10px',
                verticalAlign: 'super',
                marginLeft: '2px'
              }}
            >
              [{markerText}]
              <sup style={{ fontSize: '8px' }}>({footnoteNum})</sup>
            </span>
          );
        }
        
        // Regular text
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default AnnotatedText;