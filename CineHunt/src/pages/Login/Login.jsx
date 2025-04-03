import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const { user, loginWithGoogle, loginWithEmail, signUpWithEmail }= useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Name validation (only for signup)
    if (isSignUp && !formData.name.trim()) {
      tempErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation (only for signup)
    if (isSignUp && formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ score: 0, feedback: '' });
      return;
    }
    
    let score = 0;
    let feedback = '';
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety check
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Feedback based on score
    if (score <= 1) feedback = 'Weak';
    else if (score <= 3) feedback = 'Moderate';
    else feedback = 'Strong';
    
    setPasswordStrength({ score, feedback });
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    checkPasswordStrength(formData.password);
  }, [formData.password]);


  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setFormStatus({ 
        type: 'error', 
        message: error.message || 'Google sign-in failed. Please try again.' 
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setFormStatus({ type: '', message: '' });
      
      try {
        if (isSignUp) {
          await signUpWithEmail(formData.email, formData.password);
          setFormStatus({ 
            type: 'success', 
            message: 'Account created successfully!' 
          });
        } else {
          await loginWithEmail(formData.email, formData.password);
          setFormStatus({ 
            type: 'success', 
            message: 'Signed in successfully!' 
          });
        }
        navigate('/');
      } catch (error) {
        setFormStatus({ 
          type: 'error', 
          message: error.message || 'Authentication failed. Please try again.' 
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  // Helper function to render the password strength indicator
  const renderPasswordStrengthIndicator = () => {
    if (!formData.password) return null;
    
    const colors = {
      0: 'bg-red-500',
      1: 'bg-red-500',
      2: 'bg-yellow-500',
      3: 'bg-yellow-500',
      4: 'bg-green-500',
      5: 'bg-green-500'
    };
    
    return (
      <div className="mt-1">
        <div className="flex gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div 
              key={level}
              className={`h-1 flex-1 rounded-full ${level <= passwordStrength.score ? colors[passwordStrength.score] : 'bg-gray-600'}`}
            ></div>
          ))}
        </div>
        <p className={`text-xs ${
          passwordStrength.score <= 1 ? 'text-red-400' : 
          passwordStrength.score <= 3 ? 'text-yellow-400' : 'text-green-400'
        }`}>
          {passwordStrength.feedback}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl"></div>
        
        {/* Form status message */}
        {formStatus.message && (
          <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
            formStatus.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
          }`}>
            {formStatus.type === 'error' ? 
              <AlertCircle size={18} /> : 
              <CheckCircle size={18} />
            }
            {formStatus.message}
          </div>
        )}
        
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-300 mt-2">
            {isSignUp
              ? 'Join the world of cinema'
              : 'Discover your next favorite movies'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {isSignUp && (
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full bg-gray-700/50 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.name ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                />
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.name}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={`w-full bg-gray-700/50 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.email ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full bg-gray-700/50 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.password ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.password}
                </p>
              )}
              {isSignUp && renderPasswordStrengthIndicator()}
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full bg-gray-700/50 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.confirmPassword ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          )}

          {!isSignUp && (
            <div className="flex justify-end">
              <button type="button" className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg py-3 font-semibold transition duration-300 hover:from-blue-700 hover:to-blue-900 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-gray-800/50 text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 rounded-lg py-3 font-medium transition duration-300 hover:bg-gray-100 disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
            <>
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </>
            )}
          </button>
        </div>

        <p className="text-center text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrors({});
              setFormStatus({ type: '', message: '' });
            }}
            className="ml-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;