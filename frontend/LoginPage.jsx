import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Integrate FastAPI JWT Authentication here
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      
      {/* Abstract Background Orbs for Modern Aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>

      {/* Glassmorphism Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
        
        <div className="text-center mb-10">
          {/* Glowing Heading utilizing CSS3 text-shadow */}
          <h1 
            className="text-4xl font-bold text-white mb-2"
            style={{ textShadow: '0 0 12px rgba(45, 212, 191, 0.8), 0 0 24px rgba(45, 212, 191, 0.4)' }}
          >
            TransitOps
          </h1>
          
          {/* Subtitle with custom spacing for legibility */}
          <p 
            className="text-slate-300 text-sm uppercase font-medium mt-3"
            style={{ wordSpacing: '3px', letterSpacing: '0.1em' }}
          >
            Smart Transport Operations Platform
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-slate-300 mb-2"
              style={{ letterSpacing: '0.05em' }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="manager@transitops.com"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-slate-300 mb-2"
              style={{ letterSpacing: '0.05em' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center text-sm text-slate-400 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-800 mr-2" 
              />
              Remember me
            </label>
            <a href="#" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit Button with hover lift effect */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 mt-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-lg shadow-[0_0_15px_rgba(45,212,191,0.4)] transition-all transform hover:-translate-y-0.5"
            style={{ letterSpacing: '0.08em' }}
          >
            SIGN IN
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default LoginPage;