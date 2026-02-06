import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GradientButton } from '../components/GradientButton';
import { ProgressDots } from '../components/ProgressDots';

const OnboardingDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-between p-8 bg-white">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="mb-8 text-center">
           <h2 className="text-2xl font-bold text-gray-900">What are uncertainty markers?</h2>
        </div>
        
        {/* Figma Preview Bubble */}
        <div className="w-full p-4 bg-purple-50 rounded-2xl mb-8 border border-purple-100">
          <p className="text-sm text-gray-700">
            Cinderella is a famous story <span className="bg-emerald-100 text-emerald-800 px-1 rounded text-xs font-mono">[verified]^(1)</span>.
          </p>
        </div>

        <p className="text-sm text-gray-500 text-center mb-4">Markers show you how much the AI trusts its own specific sentences.</p>
        <ProgressDots total={3} current={1} />
      </div>
      <GradientButton onClick={() => navigate('/signin')} className="w-full">Next</GradientButton>
    </div>
  );
};

export default OnboardingDetail;