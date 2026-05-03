import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import StudentNavbar from '../components/StudentNavbar';
import CompanyNavbar from '../components/CompanyNavbar';
import Footer from '../components/Footer';

const NotificationDetails = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userType, setUserType] = useState('');
    const [showArchiveModal, setShowArchiveModal] = useState(false);

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
            {isStudent ? <StudentNavbar /> : <CompanyNavbar />}

            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Navigation Context */}
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm group">
                        <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                    </button>
                    <div className="text-sm font-bold text-slate-400 flex items-center gap-2">
                        <span className="cursor-pointer hover:text-slate-600" onClick={() => navigate(-1)}>Inbox</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-slate-600 underline underline-offset-4 decoration-indigo-200">{notification.status === 'admin_rejected' ? 'Rejection Notice' : 'Agreement Details'}</span>
                    </div>
                </div>

                {/* Main Notification Card */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden min-h-[600px]">
                    {/* Header Section */}
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                notification.status === 'admin_rejected'
                                    ? 'bg-red-100 text-red-700'
                                    : notification.status === 'validated'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-indigo-100 text-indigo-700'
                            }`}>
                                <span className="material-symbols-outlined text-sm mr-1">{notification.status === 'admin_rejected' ? 'block' : 'verified'}</span>
                                Status: {notification.status === 'admin_rejected' ? 'Rejected by Admin' : notification.status === 'validated' ? 'Validated by Admin' : 'In Progress'}
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
                            {/* Title Positioned Above Content */}
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight font-headline py-6 leading-tight">
                                {notification.status === 'admin_rejected'
                                    ? (isStudent ? 'Your Internship Application Was Rejected' : 'Internship Placement Rejected')
                                    : (isStudent ? 'Your Internship Agreement is Ready' : 'Internship Agreement Ready')
                                }
                            </h1>

                            <p >
                                {isStudent ? "Dear, " + notification.studentName.toUpperCase() : ''}
                            </p>

                            {notification.status === 'admin_rejected' ? (
                                /* Rejection content */
                                isStudent ? (
                                    <>
                                        <p>
                                            We regret to inform you that your internship application for the <span className="text-slate-900 font-black decoration-red-300 decoration-4 underline underline-offset-8">{notification.offerTitle}</span> position has been <span className="text-red-600 font-black">rejected</span> by the University Administration.
                                        </p>
                                        {notification.adminRejectionReason && (
                                            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-left">
                                                <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-3">Rejection Reason</p>
                                                <p className="text-sm text-red-800 font-medium leading-relaxed">{notification.adminRejectionReason}</p>
                                            </div>
                                        )}
                                        <p>
                                            If you believe this was in error or have questions, please contact the university administration office for clarification.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p>
                                            The university has rejected the internship placement for the Candidate <span className="text-slate-900 font-black decoration-red-300 decoration-2 underline underline-offset-4">{notification.studentName}</span> for the <span className="text-slate-900 font-black decoration-red-300 decoration-2 underline underline-offset-4">{notification.offerTitle}</span> position.
                                            The placement will not proceed. Please contact the university for further information.
                                        </p>
                                    </>
                                )
                            ) : (
                                /* Validated content (existing) */
                                isStudent ? (
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
                                )
                            )}
                        </div>

                        {/* Attachment Card — only show for validated */}
                        {notification.status !== 'admin_rejected' && (
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
                        )}

                        {/* Summary Block — only show for validated */}
                        {notification.status !== 'admin_rejected' && (
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
                        )}

                        {/* Footer Actions */}
                        <div className="mt-12 flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={() => navigate(`/offer-details/${notification.offerId}`)}
                                className="px-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-black text-sm hover:bg-slate-50 transition-all uppercase tracking-wider"
                            >
                                View Original Offer
                            </button>
                            <button
                                onClick={() => setShowArchiveModal(true)}
                                className="px-10 py-3 rounded-xl bg-slate-900 text-white font-black text-sm hover:bg-indigo-600 transition-all shadow-lg tracking-wide uppercase"
                            >
                                Archive Notification
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Archive Confirmation Modal */}
            {showArchiveModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-800 mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl">inventory_2</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 font-headline tracking-tight mb-2">Archive Notice?</h3>
                        <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">This notification will be securely moved to your archive. You can still access its details later if necessary.</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowArchiveModal(false)} 
                                className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm uppercase tracking-wider rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    setShowArchiveModal(false);
                                    navigate(isStudent ? '/student-inbox' : '/company-inbox');
                                }} 
                                className="flex-1 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-slate-900/20"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default NotificationDetails;
