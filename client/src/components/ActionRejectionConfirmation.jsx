import React from 'react';

const ActionRejectionConfirmation = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0b1c30]/10 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#ffffff] rounded-xl p-10 text-center shadow-2xl border border-[#c7c4d8]/10 animate-[fadeIn_0.3s_ease-out,zoomIn_0.3s_ease-out]">
        
        {/* Icon Cluster */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Outer Halo */}
            <div className="absolute inset-0 scale-150 bg-[#ffdad6]/30 rounded-full blur-xl"></div>
            {/* Icon Container */}
            <div className="relative w-20 h-20 bg-[#ffdad6] flex items-center justify-center rounded-full">
              <span className="material-symbols-outlined text-[#ba1a1a] text-4xl">person_remove</span>
            </div>
          </div>
        </div>
        
        {/* Content Hierarchy */}
        <div className="space-y-4 mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#0b1c30]">Candidate Rejected</h1>
          <p className="text-[#464555] font-body leading-relaxed px-4">
            The candidate has been notified that their application was not successful for this cycle.
          </p>
        </div>
        
        {/* Action Area */}
        <div className="space-y-6">
          <button 
            onClick={onClose}
            className="w-full bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-[#ffffff] font-semibold py-4 px-8 rounded-full shadow-lg shadow-[#3525cd]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Done
          </button>
          <div className="pt-2">
            <span className="text-xs font-body uppercase tracking-widest text-[#777587]">
              Academic Pulse Talent Manager
            </span>
          </div>
        </div>
        
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-8xl">policy</span>
        </div>
      </div>
    </div>
  );
};

export default ActionRejectionConfirmation;
