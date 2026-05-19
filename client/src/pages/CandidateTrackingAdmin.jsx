import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';

const AdminValidation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [adminUser, setAdminUser] = useState(null);
    const [validatingApp, setValidatingApp] = useState(null);
    const [rejectingApp, setRejectingApp] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [generatingDocs, setGeneratingDocs] = useState({});
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await fetch('/api/admin/me');
                if (res.ok) {
                    const data = await res.json();
                    setAdminUser(data.user);
                }
            } catch (err) {
                console.error("Error fetching admin data:", err);
            }
        };
        fetchAdmin();
    }, []);

    // Filter & Pagination State
    const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get('search') || '');
    
    useEffect(() => {
        const query = new URLSearchParams(location.search).get('search');
        if (query !== null) {
            setSearchQuery(query);
        }
    }, [location.search]);
    const [activeFilters, setActiveFilters] = useState({
        deadline: '',
        company: location.state?.companyFilter || ''
    });
    const [openFilter, setOpenFilter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const filterRef = React.useRef(null);
    const PAGE_SIZE = 6;

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const appRes = await fetch('/api/admin/applications/pending-validation');
                if (appRes.ok) {
                    const appData = await appRes.json();
                    setApplications(appData.applications || []);
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    React.useEffect(() => { setCurrentPage(1); }, [searchQuery, activeFilters]);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setOpenFilter(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleConfirmValidation = async () => {
        if (!validatingApp) return;

        // Optimistically update status
        setApplications(prev => prev.map(a => a._id === validatingApp._id ? { ...a, status: 'validated' } : a));
        setGeneratingDocs(prev => ({ ...prev, [validatingApp._id]: true }));

        // Send API request to actually update it
        try {
            const token = document.cookie.split('jwt=')[1]?.split(';')[0] || localStorage.getItem('token');
            await fetch(`/api/admin/applications/${validatingApp._id}/validate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            });
        } catch (err) {
            console.error('Failed to validate application', err);
        }

        // Fake the document generation delay before showing the View Agreement button
        setTimeout(() => {
            setGeneratingDocs(prev => ({ ...prev, [validatingApp._id]: false }));
        }, 3000);

        setValidatingApp(null);
    };

    const handleConfirmRejection = async () => {
        if (!rejectingApp || !rejectionReason.trim()) return;

        try {
            const token = document.cookie.split('jwt=')[1]?.split(';')[0] || localStorage.getItem('token');
            const res = await fetch(`/api/admin/applications/${rejectingApp._id}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ reason: rejectionReason.trim() })
            });
            if (res.ok) {
                setApplications(prev => prev.map(a => a._id === rejectingApp._id ? { ...a, status: 'admin_rejected' } : a));
            }
        } catch (err) {
            console.error('Failed to reject application', err);
        }

        setRejectingApp(null);
        setRejectionReason('');
    };

    const filteredApplications = applications
        .filter(app => {
            if (activeFilters.deadline && app.status === 'validated') return false;

            const studentName = (app.studentId?.name || '').toLowerCase();
            const companyName = (app.offerId?.companyId?.companyName || '').toLowerCase();
            const offerTitle = (app.offerId?.title || '').toLowerCase();
            const query = searchQuery.toLowerCase();

            const matchesSearch = studentName.includes(query) || companyName.includes(query) || offerTitle.includes(query);
            const matchesCompany = !activeFilters.company || app.offerId?.companyId?.companyName === activeFilters.company;

            return matchesSearch && matchesCompany;
        })
        .sort((a, b) => {
            // Deadline calculation
            const getDeadline = (app) => new Date((app.statusChangedAt ? new Date(app.statusChangedAt) : new Date(app.createdAt)).getTime() + 10 * 24 * 60 * 60 * 1000);

            if (activeFilters.deadline === 'closest') return getDeadline(a) - getDeadline(b);
            if (activeFilters.deadline === 'furthest') return getDeadline(b) - getDeadline(a);
            return new Date(b.createdAt) - new Date(a.createdAt); // Default: newest application first
        });

    const companyNames = [...new Set(applications.map(app => app.offerId?.companyId?.companyName).filter(Boolean))];
    const totalApplicants = filteredApplications.length;
    const totalPages = Math.ceil(totalApplicants / PAGE_SIZE) || 1;
    const paginatedApplications = filteredApplications.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const applyFilter = (key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
        setOpenFilter(null);
    };

    return (
        <div className="bg-background text-on-surface min-h-screen">
            {/* SideNavBar Shell */}
            <AdminSidebar activePage="validate" adminUser={adminUser} />

            <AdminNavbar admin={adminUser} />

            {/* Main Content Canvas */}
            <main className="ml-64 pt-24 p-8 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section with Asymmetry */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="space-y-2">
                            <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary/10 px-3 py-1 rounded-full">Action Required</span>
                            <h2 className="text-5xl font-headline font-bold text-on-surface tracking-tight leading-tight">
                                Admin Validation <br /><span className="text-primary">Portal</span>
                            </h2>
                            <p className="text-on-surface-variant max-w-md mt-4">Review and officially authorize internship placements that have reached the final acceptance stage from industry partners.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-surface-container-low p-6 rounded-xl flex flex-col items-center justify-center min-w-[140px]">
                                <span className="text-3xl font-headline font-bold text-primary">{totalApplicants}</span>
                                <span className="text-xs text-on-surface-variant font-medium mt-1">Found Nominations</span>
                            </div>
                            <div className="bg-surface-container-high p-6 rounded-xl flex flex-col items-center justify-center min-w-[140px]">
                                <span className="text-3xl font-headline font-bold text-tertiary">152</span>
                                <span className="text-xs text-on-surface-variant font-medium mt-1">Validated Total</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Grid Layout for Content */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Main Table Area */}
                        <div className="col-span-12 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
                                <h3 className="text-xl font-headline font-semibold text-on-surface">Recent Student Acceptances</h3>
                                <div className="flex flex-wrap items-center gap-3" ref={filterRef}>

                                    {/* In-Table Search Bar */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">search</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="block w-full min-w-[200px] sm:min-w-[250px] pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-outline-variant/30 hover:border-outline-variant/60 focus:border-primary rounded-full text-sm font-medium text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                                            placeholder="Search table..."
                                        />
                                    </div>

                                    {/* Company Filter Pill */}
                                    <div className="relative">
                                        {activeFilters.company ? (
                                            <span className="flex items-center gap-1.5 pl-3 pr-2 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/30 shadow-sm whitespace-nowrap cursor-default">
                                                <span className="material-symbols-outlined text-[16px]">business</span>
                                                {activeFilters.company}
                                                <button onClick={() => applyFilter('company', '')} className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5 transition-colors">
                                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                                </button>
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => setOpenFilter(openFilter === 'company' ? null : 'company')}
                                                className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-on-surface border shadow-sm hover:shadow-md transition-all whitespace-nowrap ${openFilter === 'company' ? 'border-primary ring-2 ring-primary/20 bg-slate-50 dark:bg-slate-900' : 'border-outline-variant/30 hover:border-primary/30'}`}
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">business</span>
                                                Company
                                                <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform ${openFilter === 'company' ? 'rotate-180' : ''}`}>expand_more</span>
                                            </button>
                                        )}
                                        {openFilter === 'company' && (
                                            <div className="absolute top-full right-0 sm:left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-outline-variant/30 rounded-xl shadow-2xl z-50 overflow-hidden">
                                                <div className="px-4 py-3 border-b border-outline-variant/10 bg-slate-50 dark:bg-slate-900/50">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Select Company</span>
                                                </div>
                                                <div className="max-h-72 overflow-y-auto">
                                                    {companyNames.map((name, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => applyFilter('company', name)}
                                                            className="w-full text-left px-4 py-3 text-sm text-on-surface hover:bg-surface-container-low transition-colors border-b border-outline-variant/5 last:border-0 hover:text-primary font-medium"
                                                        >
                                                            {name}
                                                        </button>
                                                    ))}
                                                    {companyNames.length === 0 && (
                                                        <div className="px-4 py-6 text-center text-sm text-on-surface-variant">No companies found</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Deadline Sort Pill */}
                                    <div className="relative">
                                        {activeFilters.deadline ? (
                                            <span className="flex items-center gap-1.5 pl-3 pr-2 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold border border-amber-200 shadow-sm whitespace-nowrap cursor-default">
                                                <span className="material-symbols-outlined text-[16px]">calendar_clock</span>
                                                {activeFilters.deadline === 'closest' ? 'Closest Deadline' : 'Furthest Deadline'}
                                                <button onClick={() => applyFilter('deadline', '')} className="ml-0.5 rounded-full hover:bg-amber-100 p-0.5 transition-colors">
                                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                                </button>
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => setOpenFilter(openFilter === 'deadline' ? null : 'deadline')}
                                                className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-on-surface border shadow-sm hover:shadow-md transition-all whitespace-nowrap ${openFilter === 'deadline' ? 'border-primary ring-2 ring-primary/20 bg-slate-50 dark:bg-slate-900' : 'border-outline-variant/30 hover:border-primary/30'}`}
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_clock</span>
                                                Deadline
                                                <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform ${openFilter === 'deadline' ? 'rotate-180' : ''}`}>expand_more</span>
                                            </button>
                                        )}
                                        {openFilter === 'deadline' && (
                                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-outline-variant/30 rounded-xl shadow-2xl z-50 overflow-hidden">
                                                <div className="px-4 py-3 border-b border-outline-variant/10 bg-slate-50 dark:bg-slate-900/50">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Sort By</span>
                                                </div>
                                                <div className="py-1">
                                                    <button onClick={() => applyFilter('deadline', 'closest')} className="w-full text-left px-4 py-3 text-sm text-on-surface hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-2 font-medium">
                                                        <span className="material-symbols-outlined text-[18px] text-amber-500">warning</span> Closest Deadline
                                                    </button>
                                                    <button onClick={() => applyFilter('deadline', 'furthest')} className="w-full text-left px-4 py-3 text-sm text-on-surface hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-2 font-medium border-t border-outline-variant/5">
                                                        <span className="material-symbols-outlined text-[18px] text-emerald-500">more_time</span> Furthest Deadline
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {(activeFilters.company || activeFilters.deadline || searchQuery) && (
                                        <button
                                            onClick={() => { setActiveFilters({ deadline: '', company: '' }); setSearchQuery(''); setCurrentPage(1); }}
                                            className="ml-2 text-xs font-bold text-on-surface-variant hover:text-error transition-colors underline decoration-dotted underline-offset-4"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                                            <th className="pb-4 px-4 font-semibold">Student Name</th>
                                            <th className="pb-4 px-4 font-semibold">Company</th>
                                            <th className="pb-4 px-4 font-semibold">Internship Title</th>
                                            <th className="pb-4 px-4 font-semibold">Duration</th>
                                            <th className="pb-4 px-4 font-semibold">Accepted On</th>
                                            <th className="pb-4 px-4 font-semibold">Validation Deadline</th>
                                            <th className="pb-4 px-4 text-right font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="py-8 text-center text-slate-500">
                                                    <div className="animate-pulse flex flex-col items-center">
                                                        <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                                                        <div className="h-3 w-24 bg-slate-100 rounded"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : paginatedApplications.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="py-12 text-center text-slate-500 bg-slate-50/30">
                                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">sentiment_dissatisfied</span>
                                                    No pending validations match your search filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedApplications.map((app) => {
                                                const deadline = new Date((app.statusChangedAt ? new Date(app.statusChangedAt) : new Date(app.createdAt)).getTime() + 10 * 24 * 60 * 60 * 1000);
                                                const isOverdue = new Date() > deadline;
                                                return (
                                                    <tr key={app._id} className="group hover:bg-surface-container-low/50 transition-colors">
                                                        <td className="py-5 px-4">
                                                            <div
                                                                className="flex items-center gap-3 cursor-pointer w-max group"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (app.studentId?._id) navigate(`/student-profile-recruiter/${app.studentId._id}`);
                                                                }}
                                                            >
                                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden shadow-sm border-2 border-slate-200">
                                                                    {app.studentId?.profilePicture ? (
                                                                        <img src={app.studentId.profilePicture} alt={app.studentId.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        app.studentId?.name?.substring(0, 2).toUpperCase() || 'ST'
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-on-surface hover:text-indigo-600 transition-colors font-['Inter']">{app.studentId?.name || 'Unknown Student'}</p>
                                                                    <p className="text-xs text-on-surface-variant">{app.studentId?.fieldOfStudy || 'Student'}, {app.studentId?.currentYear || 'Year'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <div
                                                                className="flex items-center gap-2 cursor-pointer w-max group"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (app.offerId?.companyId?._id) navigate(`/company-profile-admin/${app.offerId.companyId._id}`);
                                                                }}
                                                            >
                                                                <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
                                                                    {app.offerId?.companyId?.logo ? (
                                                                        <img src={app.offerId.companyId.logo} alt={app.offerId.companyId.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span className="text-[10px] text-slate-500 font-black">{app.offerId?.companyId?.name?.substring(0, 1) || 'C'}</span>
                                                                    )}
                                                                </div>
                                                                <span className="text-on-surface font-medium hover:text-indigo-600 transition-colors">{app.offerId?.companyId?.companyName || 'Company'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <span
                                                                onClick={() => app.offerId?._id && navigate(`/offer-details/${app.offerId._id}`)}
                                                                className="text-on-surface-variant font-medium text-sm line-clamp-1 cursor-pointer hover:text-indigo-600 transition-colors"
                                                            >
                                                                {app.offerId?.title || 'Internship Title'}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <span className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded shadow-sm">
                                                                {app.offerId?.durationMonths + ' months' || 'Duration'}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <span className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded shadow-sm">
                                                                {new Date(app.statusChangedAt || app.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded shadow-sm">
                                                                {new Date((app.statusChangedAt ? new Date(app.statusChangedAt) : new Date(app.createdAt)).getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4 text-right">
                                                            <div className="flex justify-end items-center gap-3">
                                                                {app.status !== 'validated' && app.status !== 'admin_rejected' && !isOverdue && (
                                                                    <>
                                                                        <button
                                                                            className="bg-primary text-white font-bold text-xs px-5 py-2 rounded-full hover:shadow-md hover:shadow-primary/20 active:scale-95 transition-all"
                                                                            onClick={() => setValidatingApp(app)}
                                                                        >
                                                                            Validate
                                                                        </button>
                                                                        <button
                                                                            className="bg-red-600 text-white font-bold text-xs px-5 py-2 rounded-full hover:shadow-md hover:shadow-red-600/20 active:scale-95 transition-all"
                                                                            onClick={() => setRejectingApp(app)}
                                                                        >
                                                                            Refuse
                                                                        </button>
                                                                    </>
                                                                )}
                                                                {app.status !== 'validated' && app.status !== 'admin_rejected' && isOverdue && (
                                                                    <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-200 flex items-center gap-1 shadow-sm opacity-80 cursor-not-allowed">
                                                                        <span className="material-symbols-outlined text-[14px]">warning</span>
                                                                        Deadline Passed
                                                                    </span>
                                                                )}

                                                                {app.status === 'admin_rejected' && (
                                                                    <span className="text-xs font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-full border border-red-200 flex items-center gap-1 shadow-sm">
                                                                        <span className="material-symbols-outlined text-[14px]">block</span>
                                                                        Refused
                                                                    </span>
                                                                )}

                                                                {generatingDocs[app._id] && (
                                                                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5 bg-indigo-50 px-3 py-1.5 rounded-full">
                                                                        Generating document
                                                                        <span className="flex">
                                                                            <span className="animate-bounce inline-block" style={{ animationDelay: '0s' }}>.</span>
                                                                            <span className="animate-bounce inline-block" style={{ animationDelay: '0.2s' }}>.</span>
                                                                            <span className="animate-bounce inline-block" style={{ animationDelay: '0.4s' }}>.</span>
                                                                        </span>
                                                                    </span>
                                                                )}

                                                                {app.status === 'validated' && !generatingDocs[app._id] && (
                                                                    <>
                                                                        <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 flex items-center gap-1 shadow-sm">
                                                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                                            Validated
                                                                        </span>
                                                                        <button
                                                                            className="p-2 flex items-center justify-center text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors active:scale-95 shadow-sm border border-indigo-200"
                                                                            title="View Agreement"
                                                                            onClick={() => navigate(`/agreement/${app._id}`)}
                                                                        >
                                                                            <span className="material-symbols-outlined text-[16px]">description</span>
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Dynamic Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-between items-center text-sm text-on-surface-variant border-t border-slate-100 pt-6">
                                    <p>Showing <span className="font-bold text-on-surface">{(currentPage - 1) * PAGE_SIZE + 1}</span> to <span className="font-bold text-on-surface">{Math.min(currentPage * PAGE_SIZE, totalApplicants)}</span> of <span className="font-bold text-on-surface">{totalApplicants}</span> tracking results</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 text-on-surface'}`}
                                        >
                                            <span className="material-symbols-outlined text-base">chevron_left</span>
                                        </button>

                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${currentPage === i + 1 ? 'bg-primary text-white font-bold' : 'hover:bg-slate-100 text-on-surface font-medium'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 text-on-surface'}`}
                                        >
                                            <span className="material-symbols-outlined text-base">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Secondary Info Panel / Stats Bento Piece */}
                        <div className="col-span-12 md:col-span-4 bg-primary text-white rounded-xl p-8 relative overflow-hidden h-64">
                            <div className="relative z-10">
                                <h4 className="font-headline text-2xl font-bold mb-2">Policy Reminder</h4>
                                <p className="text-on-primary-container text-sm leading-relaxed mb-6">Validation must be completed within 10 days after the date of company acceptance to ensure legal compliance for internships.</p>
                                <a className="text-white font-bold flex items-center gap-2 group" href="#">
                                    Read Policy Handbook
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </a>
                            </div>
                            <div className="absolute -right-8 -bottom-8 opacity-20 transform rotate-12">
                                <span className="material-symbols-outlined text-[160px]">verified_user</span>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-8 bg-surface-container rounded-xl p-8 flex items-center gap-8 h-64 border border-outline-variant/10">
                            <img alt="Students in internship" className="w-48 h-full object-cover rounded-lg hidden lg:block" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxVOc2GL_vw8TjnFKLWzQIuGN0J6FX9YVL6Lsdij1N3KI-Hc8fqEaKZqzHA7cIhkJWBbF8AUnrhsHgwYjcy235NJnDlmCcN-2IuyOKecVKMLuxZdvRIaU3HaYGYt98bqmY6CqUrwffkfb2B0iiKDoTjdPBKEOzMTrvRKLVpY28rzACGpIlBwm8A_6XneDK3pvHSmkfNQ2ck60cRuDkEoeLYOfcfMbNOCn44K2bjxfkyYcS08zaxzwLCRgiSeKdMJSens_SnONax0E" />
                            <div className="flex-1">
                                <h4 className="font-headline text-xl font-bold text-on-surface mb-2">Automated Document Pipeline</h4>
                                <p className="text-on-surface-variant text-sm mb-6">Once validated, the system automatically generates the Internship Agreement, Insurance Certificates, and Health &amp; Safety waivers for digital signature.</p>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">task_alt</span>
                                        <span className="text-xs font-bold text-on-surface">Digital Signing</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">task_alt</span>
                                        <span className="text-xs font-bold text-on-surface">Legal Review</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Validation Modal Dialog */}
            {validatingApp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setValidatingApp(null)}></div>
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all p-8 border border-outline-variant/20">
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-amber-600 text-3xl">gavel</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-headline font-bold text-slate-900 mb-4 leading-tight">Administrative Validation</h3>
                                <p className="text-slate-600 leading-relaxed mb-8">
                                    Are you sure you want to officially validate <strong className="text-slate-900">{validatingApp.studentId?.name || 'this student'}</strong>'s internship? This will trigger document generation and notify both the student and the company representative.
                                </p>
                                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg mb-8">
                                    <span className="material-symbols-outlined text-slate-400">info</span>
                                    <p className="text-xs font-medium text-slate-600 italic">This action cannot be undone from the public portal.</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                    <button
                                        className="px-6 py-3 rounded-full font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                        onClick={() => setValidatingApp(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all"
                                        onClick={handleConfirmValidation}
                                    >
                                        Confirm Validation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal Dialog */}
            {rejectingApp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => { setRejectingApp(null); setRejectionReason(''); }}></div>
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all p-8 border border-outline-variant/20">
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-red-600 text-3xl">block</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-headline font-bold text-slate-900 mb-4 leading-tight">Refuse Internship</h3>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    You are about to refuse <strong className="text-slate-900">{rejectingApp.studentId?.name || 'this student'}</strong>'s internship placement. Please provide a reason that will be sent to the student.
                                </p>
                                <textarea
                                    className="w-full border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500/20 focus:border-red-400 outline-none resize-none transition-all"
                                    rows="4"
                                    placeholder="Explain the reason for rejection (required)..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                ></textarea>
                                <div className="flex items-center gap-3 bg-red-50 p-4 rounded-lg my-4">
                                    <span className="material-symbols-outlined text-red-400">info</span>
                                    <p className="text-xs font-medium text-red-600 italic">The student will receive this message. The company will only be notified of the rejection without the cause.</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                    <button
                                        className="px-6 py-3 rounded-full font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                        onClick={() => { setRejectingApp(null); setRejectionReason(''); }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-8 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg shadow-red-600/30 hover:shadow-red-600/40 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        onClick={handleConfirmRejection}
                                        disabled={!rejectionReason.trim()}
                                    >
                                        Confirm Rejection
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminValidation;
