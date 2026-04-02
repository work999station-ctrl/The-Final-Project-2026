import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';

const NotificationDetails = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userType, setUserType] = useState('');

    useEffect(() => {
        const fetchNotificationDetails = async () => {
            try {
                const response = await fetch(`/api/inbox/notification/${applicationId}`);
                const data = await response.json();

                if (data.success) {
                    setNotification(data.notification);
                    if (data.userType) setUserType(data.userType);
                } else {
                    setError(data.error || 'Failed to fetch details');
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError('A network error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (applicationId) {
            fetchNotificationDetails();
        }
    }, [applicationId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold animate-pulse">Loading Agreement Details...</p>
                </div>
            </div>
        );
    }

    if (error || !notification) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">Access Error</h2>
                    <p className="text-slate-500 mb-6 font-medium">{error || 'Notification not found'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-slate-800 transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const isStudent = userType === 'student';

    return (
        <div className="bg-slate-50 text-slate-900 antialiased min-h-screen font-body pb-20">
            {/* Top Navigation Bar */}
            <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none sticky top-0 z-50">
                <div className="flex justify-between items-center h-16 px-6 w-full max-w-full mx-auto font-sans antialiased text-sm font-medium">
                    <div className="flex items-center gap-8">
                        <span className="text-2xl font-black tracking-tight text-indigo-700 dark:text-indigo-300 font-headline uppercase cursor-pointer" onClick={() => navigate(isStudent ? '/studentDashboard' : '/opportunities')}>InternHub</span>
                        <nav className="hidden md:flex items-center gap-6 text-slate-500 font-semibold">
                            <a className="hover:text-indigo-600 transition-colors" href={isStudent ? "/studentDashboard" : "/opportunities"}>Dashboard</a>
                            <a className="hover:text-indigo-600 transition-colors" href="/opportunities">Offers</a>
                            <a className="text-indigo-600 border-b-2 border-indigo-600 pb-1" href={isStudent ? "/student-inbox" : "/company-inbox"}>Inbox</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 cursor-pointer text-indigo-600 flex items-center justify-center font-black">
                            {isStudent ? notification.studentName.charAt(0) : notification.companyName.charAt(0)}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Navigation Context */}
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm group">
                        <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                    </button>
                    <div className="text-sm font-bold text-slate-400 flex items-center gap-2">
                        <span className="cursor-pointer hover:text-slate-600" onClick={() => navigate(-1)}>Inbox</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-slate-600 underline underline-offset-4 decoration-indigo-200">Agreement Details</span>
                    </div>
                </div>

                {/* Main Notification Card */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden min-h-[600px]">
                    {/* Header Section */}
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${notification.status === 'validated' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                <span className="material-symbols-outlined text-sm mr-1">verified</span>
                                Status: {notification.status === 'validated' ? 'Validated by Admin' : 'In Progress'}
                            </span>
                            <span className="text-slate-200 px-1">|</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Received {moment(notification.receivedAt).format('MMM Do, YYYY')}
                            </span>
                        </div>
                    </div>

                    {/* Body Section */}
                    <div className="p-10 flex flex-col items-center">
                        <div className="prose prose-slate max-w-2xl text-slate-600 leading-[1.8] space-y-6 font-medium text-center">
                            {/* Title Positioned Above Validation Text */}
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight font-headline py-6 leading-tight">
                                {isStudent ? 'Your Internship Agreement is Ready' : 'Internship Agreement Ready'}
                            </h1>

                            <p >
                                {isStudent ? "Dear, " + notification.studentName.toUpperCase() : ''}
                            </p>

                            {isStudent ? (
                                <>
                                    <p>
                                        We are pleased to confirm that the internship agreement for the <span className="text-slate-900 font-black decoration-indigo-300 decoration-4 underline underline-offset-8">{notification.offerTitle}</span> position has been processed and officially validated by the University Administration.
                                    </p>
                                    <p>
                                        This document formalizes your placement and contains all necessary signatures. Please download and keep a copy for your records before your start date.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>
                                        The university has officially validated the internship agreement for the Candidate <span className="text-slate-900 font-black decoration-indigo-300 decoration-2 underline underline-offset-4">{notification.studentName}</span> for the <span className="text-slate-900 font-black decoration-indigo-300 decoration-2 underline underline-offset-4">{notification.offerTitle}</span> position.
                                        You can now download the finalized document for your records and proceed with the onboarding process.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Attachment Card */}
                        <div className="mt-6 w-full max-w-2xl">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">Generated Documentation</h3>
                            <div
                                onClick={() => navigate(`/agreement/${notification.id}`)}
                                className="bg-indigo-50/40 border-2 border-dashed border-indigo-200 rounded-3xl p-8 flex flex-col items-center gap-6 group hover:bg-indigo-50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                            >
                                <div className="w-16 h-20 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center gap-1 border border-indigo-50 relative overflow-hidden group-hover:scale-105 transition-transform">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                                    <span className="material-symbols-outlined text-3xl text-indigo-500">download</span>
                                    <span className="text-[8px] font-black text-slate-400 tracking-tighter uppercase">Download</span>
                                </div>
                                <div className="text-center">
                                    <h4 className="text-base font-black text-slate-900 leading-tight mb-1">
                                        Internship_Agreement_{notification.companyName.replace(/\s+/g, '_')}.pdf
                                    </h4>
                                    <div className="flex flex-wrap justify-center gap-3 text-[11px] font-bold text-slate-500">
                                        <span className="flex items-center gap-1.5 text-green-600 font-black uppercase tracking-tighter">
                                            <span className="material-symbols-outlined text-sm">verified</span>
                                            Digitally Signed
                                        </span>
                                        <span className="text-slate-300">|</span>
                                        <span>PDF Document Preview</span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/agreement/${notification.id}`);
                                    }}
                                    className="w-full sm:w-auto px-10 py-4 rounded-xl bg-indigo-600 text-white font-black text-sm hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group"
                                >
                                    Download
                                    <span className="material-symbols-outlined text-lg group-hover:translate-y-0.5 transition-transform">download</span>
                                </button>
                            </div>
                        </div>

                        {/* Summary Block */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-slate-50 rounded-3xl border border-slate-100 w-full max-w-2xl">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Internship Period</p>
                                <div className="flex items-center gap-3 justify-center">
                                    <span className="material-symbols-outlined text-indigo-600">calendar_month</span>
                                    <p className="text-sm font-bold text-slate-900">{notification.startDate} — {notification.endDate}</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Reference Number</p>
                                <div className="flex items-center gap-3 justify-center">
                                    <span className="material-symbols-outlined text-indigo-600">fingerprint</span>
                                    <p className="text-sm font-bold text-slate-900 uppercase">{notification.id.substring(0, 14)}...</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-12 flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={() => navigate(`/offer-details/${notification.offerId}`)}
                                className="px-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-black text-sm hover:bg-slate-50 transition-all uppercase tracking-wider"
                            >
                                View Original Offer
                            </button>
                            <button
                                className="px-10 py-3 rounded-xl bg-slate-900 text-white font-black text-sm hover:bg-indigo-600 transition-all shadow-lg tracking-wide uppercase"
                            >
                                Archive Notification
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationDetails;
