import React, { useState } from 'react';
import { StudyIcon, MailIcon } from './icons';

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'enterEmail' | 'verifyEmail'>('enterEmail');
  const [error, setError] = useState('');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    setError('');
    setStep('verifyEmail');
  };

  const handleVerify = () => {
    onLogin(email);
  };

  if (step === 'verifyEmail') {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="inline-block bg-accent p-4 rounded-full mb-6">
                    <MailIcon className="w-16 h-16 text-accent-content" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-2">
                    Check your email
                </h1>
                <p className="text-lg text-base-content/70 mb-8">
                    We've sent a verification link to <br/> <strong className="text-base-content">{email}</strong>.
                </p>
                <button
                    onClick={handleVerify}
                    className="btn btn-primary bg-primary hover:bg-primary-focus text-primary-content font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg w-full max-w-xs mb-4"
                >
                    Verify Email & Sign In
                </button>
                <button
                    onClick={() => {
                        setError('');
                        setStep('enterEmail');
                    }}
                    className="text-base-content/60 hover:text-base-content transition-colors"
                >
                    Use a different email
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-block bg-primary p-4 rounded-full mb-6">
            <StudyIcon className="w-16 h-16 text-primary-content" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-2">
          AI Study Planner
        </h1>
        <p className="text-lg text-base-content/70 mb-8">
          Enter your email to sign in or create an account.
        </p>
        <form onSubmit={handleContinue} className="w-full max-w-xs mx-auto">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-base-100 border-base-300 rounded-full p-4 text-center text-lg focus:ring-primary focus:border-primary mb-4"
                required
                autoCapitalize="none"
                autoCorrect="off"
            />
            {error && <p className="text-error text-sm mb-4">{error}</p>}
            <button
                type="submit"
                className="btn btn-primary bg-primary hover:bg-primary-focus text-primary-content font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out text-lg w-full"
            >
                Continue with Email
            </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
