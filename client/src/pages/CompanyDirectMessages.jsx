import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from '../components/CompanyNavbar';
import CompanySidebar from '../components/CompanySidebar';

const CompanyDirectMessages = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 8;

    const fetchData = async () => {
        try {
            const [companyRes, appRes] = await Promise.all([
                fetch('/api/company/me'),
                fetch('/api/company/applications')
            ]);

            if (companyRes.ok) {
                const companyData = await companyRes.json();
                setCompany(companyData.user);
            }
            if (appRes.ok) {
                const appData = await appRes.json();
                setApplications(appData.applications || []);
            }
        } catch (err) {
            console.error("Error fetching direct message data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.addEventListener('focus', fetchData);
        return () => window.removeEventListener('focus', fetchData);
    }, []);

    const filteredCandidates = applications
        .filter(app => app.studentId && app.offerId) // Ensure only real candidates with existing data are shown
        .filter(app => 
            app.studentId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.offerId?.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Pagination logic
    const totalCandidates = filteredCandidates.length;
    const totalPages = Math.ceil(totalCandidates / PAGE_SIZE);
    const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 font-body antialiased text-slate-900 dark:text-slate-100 min-h-screen">
            <CompanyNavbar company={company} />
            <CompanySidebar company={company} activePage="messages" />

            <main className="md:ml-64 pt-20 p-6 min-h-screen">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Direct Messages</h1>
                            <p className="text-slate-500 text-sm font-medium mt-1">
                                Showing <span className="text-primary font-bold">{totalCandidates}</span> candidates available for direct feedback.
                            </p>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="relative group w-full md:w-80">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                className="block w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 dark:text-white border-0 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-primary shadow-sm group-hover:shadow-md transition-all duration-300 text-sm font-medium outline-none"
                                placeholder="Search candidates..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Candidate List */}
                    <div className="grid grid-cols-1 gap-4 mb-8">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
                                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))
                        ) : paginatedCandidates.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">forum</span>
                                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No candidates found</h3>
                                <p className="text-slate-500 text-sm">Try adjusting your search criteria.</p>
                            </div>
                        ) : (
                            paginatedCandidates.map((app) => (
                                <div 
                                    key={app._id}
                                    onClick={() => navigate(`/application-details/${app._id}?tab=Feedback`)}
                                    className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-5 min-w-0">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                                                {app.studentId?.profilePicture ? (
                                                    <img alt={app.studentId.name} className="w-full h-full object-cover" src={app.studentId.profilePicture} />
                                                ) : (
                                                    <span className="material-symbols-outlined text-slate-400 text-4xl">person</span>
                                                )}
                                            </div>
                                            {app.feedback?.length > 0 && (
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-white dark:border-slate-900 rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight truncate group-hover:text-primary transition-colors">
                                                {app.studentId?.name || 'Unknown Student'}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{app.offerId?.title || 'Job Offer'}</span>
                                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                                <span className="text-xs text-slate-400">{app.studentId?.university || 'University'}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-1 italic font-medium">
                                                {app.feedback?.length > 0 
                                                    ? `Last message: ${app.feedback[app.feedback.length - 1].text}` 
                                                    : 'No messages yet. Start the conversation!'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                            {app.feedback?.length > 0 
                                                ? new Date(app.feedback[app.feedback.length - 1].createdAt).toLocaleDateString()
                                                : 'New Applicant'}
                                        </span>
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined">chevron_right</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <span className="text-xs font-medium text-slate-500">
                                Page <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> of <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                <div className="flex gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CompanyDirectMessages;
