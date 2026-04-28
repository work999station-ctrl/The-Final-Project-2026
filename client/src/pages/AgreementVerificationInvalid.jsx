import React from 'react';

const AgreementVerificationInvalid = () => {
    return (
        <div className="bg-[#F8FAFC] dark:bg-[#121121] text-slate-900 dark:text-white min-h-screen font-body pb-24 md:pb-0 pt-16 flex flex-col">
            {/* TopAppBar */}
            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center h-16 px-4 max-w-7xl mx-auto w-full">
                    <button aria-label="Scan" className="text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors p-2 rounded-full flex items-center justify-center active:scale-95 duration-100">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>qr_code_scanner</span>
                    </button>
                    <h1 className="text-sm md:text-lg font-bold text-indigo-600 dark:text-indigo-400 font-space-grotesk tracking-tight">Agreement Verifier</h1>
                    <button aria-label="Account" className="text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors p-2 rounded-full flex items-center justify-center active:scale-95 duration-100">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
                    </button>
                </div>
            </header>

            {/* Main Content Canvas */}
            <main className="flex-grow flex items-center justify-center p-6 pt-12 pb-12 max-w-[1280px] mx-auto w-full">
                {/* Error Result Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] p-8 max-w-[400px] w-full border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-6 relative overflow-hidden">
                    {/* Decorative Top Banner */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>

                    {/* Icon Container */}
                    <div className="w-24 h-24 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center shadow-inner mt-4 ring-8 ring-red-50 dark:ring-red-500/20">
                        <span className="material-symbols-outlined text-[48px] text-red-600" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col gap-2 w-full">
                        <h2 className="font-space-grotesk text-2xl font-bold text-red-600">Invalid Document</h2>
                        <p className="font-body text-[15px] text-slate-500 dark:text-slate-400 mt-2">
                            This agreement is not recognized by the university system. Please contact the internship office for verification.
                        </p>
                    </div>

                    {/* Action Area */}
                    <div className="flex flex-col gap-4 w-full mt-4">
                        <button className="w-full bg-indigo-600 text-white font-inter text-[18px] font-semibold py-3 px-6 rounded-full hover:shadow-[0_10px_15px_-3px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">support_agent</span>
                            Contact Support
                        </button>
                        <button className="w-full bg-transparent border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-inter text-[18px] font-semibold py-3 px-6 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                            Scan Again
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AgreementVerificationInvalid;
