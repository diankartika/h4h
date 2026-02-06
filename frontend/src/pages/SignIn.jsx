import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../services/firebase";
import { GradientButton } from "../components/GradientButton";

export const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/home");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="w-20 h-20 mb-6 rounded-full bg-gradient-h4h flex items-center justify-center">
        <span className="text-3xl font-bold text-white italic">h4h</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Sign in to continue</h2>
      <p className="text-gray-600 text-center mb-8 max-w-xs">We save your questions so you can review them later.</p>
      <div className="w-full max-w-xs space-y-4">
        <GradientButton onClick={handleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3">
          {loading ? "Signing in..." : "Continue with Google"}
        </GradientButton>
        <p className="text-[10px] text-gray-400 text-center">By continuing, you agree to participate in this research study.</p>
      </div>
    </div>
  );
};

export default SignIn;