import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GradientButton } from '../components/GradientButton';
import { ProgressDots } from '../components/ProgressDots';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-between p-8 bg-white">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-brand-fuzz rounded-full flex items-center justify-center mb-8">
          <span className="text-3xl font-bold bg-gradient-h4h bg-clip-text text-transparent italic">h4h</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to human-ai project</h2>
        <p className="text-gray-500 max-w-xs">Helping you understand AI certainty through smart annotations.</p>
        <ProgressDots total={3} current={0} />
      </div>
      <GradientButton onClick={() => navigate('/onboarding/2')} className="w-full">Next</GradientButton>
    </div>
  );
};

export default Onboarding;