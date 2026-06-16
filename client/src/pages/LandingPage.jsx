import React from 'react';
import { TrendingUp, FileText, Activity, Shield, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-sec-dark relative overflow-hidden font-sans selection:bg-sec-cyan selection:text-sec-darker text-slate-200">
      
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-sec-cyan rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-float"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-sec-teal rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-float-delayed"></div>
        <div className="absolute top-[40%] left-[60%] w-[30rem] h-[30rem] bg-sec-accent rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse-glow"></div>
        
        {/* Grid lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 bg-sec-dark/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-sec-cyan to-sec-teal rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Activity className="w-5 h-5 text-sec-darker" strokeWidth={3} />
            </div>
            <span className="text-2xl font-black tracking-tight text-white ml-2">
              Auto<span className="text-transparent bg-clip-text bg-gradient-to-r from-sec-cyan to-sec-teal">Report</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link to="/register" className="px-5 py-2.5 text-sm font-bold bg-white text-sec-darker hover:bg-slate-200 rounded-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-sec-cyan mb-8 hover:bg-white/10 transition-colors cursor-pointer border-sec-cyan/30">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sec-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sec-cyan"></span>
          </span>
          Autonomous AI Report Writer 2.0
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
          Generate Deep Reports <br className="hidden md:block" />
          <span className="relative inline-block mt-2">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-sec-cyan via-sec-teal to-sec-emerald">
              with Autonomous Agents
            </span>
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-sec-cyan/20 blur-md rounded-full"></div>
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12 leading-relaxed font-light">
          Unleash a LangGraph agent to scour the web, analyze gaps, and synthesize a fully cited, professional markdown report on literally any subject.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
          <Link to="/register" className="group relative w-full sm:w-auto px-8 py-4 text-lg font-bold bg-gradient-to-r from-sec-cyan to-sec-teal text-sec-darker rounded-xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2 overflow-hidden">
            <span className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            <span className="relative">Start Generating</span>
            <ChevronRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold glass-panel hover:bg-white/10 rounded-xl transition-all hover:-translate-y-1 text-center text-white">
            View Live Demo
          </Link>
        </div>

        {/* Floating UI Elements (Decorative) */}
        <div className="relative w-full max-w-4xl mx-auto mt-24">
          <div className="absolute inset-0 bg-gradient-to-t from-sec-dark via-transparent to-transparent z-10 h-full"></div>
          <div className="glass-panel rounded-2xl p-2 border-t border-white/20 shadow-2xl transform perspective-1000 rotateX-12 scale-95 opacity-80">
            <div className="bg-sec-darker/80 rounded-xl p-4 md:p-8 flex flex-col gap-4 border border-white/5">
              <div className="w-1/3 h-4 bg-sec-cyan/20 rounded-full animate-pulse"></div>
              <div className="w-full h-2 bg-slate-800 rounded-full"></div>
              <div className="w-5/6 h-2 bg-slate-800 rounded-full"></div>
              <div className="w-4/6 h-2 bg-slate-800 rounded-full"></div>
              <div className="mt-4 flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-sec-teal/20 flex items-center justify-center border border-sec-teal/30">
                  <FileText className="text-sec-teal w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="w-1/4 h-3 bg-sec-emerald/20 rounded-full"></div>
                  <div className="w-full h-2 bg-slate-800 rounded-full"></div>
                  <div className="w-2/3 h-2 bg-slate-800 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-32 text-left relative z-20">
          <div className="group p-8 rounded-3xl glass-panel hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.3)] hover:border-sec-cyan/30">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sec-cyan/20 to-transparent flex items-center justify-center mb-6 border border-sec-cyan/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-sec-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Report Planning</h3>
            <p className="text-slate-400 font-light leading-relaxed">The agent breaks your topic into focused sub-questions, mapping out a comprehensive architecture before searching.</p>
          </div>
          <div className="group p-8 rounded-3xl glass-panel hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(20,184,166,0.3)] hover:border-sec-teal/30">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sec-teal/20 to-transparent flex items-center justify-center mb-6 border border-sec-teal/20 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-sec-teal drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Multi-Iteration</h3>
            <p className="text-slate-400 font-light leading-relaxed">Powered by LangGraph conditional edges to loop back dynamically if there are critical information gaps.</p>
          </div>
          <div className="group p-8 rounded-3xl glass-panel hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)] hover:border-sec-emerald/30">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sec-emerald/20 to-transparent flex items-center justify-center mb-6 border border-sec-emerald/20 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-sec-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Cited Reports</h3>
            <p className="text-slate-400 font-light leading-relaxed">Automatically synthesizes findings into beautifully structured markdown reports with academic inline citations.</p>
          </div>
        </div>
      </main>
      
    </div>
  );
}

export default LandingPage;
