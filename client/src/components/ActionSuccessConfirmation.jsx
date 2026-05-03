import React from 'react';
import { useLang } from '../contexts/LanguageContext';

const ActionSuccessConfirmation = ({ isOpen, onClose }) => {
  const { t } = useLang();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1c30]/40 backdrop-blur-sm p-4">
      {/* Modal Card */}
      <div className="w-full max-w-md bg-[#ffffff] rounded-xl p-10 flex flex-col items-center text-center space-y-8 shadow-2xl animate-[fadeIn_0.3s_ease-out,zoomIn_0.3s_ease-out]" style={{ boxShadow: "0 40px 60px -20px rgba(11, 28, 48, 0.08)" }}>
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-[#67f4b7]/20 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <h2 className="text-3xl font-display font-bold text-[#0b1c30] tracking-tight">{t('modals.successTitle')}</h2>
          <p className="text-[#464555] font-medium leading-relaxed font-body">
            {t('modals.successDesc')}
          </p>
        </div>
        
        {/* Next Steps / Summary Chips */}
        <div className="flex flex-wrap justify-center gap-2">
          <div className="px-4 py-2 bg-[#eff4ff] rounded-full flex items-center gap-2 text-xs font-bold text-[#006591]">
            <span className="material-symbols-outlined text-sm">mail</span>
            {t('modals.emailSent')}
          </div>
          <div className="px-4 py-2 bg-[#eff4ff] rounded-full flex items-center gap-2 text-xs font-bold text-[#006591]">
            <span className="material-symbols-outlined text-sm">description</span>
            {t('modals.contractDrafted')}
          </div>
        </div>
        
        {/* Done Button */}
        <button 
          onClick={onClose}
          className="w-full bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white py-4 rounded-full font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-[#3525cd]/20"
        >
          {t('modals.done')}
        </button>
      </div>
    </div>
  );
};

export default ActionSuccessConfirmation;
