// src/components/MarkerBadge.jsx
import React from 'react';

const getMarkerStyles = (markerType) => {
  const styles = {
    verified: 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-900 border-emerald-500',
    factual: 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-400',
    likely: 'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-900 border-teal-500',
    plausible: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 border-amber-500',
    uncertain: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-900 border-orange-500',
    questionable: 'bg-gradient-to-r from-orange-200 to-orange-300 text-orange-900 border-orange-600',
    unsupported: 'bg-gradient-to-r from-red-100 to-red-200 text-red-900 border-red-500',
    speculative: 'bg-gradient-to-r from-red-100 to-red-300 text-red-900 border-red-600',
    contradicted: 'bg-gradient-to-r from-red-200 to-red-300 text-red-900 border-red-700',
    'insufficient-info': 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-400',
  };
  
  return styles[markerType] || styles.uncertain;
};

export const MarkerBadge = ({ type, pScore, showProbability = true, footnoteId }) => {
  const styles = getMarkerStyles(type);
  
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border-1.5 font-mono text-xs font-semibold ${styles} transition-all hover:scale-105`}
      role="status"
      aria-label={`Uncertainty marker: ${type}, confidence ${pScore ? (pScore * 100).toFixed(0) : ''}%`}
    >
      <span>
        [{type}
        {showProbability && pScore && <>, p={pScore.toFixed(2)}</>}]
      </span>
      {footnoteId && (
        <sup className="text-[10px] font-bold">({footnoteId})</sup>
      )}
    </span>
  );
};

export default MarkerBadge;
