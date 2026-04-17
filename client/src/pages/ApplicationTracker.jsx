import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';

const ApplicationTracker = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const token = document.cookie.split('jwt=')[1]?.split(';')[0] || localStorage.getItem('token');
                const res = await fetch('/api/student/applications', {
                    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setApplications(data.applications);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'applied':
                return { text: 'In Review', bg: 'bg-slate-100', textc: 'text-slate-600', ring: 'ring-slate-50', color: 'bg-slate-600', colorClass: 'slate' };
            case 'accepted':
                return { text: 'Accepted', bg: 'bg-indigo-100', textc: 'text-indigo-700', ring: 'ring-indigo-50', color: 'bg-indigo-600', colorClass: 'indigo' };
            case 'rejected':
                return { text: 'Refused', bg: 'bg-red-100', textc: 'text-red-700', ring: 'ring-red-50', color: 'bg-red-600', colorClass: 'red' };
            case 'validated':
                return { text: 'Validated', bg: 'bg-green-100', textc: 'text-green-700', ring: 'ring-green-50', color: 'bg-green-600', colorClass: 'green' };
            default:
                return { text: 'Unknown', bg: 'bg-slate-100', textc: 'text-slate-600', ring: 'ring-slate-50', color: 'bg-slate-600', colorClass: 'slate' };
        }
    };

    const handleDelete = async (appId) => {
        if (window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
            try {
                const token = document.cookie.split('jwt=')[1]?.split(';')[0] || localStorage.getItem('token');
                const res = await fetch(`/api/applications/${appId}`, {
                    method: 'DELETE',
                    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
                });
                if (res.ok) {
                    setApplications(applications.filter(app => app._id !== appId));
                } else {
                    const data = await res.json();
                    alert(data.error || "Failed to delete application");
                }
            } catch (err) {
                console.error("Delete error:", err);
            }
        }
    };

    return (
        <div className="bg-slate-50 text-slate-900 antialiased min-h-screen">
            <StudentNavbar />
            <div className="flex min-h-[calc(100vh-64px)]">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex-col p-4 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 font-sans text-sm font-semibold">
                    <div className="mb-8 px-4 py-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <span className="material-symbols-outlined" data-icon="school">school</span>
                            </div>
                            <div>
                                <p className="text-slate-900 dark:text-white font-bold">Admin Portal</p>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">University Management</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 space-y-1">
                        <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all scale-95 duration-200 ease-in-out" href="#">
                            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                            Dashboard
                        </a>
                        <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all scale-95 duration-200 ease-in-out" href="#">
                            <span className="material-symbols-outlined" data-icon="work">work</span>
                            Internships
                        </a>
                        <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all scale-95 duration-200 ease-in-out" href="#">
                            <span className="material-symbols-outlined" data-icon="mail">mail</span>
                            Messages
                        </a>
                        <a className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all scale-95 duration-200 ease-in-out" href="#">
                            <span className="material-symbols-outlined" data-icon="description">description</span>
                            Applications
                        </a>
                        <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all scale-95 duration-200 ease-in-out" href="#">
                            <span className="material-symbols-outlined" data-icon="settings">settings</span>
                            Settings
                        </a>
                    </nav>
                    <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 space-y-1">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg mb-4 font-bold transition-all shadow-md shadow-indigo-100">
                            Post New Offer
                        </button>
                        <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" href="#">
                            <span className="material-symbols-outlined" data-icon="help">help</span>
                            Help Center
                        </a>
                        <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" href="#">
                            <span className="material-symbols-outlined" data-icon="logout">logout</span>
                            Logout
                        </a>
                    </div>
                </aside>

                {/* Main Content Canvas */}
                <main className="flex-1 lg:ml-64 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 font-headline">My Applications</h1>
                                <p className="text-slate-500 font-medium">Tracking {applications.length} active internship opportunities for the 2024 Fall term.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" data-icon="search">search</span>
                                    <input className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all w-64" placeholder="Search companies..." type="text" />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                    <span className="material-symbols-outlined text-lg" data-icon="filter_list">filter_list</span>
                                    Filter
                                </button>
                            </div>
                        </div>

                        {/* Application Cards Container (Modern Table) */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <div className="col-span-3">Company &amp; Role</div>
                                <div className="col-span-2">Date Applied</div>
                                <div className="col-span-3">Status &amp; Progress</div>
                                <div className="col-span-2">Notes</div>
                                <div className="col-span-2 text-right">Actions</div>
                            </div>

                            {loading ? (
                                <div className="py-20 text-center text-slate-500 font-medium">Loading your applications...</div>
                            ) : applications.length === 0 ? (
                                <div className="py-20 text-center text-slate-500 font-medium flex flex-col items-center">
                                    <span className="material-symbols-outlined text-4xl mb-3 text-slate-300">description</span>
                                    No applications found. Time to apply!
                                </div>
                            ) : applications.map(app => {
                                const info = getStatusInfo(app.status);
                                const dateApplied = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                                const step2Color = ['accepted', 'rejected', 'validated'].includes(app.status) ? `bg-${info.colorClass}-600` : 'bg-slate-200';
                                const step3Color = ['validated'].includes(app.status) ? 'bg-green-600' : 'bg-slate-200';

                                return (
                                    <div key={app._id} className={`grid grid-cols-12 gap-4 px-6 py-6 border-b border-slate-50 items-center hover:bg-${info.colorClass}-50/30 transition-colors group`}>
                                        <div className="col-span-3 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center p-2 border border-slate-200 overflow-hidden">
                                                {app.offerId?.companyId?.logo ? (
                                                    <img alt={app.offerId?.companyId?.companyName} className="w-full h-full object-contain" src={`http://localhost:3000${app.offerId?.companyId?.logo}`} />
                                                ) : (
                                                    <span className="material-symbols-outlined text-slate-400">business</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                {app.offerId ? (
                                                    <>
                                                        <h3 className={`font-bold text-slate-900 group-hover:text-${info.colorClass}-600 transition-colors truncate`}>
                                                            {app.offerId?.companyId?.companyName || 'Unknown Company'}
                                                        </h3>
                                                        <p className="text-slate-500 text-sm truncate">{app.offerId?.title || 'Unknown Position'}</p>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-rose-600 font-bold text-sm flex items-center gap-1 leading-none">
                                                            <span className="material-symbols-outlined text-[16px]">cancel</span>
                                                            This offer was deleted
                                                        </span>
                                                        <p className="text-slate-400 text-[10px] italic mt-0.5">Application no longer active</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-sm font-medium text-slate-600">{dateApplied}</span>
                                        </div>
                                        <div className="col-span-3">
                                            <div className="mb-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${info.bg} ${info.textc}`}>
                                                    {info.text}
                                                </span>
                                            </div>
                                            {/* Progress Stepper */}
                                            <div className="flex items-center w-full max-w-[200px]">
                                                {/* Step 1: Applied */}
                                                <div className="relative flex items-center justify-center">
                                                    <div className={`w-3 h-3 rounded-full bg-${info.colorClass}-600 ring-4 ring-${info.colorClass}-50`}></div>
                                                </div>
                                                <div className={`flex-1 h-0.5 ${step2Color !== 'bg-slate-200' ? `bg-${info.colorClass}-600` : 'bg-slate-200'}`}></div>

                                                {/* Step 2: Accepted/Refused */}
                                                <div className="relative flex items-center justify-center">
                                                    <div className={`w-3 h-3 rounded-full ${step2Color} ${app.status === 'applied' ? `ring-4 ring-${info.colorClass}-50 border-2 border-${info.colorClass}-600 bg-white` : ''}`}></div>
                                                </div>
                                                <div className={`flex-1 h-0.5 ${step3Color !== 'bg-slate-200' ? 'bg-green-600' : 'bg-slate-200'}`}></div>

                                                {/* Step 3: Validated */}
                                                <div className="relative flex items-center justify-center">
                                                    <div className={`w-3 h-3 rounded-full ${step3Color} ${['accepted', 'rejected'].includes(app.status) ? `ring-4 ring-green-50 border-2 border-green-600 bg-white w-4 h-4` : ''}`}></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between w-full max-w-[200px] mt-1">
                                                <span className="text-[10px] font-bold text-slate-400">Applied</span>
                                                <span className={`text-[10px] font-bold ${['accepted', 'rejected'].includes(app.status) ? `text-${info.colorClass}-600` : 'text-slate-400'}`}>
                                                    {app.status === 'rejected' ? 'Refused' : 'Accepted'}
                                                </span>
                                                <span className={`text-[10px] font-bold ${app.status === 'validated' ? 'text-green-600' : 'text-slate-400'}`}>Validated</span>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-slate-500 italic line-clamp-2 pr-4">
                                                {!app.offerId ? "Offer no longer available." : app.status === 'rejected' ? 'Position filled or criteria not met.' : app.status === 'validated' ? 'Agreements ready for download.' : 'Decision pending review.'}
                                            </p>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <div className="flex justify-end items-center gap-3">
                                                {app.status === 'validated' && (
                                                    <span className="text-[10px] leading-tight font-bold text-green-600 text-right animate-pulse max-w-[100px]">
                                                        Your Internship Agreement is ready to download
                                                    </span>
                                                )}
                                                {app.offerId && (
                                                    <button 
                                                        className={`p-2 hover:text-${info.colorClass}-600 hover:bg-${info.colorClass}-50 rounded-lg transition-all border border-transparent hover:border-${info.colorClass}-100 shadow-sm ${app.status === 'validated' ? 'text-green-600 bg-green-50 border-green-200' : 'text-slate-400'}`} 
                                                        onClick={() => { if (app.status === 'validated') navigate(`/agreement/${app._id}`); }}
                                                        title={app.status === 'validated' ? 'Download Agreement' : 'View Details'}
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]" data-icon={app.status === 'validated' ? 'description' : 'visibility'}>
                                                            {app.status === 'validated' ? 'description' : 'visibility'}
                                                        </span>
                                                    </button>
                                                )}
                                                {app.status !== 'validated' && (
                                                    <button 
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 shadow-sm" 
                                                        title="Delete Application"
                                                        onClick={() => handleDelete(app._id)}
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Stats Bento Grid Section */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Total Applications Card */}
                            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 transform hover:scale-[1.02] transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                                        <span className="material-symbols-outlined" data-icon="rocket_launch">rocket_launch</span>
                                    </div>
                                    <span className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest bg-indigo-500/30 px-2 py-1 rounded">Pipeline Overview</span>
                                </div>
                                <p className="text-indigo-100 text-sm font-medium">Total Applications</p>
                                <h4 className="text-4xl font-extrabold mt-1 font-headline">{applications.length}</h4>
                                <div className="mt-4 w-full bg-indigo-500/30 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-white h-full" style={{ width: `${Math.min(100, (applications.length / 10) * 100)}%` }}></div>
                                </div>
                            </div>

                            {/* Interviews Card */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                        <span className="material-symbols-outlined" data-icon="groups">groups</span>
                                    </div>
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active Stages</span>
                                </div>
                                <p className="text-slate-500 text-sm font-medium">Pending Decisions</p>
                                <h4 className="text-4xl font-extrabold mt-1 text-slate-900 font-headline">
                                    {applications.filter(a => a.status === 'accepted' || a.status === 'applied').length}
                                </h4>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {applications.slice(0, 3).map((a, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                                {a.offerId?.companyId?.logo ? (
                                                    <img src={`http://localhost:3000${a.offerId.companyId.logo}`} className="w-full h-full object-cover" alt="Company" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] bg-indigo-100 text-indigo-600 font-bold">{i+1}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium ml-1">Across various domains</span>
                                </div>
                            </div>

                            {/* Successful Offers Card */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-green-200 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                        <span className="material-symbols-outlined" data-icon="verified">verified</span>
                                    </div>
                                    <span className="text-green-600/60 text-[10px] font-bold uppercase tracking-widest">Successful</span>
                                </div>
                                <p className="text-slate-500 text-sm font-medium">Validated Internships</p>
                                <h4 className="text-4xl font-extrabold mt-1 text-green-600 font-headline">
                                    {applications.filter(a => a.status === 'validated').length}
                                </h4>
                                <button 
                                    className="mt-4 text-indigo-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={applications.filter(a => a.status === 'validated').length === 0}
                                >
                                    Get Quick Agreements <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ApplicationTracker;
