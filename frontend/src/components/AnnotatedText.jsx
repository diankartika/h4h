import React from 'react';

const getMarkerColor = (marker) => {
  const markerLower = marker.toLowerCase();
  if (markerLower.includes('verified') || markerLower.includes('factual') || markerLower.includes('likely')) return '#43A047';
  if (markerLower.includes('plausible') || markerLower.includes('uncertain') || markerLower.includes('questionable')) return '#FFA726';
  if (markerLower.includes('speculative') || markerLower.includes('unsupported') || markerLower.includes('contradicted') || markerLower.includes('insufficient')) return '#F44336';
  return '#757575';
};

export const AnnotatedText = ({ text }) => {
  
  // Fungsi untuk handle Bold & Marker XAI secara bersamaan
  const renderFormattedText = (line) => {
    // 1. Pisahkan berdasarkan Marker XAI: [label]^(id)
    const parts = line.split(/(\[.*?\]\^?\(?\d+\)?)/g);
    
    return parts.map((part, index) => {
      const markerMatch = part.match(/\[(.*?)\]\^?\((\d+)\)?/);
      
      if (markerMatch) {
        const [_, markerText, footnoteNum] = markerMatch;
        return (
          <span key={`marker-${index}`} style={{
            color: getMarkerColor(markerText),
            fontWeight: 700,
            fontSize: '10px',
            verticalAlign: 'super',
            marginLeft: '4px',
            whiteSpace: 'nowrap'
          }}>
            [{markerText}]<sup>{footnoteNum}</sup>
          </span>
        );
      }

      // 2. Handle Bold (**teks**) di dalam sisa teks
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((subPart, subIndex) => {
        if (subPart.startsWith('**') && subPart.endsWith('**')) {
          return <strong key={`bold-${index}-${subIndex}`} style={{ fontWeight: 600, color: '#1f1f1f' }}>{subPart.slice(2, -2)}</strong>;
        }
        return subPart;
      });
    });
  };

  const processText = () => {
    const lines = text.split('\n');
    let elements = [];
    let currentList = [];
    let listType = null; // 'ul' atau 'ol'

    const flushList = () => {
      if (currentList.length > 0) {
        const Tag = listType;
        elements.push(
          <Tag key={`list-${elements.length}`} style={{ 
            paddingLeft: '28px', 
            marginBottom: '16px',
            listStylePosition: 'outside'
          }}>
            {currentList}
          </Tag>
        );
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        flushList();
        return;
      }

      // --- 1. Handle Headings ---
      const headerMatch = trimmedLine.match(/^(#{1,3})\s+(.*)/);
      if (headerMatch) {
        flushList();
        const level = headerMatch[1].length;
        const content = headerMatch[2];
        const Tag = `h${level}`;
        elements.push(
          <Tag key={`h-${idx}`} style={{ 
            fontWeight: 600, 
            marginTop: '20px', 
            marginBottom: '10px',
            fontSize: level === 3 ? '16px' : '18px',
            color: '#1f1f1f'
          }}>
            {renderFormattedText(content)}
          </Tag>
        );
        return;
      }

      // --- 2. Handle Numbered List (OL) ---
      // Fix: Menangkap angka saja dan memisahkan konten agar tidak kena regex marker
      const numberedMatch = line.match(/^\s*(\d+)\.\s+(.*)/);
      if (numberedMatch) {
        if (listType === 'ul') flushList();
        listType = 'ol';
        currentList.push(
          <li key={`li-ol-${idx}`} style={{ marginBottom: '10px', lineHeight: '1.6' }}>
            {renderFormattedText(numberedMatch[2])}
          </li>
        );
        return;
      }

      // --- 3. Handle Bullet Points (UL) ---
      const bulletMatch = line.match(/^\s*([*-])\s+(.*)/);
      if (bulletMatch) {
        if (listType === 'ol') flushList();
        listType = 'ul';
        currentList.push(
          <li key={`li-ul-${idx}`} style={{ marginBottom: '10px', lineHeight: '1.6' }}>
            {renderFormattedText(bulletMatch[2])}
          </li>
        );
        return;
      }

      // --- 4. Handle Paragraph Biasa ---
      flushList();
      elements.push(
        <p key={`p-${idx}`} style={{ marginBottom: '16px', lineHeight: '1.7', color: '#3c4043' }}>
          {renderFormattedText(line)}
        </p>
      );
    });

    flushList();
    return elements;
  };

  return (
    <div style={{ 
      fontFamily: '"Google Sans", "Inter", sans-serif', 
      fontSize: '14px',
      color: '#3c4043'
    }}>
      {processText()}
    </div>
  );
};