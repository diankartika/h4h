import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithGoogle } from "../services/firebase";
import { ProgressDots } from '../components/ProgressDots';
import logoShort from '../assets/logo-short.png';

export const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!agreed) {
      alert("Please agree to participate in the research study");
      return;
    }
    
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      console.log("User signed in:", user);
      navigate("/home"); // Navigate to home after successful sign-in
    } catch (err) {
      console.error("Sign-in error:", err);
      alert("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-8">
        {/* Logo with gradient blur */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          {/* Gradient blur background */}
          <div className="absolute inset-0 w-[180px] h-[180px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-purple-300 to-pink-300 rounded-full blur-3xl opacity-50" />
          </div>
          
          <img 
            src={logoShort} 
            alt="h4h logo" 
            className="relative w-[157px] h-[157px] object-contain z-10"
            style={{ aspectRatio: '1/1' }}
          />
        </motion.div>

        {/* Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            width: '220px',
            height: '25px',
            color: '#000',
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 'normal',
            marginBottom: '16px'
          }}
        >
          Sign in to continue
        </motion.h2>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
          style={{
            color: 'rgba(0, 0, 0, 0.65)',
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: '12px',
            fontWeight: 300,
            lineHeight: 'normal',
            maxWidth: '220px'
          }}
        >
          We save your questions so you can review them later
        </motion.p>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <ProgressDots total={3} current={2} />
        </motion.div>

        {/* Continue with Google button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onClick={handleSignIn}
          disabled={loading || !agreed}
          className="flex items-center justify-center gap-3 hover:shadow-md transition-shadow"
          style={{
            width: '227px',
            height: '50px',
            borderRadius: '8px',
            border: '1px solid #DFDFDF',
            background: '#FFF',
            opacity: (!agreed || loading) ? 0.5 : 1,
            cursor: (!agreed || loading) ? 'not-allowed' : 'pointer',
          }}
        >
          {/* Google logo */}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path opacity="0.987" fillRule="evenodd" clipRule="evenodd" d="M5.95924 0.06075C6.68424 -0.02025 7.11324 -0.02025 7.89224 0.06075C9.27118 0.264845 10.5495 0.902235 11.5422 1.88075C10.8714 2.51489 10.2093 3.15828 9.55624 3.81075C8.30558 2.75075 6.90958 2.50608 5.36824 3.07675C4.23758 3.59675 3.45024 4.43942 3.00624 5.60475C2.28068 5.06458 1.56457 4.51183 0.858242 3.94675C0.809155 3.92091 0.75309 3.91145 0.698242 3.91975C1.82024 1.75642 3.57358 0.46975 5.95824 0.05975" fill="#F44336"/>
            <path opacity="0.997" fillRule="evenodd" clipRule="evenodd" d="M0.696252 3.91975C0.752919 3.91109 0.806585 3.92009 0.857252 3.94675C1.56358 4.51183 2.27969 5.06458 3.00525 5.60475C2.89108 6.05881 2.8191 6.52245 2.79025 6.98975C2.81492 7.44175 2.88659 7.88542 3.00525 8.32075L0.750252 10.1158C-0.231748 8.06375 -0.249748 5.99842 0.696252 3.91975Z" fill="#FFC107"/>
            <path opacity="0.999" fillRule="evenodd" clipRule="evenodd" d="M11.4351 12.2897C10.7329 11.6705 9.99786 11.0897 9.23307 10.5497C9.99974 10.0084 10.4651 9.26574 10.6291 8.32174H6.87207V5.71274C9.03874 5.69474 11.2044 5.71308 13.3691 5.76774C13.7797 7.99774 13.3054 10.0084 11.9461 11.7997C11.7844 11.9716 11.6132 12.1351 11.4351 12.2897Z" fill="#448AFF"/>
            <path opacity="0.993" fillRule="evenodd" clipRule="evenodd" d="M3.005 8.32175C3.825 10.3597 5.32833 11.3111 7.515 11.1757C8.12883 11.1047 8.71735 10.8902 9.233 10.5497C9.99833 11.0911 10.7323 11.6711 11.435 12.2897C10.3216 13.2902 8.90211 13.8838 7.408 13.9737C7.06854 14.0009 6.72746 14.0009 6.388 13.9737C3.84267 13.6737 1.96333 12.3877 0.75 10.1157L3.005 8.32175Z" fill="#43A047"/>
          </svg>

          <span
            style={{
              color: '#000',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: 'normal'
            }}
          >
            {loading ? "Signing in..." : "Continue with Google"}
          </span>

          <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M0.530273 0.530334L5.53027 5.53033L0.530273 10.5303" stroke="black" strokeWidth="1.5"/>
          </svg>
        </motion.button>

        {/* Checkbox and privacy link container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col items-start mt-4"
          style={{ width: '227px' }}
        >
          {/* Checkbox agreement */}
          <div className="flex items-start gap-2 mb-2">
            <input
              type="checkbox"
              id="agree-checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 flex-shrink-0"
              style={{
                width: '15px',
                height: '15px',
                cursor: 'pointer'
              }}
            />
            <label
              htmlFor="agree-checkbox"
              style={{
                flex: 1,
                color: 'rgba(0, 0, 0, 0.65)',
                fontFamily: 'Inter',
                fontSize: '12px',
                fontWeight: 300,
                lineHeight: 'normal',
                cursor: 'pointer'
              }}
            >
              By continuing, you agree to participate in this research study
            </label>
          </div>

          {/* Learn about data privacy link */}
          <button
            onClick={() => setShowPrivacyModal(true)}
            style={{
              color: '#0761D6',
              textAlign: 'left',
              fontFamily: 'Inter',
              fontSize: '10px',
              fontWeight: 500,
              lineHeight: 'normal',
              textDecoration: 'underline',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              marginLeft: 'calc(15px + 8px)'
            }}
          >
            Learn about data privacy
          </button>
        </motion.div>
      </div>

      {/* Privacy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPrivacyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative overflow-hidden"
              style={{
                width: '299px',
                maxHeight: '383px',
                borderRadius: '12px',
                border: '1px solid #96C8F4',
                background: '#F2F2F2'
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-3 right-3 z-10 w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>

              {/* Scrollable content */}
              <div className="overflow-y-auto h-full p-6" style={{ maxHeight: '383px' }}>
                <h3
                  className="mb-2"
                  style={{
                    color: '#000',
                    fontFamily: 'Inter',
                    fontSize: '13px',
                    fontWeight: 700,
                    lineHeight: 'normal'
                  }}
                >
                  Learn About Data Privacy
                </h3>

                <p
                  className="mb-4"
                  style={{
                    color: '#0761D6',
                    fontFamily: 'Inter',
                    fontSize: '13px',
                    fontWeight: 700,
                    lineHeight: 'normal'
                  }}
                >
                  This is a research project
                </p>

                <div
                  style={{
                    color: 'rgba(0, 0, 0, 0.80)',
                    fontFamily: 'Inter',
                    fontSize: '11px',
                    fontWeight: 400,
                    lineHeight: '1.5'
                  }}
                >
                  <p className="mb-4">
                    Human4Human (H4H) is part of an undergraduate research study exploring how uncertainty markers affect user trust in AI-generated answers.
                  </p>

                  <p className="font-semibold mb-2">What data we save</p>
                  <ol className="list-decimal list-inside mb-4 space-y-1">
                    <li>The questions you ask in this system</li>
                    <li>AI-generated answers with uncertainty markers</li>
                    <li>Anonymous usage data for research analysis</li>
                  </ol>
                  <p className="mb-4">
                    This helps us understand how people interpret and respond to uncertainty in AI outputs.
                  </p>

                  <p className="font-semibold mb-2">What we do not collect</p>
                  <ul className="mb-4 space-y-1">
                    <li>❌ Your real identity beyond Google sign-in</li>
                    <li>❌ Passwords or private account data</li>
                    <li>❌ Personal information unrelated to your questions</li>
                  </ul>

                  <p className="font-semibold mb-2">How your data is used</p>
                  <ol className="list-decimal list-inside mb-4 space-y-1">
                    <li>Your data is used only for academic research purposes</li>
                    <li>Results are analyzed in aggregate, not individually</li>
                    <li>No data is sold or shared with third parties</li>
                  </ol>

                  <p className="font-semibold mb-2">Data storage</p>
                  <ol className="list-decimal list-inside mb-4 space-y-1">
                    <li>Data is stored securely and accessed only by the researcher</li>
                    <li>Data retention is limited to the duration of this study</li>
                  </ol>

                  <p className="font-semibold mb-2">Your participation</p>
                  <p className="mb-4">
                    By continuing, you voluntarily participate in this research study and may stop using the system at any time.
                  </p>

                  <p className="font-semibold mb-2">Why do we limit usage?</p>
                  <p className="mb-6">
                    H4H is currently limited to 5 questions per user due to research and resource constraints.
                  </p>

                  {/* Agree button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setAgreed(true);
                        setShowPrivacyModal(false);
                      }}
                      style={{
                        width: '107px',
                        height: '21px',
                        borderRadius: '8px',
                        background: '#5CC5A2',
                        color: '#FFF',
                        fontFamily: 'Inter',
                        fontSize: '8px',
                        fontWeight: 700,
                        lineHeight: '10px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Agree to participate
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SignIn;