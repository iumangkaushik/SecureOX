
import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ArrowRight, 
  Image as ImageIcon, 
  Zap, 
  Search, 
  Download, 
  CloudUpload,
  ChevronRight,
  Github,
  Mail,
  MapPin,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { encryptText, decryptText, embedMessage, extractMessage } from './lib/security';
import { cn } from './lib/utils';

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          OX
        </div>
        <span className="font-display font-bold text-xl tracking-tight">SecureOX</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
        <a href="#tools" className="hover:text-teal-400 transition-colors">Tools</a>
        <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
        <a href="#contact" className="hover:text-teal-400 transition-colors">Support</a>
      </div>
      <button className="cyber-button text-sm">
        Enterprise <ArrowRight size={14} />
      </button>
    </div>
  </nav>
);

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="cyber-card p-6 flex flex-col gap-4 hover:bg-white/15 cursor-default"
  >
    <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">
      <Icon size={24} />
    </div>
    <h3 className="font-display font-bold text-lg">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

const EncryptionTool = () => {
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAction = () => {
    setError('');
    setResult('');
    if (!inputText || !passphrase) return;
    
    const res = activeTab === 'encrypt' 
      ? encryptText(inputText, passphrase) 
      : decryptText(inputText, passphrase);
    
    if (res.error) {
      setError(res.error);
    } else {
      setResult(res.data || '');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="tools" className="max-w-4xl mx-auto mt-20">
      <div className="text-center mb-10">
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Text Encryption Tool</h2>
        <p className="text-gray-400">Secure your messages with military-grade AES-256-GCM encryption.</p>
      </div>

      <div className="cyber-card overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button 
            onClick={() => { 
             setActiveTab('encrypt'); 
             setResult('');
             setInputText('');
             setPassphrase('');
            }}
            className={cn(
              "flex-1 py-4 font-medium transition-all relative",
              activeTab === 'encrypt' ? "text-teal-400" : "text-gray-500 hover:text-gray-300"
            )}
          >
            Encrypt
            {activeTab === 'encrypt' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />}
          </button>
          <button 
         onClick={() => { 
             setActiveTab('decrypt'); 
             setResult('');
             setInputText('');
             setPassphrase('');
             }}
            className={cn(
              "flex-1 py-4 font-medium transition-all relative",
              activeTab === 'decrypt' ? "text-teal-400" : "text-gray-500 hover:text-gray-300"
            )}
          >
            Decrypt
            {activeTab === 'decrypt' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />}
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              {activeTab === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
            </label>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter text to ${activeTab}...`}
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Passphrase</label>
            <div className="relative">
              <input 
                type={showPassphrase ? "text" : "password"}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter a strong passphrase..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
              <button 
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-400 transition-colors"
              >
                {showPassphrase ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            onClick={handleAction}
            className="w-full py-4 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold rounded-xl shadow-lg shadow-teal-500/20 active:scale-[0.98]"
            disabled={!inputText || !passphrase}
          >
            {activeTab === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
          </button>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Result</label>
              <div className="relative group">
                <div className="w-full h-24 bg-teal-500/10 border border-teal-500/30 rounded-xl p-4 font-mono text-sm break-all overflow-y-auto">
                  {result}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 bg-teal-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </motion.div>
          )}

          {/* Feature list from video */}
          <div className="pt-6 border-t border-white/10 text-[10px] text-gray-500 uppercase tracking-widest grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> AES-256-GCM Encryption</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> PBKDF2 Key Derivation</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Random Salt Generation</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Zero-Knowledge Policy</div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  const [view, setView] = useState<'landing' | 'tools'>('landing');

  // Scroll to top when switching views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="selection:bg-teal-500/30 min-h-screen flex flex-col">
      {/* Navbar with logic to switch views */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#082f49]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setView('landing')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
              OX
            </div>
            <span className="font-display font-bold text-xl tracking-tight">SecureOX</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <button 
              onClick={() => setView(view === 'landing' ? 'tools' : 'landing')}
              className="hover:text-teal-400 transition-colors"
            >
              {view === 'landing' ? 'Our Tools' : 'Home'}
            </button>
            <a href="#features" onClick={(e) => { if (view !== 'landing') { e.preventDefault(); setView('landing'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100); } }} className="hover:text-teal-400 transition-colors">Features</a>
            <a href="#contact" className="hover:text-teal-400 transition-colors">Support</a>
          </div>
          
        </div>
      </nav>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Section */}
              <section className="pt-48 pb-20 px-4">
         <div className="max-w-7xl mx-auto text-center space-y-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm"
                  >
                    <Shield size={20} className="text-teal-400" />
                    <span className="text-sm font-medium tracking-tight">Active Defense Enabled</span>
                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  </motion.div>

                  <div className="space-y-6">
                    <motion.h1 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-6xl md:text-8xl font-display font-extrabold leading-[1.1] tracking-tighter"
                    >
                      Secure<span className="gradient-text">OX</span>
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium"
                    >
                      Lock it. Hide it. Protect it.
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm text-gray-500 max-w-lg mx-auto"
                    >
                      Enterprise-grade cybersecurity solutions with military-level encryption, intelligent threat detection, and unbreakable defense systems.
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-4"
                  >
                    <button 
                      onClick={() => setView('tools')}
                      className="cyber-button px-8 py-3 text-lg"
                    >
                      Get Started <ChevronRight size={18} />
                    </button>
                  </motion.div>
                </div>
              </section>

              {/* Features Grid */}
              <section id="features" className="py-20 bg-black/20">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="text-center mb-16 space-y-4">
                    <h2 className="font-display font-bold text-4xl">Why Choose SecureOX?</h2>
                    <p className="text-gray-400">Industry-leading security features designed to protect what matters most</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard 
                      icon={Lock} 
                      title="Military-Grade Encryption" 
                      description="AES-256-GCM encryption with PBKDF2 key derivation protects your sensitive data."
                      delay={0.1}
                    />
                    <FeatureCard 
                      icon={Search} 
                      title="OCR Technology" 
                      description="Extract text from images with advanced optical character recognition (Coming Soon)."
                      delay={0.2}
                    />
                    <FeatureCard 
                      icon={Shield} 
                      title="Zero-Knowledge Security" 
                      description="Your encryption keys are never stored or transmitted to our servers."
                      delay={0.3}
                    />
                    <FeatureCard 
                      icon={Zap} 
                      title="Lightning Fast" 
                      description="Optimized performance ensures quick encryption and decryption operations."
                      delay={0.4}
                    />
                  </div>

                  {/* Guarantees Box */}
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="cyber-card p-6 flex flex-col gap-2">
                      <h4 className="font-bold flex items-center gap-2 text-teal-400"><Check size={20} /> Security Guarantees</h4>
                      <ul className="text-sm text-gray-400 space-y-2 pl-7">
                        <li>End-to-end encryption for all operations</li>
                        <li>GDPR and SOC-2 compliant infrastructure</li>
                      </ul>
                    </div>
                     <div className="cyber-card p-6 flex flex-col gap-2 justify-center">
                       <ul className="text-sm text-gray-400 space-y-2 pl-7">
                        <li>Regular security audits and updates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="tools"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pt-24 px-4 pb-20"
            >
              <div className="max-w-7xl mx-auto">
                <button 
                  onClick={() => setView('landing')}
                  className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 transition-colors"
                >
                  <ChevronRight size={16} className="rotate-180" /> Back to Home
                </button>
                <EncryptionTool />
            
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer id="contact" className="bg-black/40 border-t border-white/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  OX
                </div>
                <span className="font-display font-bold text-2xl tracking-tight leading-none">SecureOX</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                SecureOX is a leading cybersecurity company dedicated to providing advanced digital protection through state-of-the-art encryption and stealth technology.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-teal-400">Contact Us</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex gap-3">
                  <Mail size={18} className="text-teal-500 shrink-0" />
                  <span>support@secureox.com</span>
                </li>
                <li className="flex gap-3">
                  <MapPin size={18} className="text-teal-500 shrink-0" />
                  <span> Pilani Campus, Vidya Vihar, Pilani.<br />  Pin - 333031. Rajasthan, India</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-teal-400">Location</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-center gap-3">
                   <div className="w-6 h-4 bg-blue-600 rounded-sm" /> 
                   <span>India- BITS PILANI</span>
                </li>
                
                <li className="pt-4 flex gap-4">
                  <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><Github size={20} /></a>
                  <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><Globe size={20} /></a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 text-center text-xs text-gray-600">
            © 2026 SecureOX Cybersecurity. All rights reserved. Built for Ultimate Privacy.
          </div>
        </div>
      </footer>
    </div>
  );
}
