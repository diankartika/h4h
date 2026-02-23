// components/AnnotatedText.jsx
import React from 'react';

const getMarkerColor = (marker) => {
  const markerLower = marker.toLowerCase();
  
  if (markerLower.includes('verified') || markerLower.includes('factual') || markerLower.includes('likely')) {
    return '#43A047';
  }
  
  if (markerLower.includes('plausible') || markerLower.includes('uncertain') || markerLower.includes('questionable')) {
    return '#FFA726';
  }
  
  if (markerLower.includes('speculative') || markerLower.includes('unsupported') || 
      markerLower.includes('contradicted') || markerLower.includes('insufficient')) {
    return '#F44336';
  }
  
  if (markerLower.includes('insufficient-info')) {
    return '#9E9E9E';
  }
  
  return '#757575';
};

const parseMarkdown = (text) => {
  // Bold: **text**
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic: *text*
  text = text.replace(/(?<!\*)\*(?!\*)([^\*]+)\*(?!\*)/g, '<em>$1</em>');
  
  // Code: `text`
  text = text.replace(/`([^`]+)`/g, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 11px;">$1</code>');
  
  return text;
};

const olStyle = {
  paddingLeft: '20px',
  marginBottom: '16px'
};

const ulStyle = {
  paddingLeft: '20px',
  marginBottom: '16px'
};

const liStyle = {
  marginBottom: '8px',
  lineHeight: '1.7'
};

export const AnnotatedText = ({ text }) => {
  const processText = () => {
    const lines = text.split('\n');
    const elements = [];
    let currentList = null;
    let currentListType = null;
    let listItems = [];
    
    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        if (currentList) {
          elements.push(
            <ol key="final-list" className="list-decimal pl-8 mb-3 space-y-2">
              {listItems}
            </ol>
          );
          currentList = null;
          currentListType = null;
          listItems = [];
        }
        return;
      }
      
      // Headers
      if (trimmedLine.startsWith('### ')) {
        if (currentList) {
          elements.push(
            <ol key="final-list" className="list-decimal pl-8 mb-3 space-y-2">
              {listItems}
            </ol>
          );
          currentList = null;
          listItems = [];
        }
        elements.push(
          <h3 key={lineIndex} className="font-bold text-sm mt-4 mb-2">
            {renderLineWithMarkers(trimmedLine.replace('### ', ''))}
          </h3>
        );
        return;
      }

      if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h2
            key={lineIndex}
            style={{
              fontWeight: 600,
              fontSize: '18px',
              marginBottom: '8px'
            }}
          >
            {renderLineWithMarkers(trimmedLine.replace('## ', ''))}
          </h2>
        );
        return;
      }

      if (trimmedLine.startsWith('# ')) {
        if (currentList) {
          elements.push(
            <ol key="final-list" className="list-decimal pl-8 mb-3 space-y-2">
              {listItems}
            </ol>
          );
          currentList = null;
          listItems = [];
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

        if (currentListType !== 'ul') {
          if (currentList && listItems.length > 0) {
            elements.push(
              <ol key="final-list" className="list-decimal pl-6 mb-4 space-y-2">
                {listItems}
              </ol>
            );
          }

          currentList = true;
          currentListType = 'ul';
          listItems = [];
        }

        listItems.push(
          <li key={lineIndex} className="leading-relaxed">
            {renderLineWithMarkers(content)}
          </li>
        );

        return;
      }
      
      // Numbered lists - REMOVE MARKERS FROM THE NUMBER ITSELF
      const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)/);

      if (numberedMatch) {
        const content = numberedMatch[2];

        if (currentListType !== 'ol') {
          if (currentList && listItems.length > 0) {
            elements.push(
              currentListType === 'ul' ? (
                <ul key={`list-${lineIndex}`} style={ulStyle}>
                  {listItems}
                </ul>
              ) : (
                <ol key={`list-${lineIndex}`} style={olStyle}>
                  {listItems}
                </ol>
              )
            );
          }

          currentList = true;
          currentListType = 'ol';
          listItems = [];
        }

        listItems.push(
          <li key={lineIndex} style={liStyle}>
            {renderLineWithMarkers(content)}
          </li>
        );

        return;
      }
      
      // End list if we hit regular text
      if (currentList) {
        elements.push(
          <ol key="final-list" className="list-decimal pl-8 mb-3 space-y-2">
            {listItems}
          </ol>
        );
        currentList = null;
        listItems = [];
      }
      
      // Regular paragraph
      elements.push(
        <p className="mb-4 leading-relaxed">
            {renderLineWithMarkers(line)}
        </p>
      );
    });
    
    // Push any remaining list
    if (currentList && listItems.length > 0) {
      elements.push(
        currentListType === 'ul' ? (
          <ul key="final-list" className="list-disc pl-6 mb-4 space-y-2">
            {listItems}
          </ul>
        ) : (
          <ol key="final-list" className="list-decimal pl-6 mb-4 space-y-2">
            {listItems}
          </ol>
        )
      );
    }
    
    return elements;
  };
  
  const renderLineWithMarkers = (line) => {

    // Convert ^(3) → <sup>3</sup>
    line = line.replace(/\^\((\d+)\)/g, '<sup>$1</sup>');

    // Match marker format: [text, p=0.xx]
    const parts = line.split(/(\[[^\]]+\])/g);

    return parts.map((part, index) => {

      const markerMatch = part.match(/\[([^\]]+)\]/);

      if (markerMatch) {
        const markerText = markerMatch[1];
        const color = getMarkerColor(markerText);

        return (
          <span
            key={index}
            style={{
              color: color,
              fontWeight: 500
            }}
          >
            [{markerText}]
          </span>
        );
      }

      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(part) }}
        />
      );
    });
  };

  return (
    <div
      style={{
        fontFamily: 'Inter, system-ui, -apple-system',
        fontSize: '15px',
        lineHeight: '1.75',
        color: '#1a1a1a',
        maxWidth: '640px',
        margin: '0 auto',
        padding: '0 20px'
      }}
    >
      {processText()}
    </div>
  );
};

export default AnnotatedText;