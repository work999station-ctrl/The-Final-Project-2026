import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentCVUpload = () => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const fileInputRef = useRef(null);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileInput = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
        e.target.value = null;
    };

    const handleFileUpload = async (file) => {
        setIsUploading(true);
        const form = new FormData();
        form.append('cv', file);

        try {
            const token = document.cookie.split('jwt=')[1]?.split(';')[0] || localStorage.getItem('token');

            // Step 1: Parse the CV
            const response = await fetch('/api/student/parse-cv', {
                method: 'POST',
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: form
            });
            const result = await response.json();

            if (result.success && result.data) {
                const data = result.data;

                // Step 2: Save extracted data to the student profile
                const profileData = new FormData();
                if (data.bio) profileData.append('bio', data.bio);
                if (data.githubPortfolio) profileData.append('githubPortfolio', data.githubPortfolio);
                if (data.phoneNumber) profileData.append('phoneNumber', data.phoneNumber);
                if (data.baccalaureate) profileData.append('baccalaureate', data.baccalaureate);
                if (data.expectedGraduationDate) profileData.append('expectedGraduationDate', data.expectedGraduationDate);
                if (data.skills && data.skills.length > 0) profileData.append('skills', JSON.stringify(data.skills));
                if (data.academicProjects && data.academicProjects.length > 0) profileData.append('academicProjects', JSON.stringify(data.academicProjects));
                if (data.experience && data.experience.length > 0) profileData.append('experience', JSON.stringify(data.experience));

                await fetch('/api/student/profile', {
                    method: 'PUT',
                    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                    body: profileData
                });

                showToast('CV parsed & profile updated! Redirecting...', 'success');
                setTimeout(() => navigate('/student-dashboard'), 2000);
            } else {
                showToast(result.error || 'Failed to parse CV. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error uploading CV:', error);
            showToast('An error occurred while uploading your CV.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100 antialiased">
            {/* TopAppBar */}
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 w-full flex items-center px-6 sticky top-0 z-10">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 cursor-pointer" onClick={() => navigate('/')}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
                    <span className="font-bold text-xl tracking-tight">InternHub</span>
                </div>
            </header>

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
                    <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300'}`}>
                        <span className="material-symbols-outlined text-2xl">
                            {toast.type === 'success' ? 'check_circle' : 'error'}
                        </span>
                        <div>
                            <p className="font-bold">{toast.type === 'success' ? 'Success!' : 'Error'}</p>
                            <p className="text-sm opacity-90">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast({ show: false, message: '', type: 'success' })} className="ml-4 opacity-70 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-6 md:p-12">
                <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 md:p-12 shadow-sm relative overflow-hidden transition-all duration-300">

                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 mb-6">
                            <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                        </div>
                        <h1 className="font-extrabold text-3xl text-slate-900 dark:text-white mb-4 tracking-tight">Boost your profile with your CV</h1>
                        <p className="text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                            We'll use your resume to automatically complete your profile. This means you get matched with relevant jobs and can generate tailored resumes, cover letters, and mock interviews.
                        </p>
                    </div>

                    {/* Upload Zone */}
                    <div
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer mb-8 relative group ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <input
                            ref={fileInputRef}
                            onChange={handleFileInput}
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            type="file"
                        />
                        <span className="material-symbols-outlined text-slate-400 text-5xl mb-4 group-hover:text-indigo-500 transition-colors" style={{ fontVariationSettings: "'FILL' 0" }}>cloud_upload</span>

                        <div className="text-center">
                            <p className="font-semibold text-lg text-slate-900 dark:text-white mb-2">Drag and drop your CV here</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">or click to browse from your computer</p>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <span className="text-xs px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 font-mono">PDF</span>
                            <span className="text-xs px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 font-mono">DOCX</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-full font-bold text-base hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            type="button"
                        >
                            {isUploading ? (
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                                    Analyzing...
                                </span>
                            ) : 'Upload Resume'}
                        </button>
                        <button
                            onClick={() => navigate('/student-dashboard')}
                            disabled={isUploading}
                            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 decoration-slate-300 dark:decoration-slate-600 hover:decoration-slate-500 transition-colors disabled:opacity-50"
                            type="button"
                        >
                            Skip for now
                        </button>
                    </div>

                    {/* Progress overlay */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-xl">
                            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                            <p className="font-bold text-lg text-slate-900 dark:text-white">Analyzing your CV...</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This may take a few seconds</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudentCVUpload;
