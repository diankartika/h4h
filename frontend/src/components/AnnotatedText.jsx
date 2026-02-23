// components/AnnotatedText.jsx
import React from 'react';

const getMarkerColor = (marker) => {
  const markerLower = marker.toLowerCase();
  
  if (markerLower.includes('verified') || markerLower.includes('factual') || markerLower.includes('likely')) {
    return '#43A047'; // Green
  }
  
  if (markerLower.includes('plausible') || markerLower.includes('uncertain') || markerLower.includes('questionable')) {
    return '#FFA726'; // Orange/Amber
  }
  
  if (markerLower.includes('speculative') || markerLower.includes('unsupported') || 
      markerLower.includes('contradicted') || markerLower.includes('insufficient')) {
    return '#F44336'; // Red
  }
  
  if (markerLower.includes('insufficient-info')) {
    return '#9E9E9E'; // Gray
  }
  
  return '#757575';
};

const parseMarkdown = (text) => {
  // Bold: **text**
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic: *text* (but not **, and not inside words)
  text = text.replace(/(?<!\*)\*(?!\*)([^\*]+)\*(?!\*)/g, '<em>$1</em>');
  
  // Code: `text`
  text = text.replace(/`([^`]+)`/g, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 11px;">$1</code>');
  
  return text;
};

export const AnnotatedText = ({ text }) => {
  const processText = () => {
    const lines = text.split('\n');
    const elements = [];
    let currentList = null;
    let currentListType = null;
    
    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          currentListType = null;
        }
        elements.push(<br key={`br-${lineIndex}`} />);
        return;
      }
      
      // Headers
      if (trimmedLine.startsWith('### ')) {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          currentListType = null;
        }
        elements.push(
          <h3 key={lineIndex} className="font-bold text-sm mt-3 mb-2">
            {renderLineWithMarkers(trimmedLine.replace('### ', ''))}
          </h3>
        );
        return;
      }
      if (trimmedLine.startsWith('## ')) {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          currentListType = null;
        }
        elements.push(
          <h2 key={lineIndex} className="font-bold text-base mt-4 mb-2">
            {renderLineWithMarkers(trimmedLine.replace('## ', ''))}
          </h2>
        );
        return;
      }
      if (trimmedLine.startsWith('# ')) {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          currentListType = null;
        }
        elements.push(
          <h1 key={lineIndex} className="font-bold text-lg mt-4 mb-2">
            {renderLineWithMarkers(trimmedLine.replace('# ', ''))}
          </h1>
        );
        return;
      }
      
      // Bullet points
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        const content = trimmedLine.substring(2);
        const listItem = (
          <li key={lineIndex} className="ml-4 mb-1">
            {renderLineWithMarkers(content)}
          </li>
        );
        
        if (currentListType === 'bullet') {
          currentList.props.children.push(listItem);
        } else {
          if (currentList) elements.push(currentList);
          currentList = <ul key={`ul-${lineIndex}`} className="list-disc pl-5 mb-2">{[listItem]}</ul>;
          currentListType = 'bullet';
        }
        return;
      }
      
      // Numbered lists
      const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)/);
      if (numberedMatch) {
        const content = numberedMatch[2];
        const listItem = (
          <li key={lineIndex} className="ml-4 mb-1">
            {renderLineWithMarkers(content)}
          </li>
        );
        
        if (currentListType === 'numbered') {
          currentList.props.children.push(listItem);
        } else {
          if (currentList) elements.push(currentList);
          currentList = <ol key={`ol-${lineIndex}`} className="list-decimal pl-5 mb-2">{[listItem]}</ol>;
          currentListType = 'numbered';
        }
        return;
      }
      
      // Regular paragraph
      if (currentList) {
        elements.push(currentList);
        currentList = null;
        currentListType = null;
      }
      elements.push(
        <p key={lineIndex} className="mb-2">
          {renderLineWithMarkers(line)}
        </p>
      );
    });
    
    // Push any remaining list
    if (currentList) {
      elements.push(currentList);
    }
    
    return elements;
  };
  
  const renderLineWithMarkers = (line) => {
    // Split by marker pattern: [marker, p=0.XX]^(N) or [marker, p=0.XX](N)
    const parts = line.split(/(\[.*?\]\^?\(?\d+\)?)/g);
    
    return parts.map((part, index) => {
      // Check if this is a marker
      const markerMatch = part.match(/\[(.*?)\]\^?\((\d+)\)?/);
      
      if (markerMatch) {
        const [_, markerText, footnoteNum] = markerMatch;
        const color = getMarkerColor(markerText);
        
        return (
          <span
            key={index}
            style={{
              color: color,
              fontWeight: 600,
              fontSize: '9px',
              verticalAlign: 'super',
              marginLeft: '2px',
              whiteSpace: 'nowrap'
            }}
          >
            [{markerText}]<sup style={{ fontSize: '7px' }}>({footnoteNum})</sup>
          </span>
        );
      }
      
      // Regular text - apply markdown formatting
      const formatted = parseMarkdown(part);
      return <span key={index} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div 
      style={{
        fontFamily: 'Inter',
        fontSize: '12px',
        lineHeight: '1.7',
        color: '#000',
        textAlign: 'justify'
      }}
    >
      {processText()}
    </div>
  );
};

export default AnnotatedText;