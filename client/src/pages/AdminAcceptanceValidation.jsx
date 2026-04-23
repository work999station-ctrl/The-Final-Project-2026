import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const AdminAcceptanceValidation = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validating, setValidating] = useState(false);

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const res = await fetch(`/api/admin/application/${applicationId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setApplication(data.application);
                    } else {
                        setError("Failed to load application details.");
                    }
                } else {
                    setError("Error fetching application details.");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Server error while fetching details.");
            } finally {
                setLoading(false);
            }
        };

        if (applicationId) {
            fetchApplicationDetails();
        }
    }, [applicationId]);

    const handleApprove = async () => {
        setValidating(true);
        try {
            const res = await fetch(`/api/admin/applications/${applicationId}/validate`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    alert("Application validated successfully! Agreement generated.");
                    navigate('/admin-inbox');
                } else {
                    alert(data.error || "Failed to validate.");
                }
            }
        } catch (err) {
            console.error("Validation error:", err);
            alert("Error connecting to server.");
        } finally {
            setValidating(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex items-center justify-center font-sans">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center font-sans p-6">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center max-w-md">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <h2 className="text-xl font-bold mb-2">{error || "Application Not Found"}</h2>
                    <p className="text-slate-500 mb-6">The application you are looking for might have been deleted or moved.</p>
                    <button onClick={() => navigate('/admin-inbox')} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Back to Inbox</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 text-slate-900 antialiased min-h-screen font-body">
            {/* Top Navigation Bar */}
            <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none sticky top-0 z-50">
                <div className="flex justify-between items-center h-16 px-6 w-full max-w-full mx-auto font-sans antialiased text-sm font-medium">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center cursor-pointer" onClick={() => navigate('/admin-dashboard')}>
                            <img src={logoImage} alt="stage.io logo" className="h-16 w-auto object-contain dark:invert dark:hue-rotate-180 mix-blend-multiply dark:mix-blend-screen" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex min-h-[calc(100vh-64px)]">
                {/* Main Content Area */}
                <main className="flex-1 p-8 bg-slate-50/50">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Link */}
                        <button onClick={() => navigate('/admin-inbox')} className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold text-sm mb-8 transition-colors group">
                            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">chevron_left</span>
                            Back to Inbox
                        </button>

                        {/* Notification Header Card */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                            <div className="p-8 border-b border-slate-100">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                                            <span className="material-symbols-outlined text-3xl">verified_user</span>
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-headline">Internship Acceptance</h1>
                                            <p className="text-slate-500 font-medium flex items-center gap-2">
                                                {application.companyName} <span className="w-1 h-1 rounded-full bg-slate-300"></span> Official Notification
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-amber-100 text-amber-700 animate-pulse">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                                        Action Required
                                    </span>
                                </div>

                                <div className="space-y-4 text-slate-600 leading-relaxed max-w-2xl">
                                    <p className="font-bold text-slate-900">Dear Administrator,</p>
                                    <p>
                                        We are pleased to inform you that Student <span className="text-indigo-600 font-bold underline decoration-indigo-200 underline-offset-4 cursor-pointer hover:bg-indigo-50 transition-colors uppercase">{application.studentName}</span> has successfully passed technical interviews and has been selected for the <span className="font-semibold text-slate-900 text-lg">{application.offerTitle}</span> position at <span className="font-semibold text-slate-900 text-lg">{application.companyName}</span>.
                                    </p>
                                    <p>
                                        To finalize the enrollment and generate the tripartite internship agreement, we require your official approval through the university portal. Please review the internship details below.
                                    </p>
                                </div>
                            </div>

                            {/* Candidate Summary Grid */}
                            <div className="p-8 bg-slate-50/50">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Dossier Summary</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Candidate Card */}
                                    <div
                                        onClick={() => {
                                            if (application.studentId) {
                                                navigate(`/student-profile-recruiter/${application.studentId}`);
                                            }
                                        }}
                                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-indigo-300 transition-all cursor-pointer group"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl border-2 border-indigo-100 p-0.5 group-hover:scale-105 transition-transform overflow-hidden">
                                            {application.studentProfilePicture ? (
                                                <img
                                                    alt={application.studentName}
                                                    className="w-full h-full object-cover rounded-full"
                                                    src={application.studentProfilePicture}
                                                />
                                            ) : (
                                                application.studentName.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 font-headline uppercase">{application.studentName}</h4>
                                            <p className="text-indigo-600 text-xs font-bold font-mono tracking-tighter">{application.studentYear}</p>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider block mt-1">{application.universityName}</p>
                                        </div>
                                    </div>

                                    {/* Timeline Card */}
                                    <div
                                        onClick={() => {
                                            if (application.offerId) {
                                                navigate(`/offer-details/${application.offerId}`);
                                            }
                                        }}
                                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-indigo-300 transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
                                            <span className="material-symbols-outlined text-2xl">event_note</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 font-headline uppercase">Internship Schedule</h4>
                                            <p className="text-slate-500 text-sm font-semibold">{application.startDate} - {application.endDate}</p>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mt-1">Status: Official Selection</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Reference & Tracker Link */}
                                <div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-8">
                                    <button 
                                        onClick={() => navigate('/candidate-tracking-admin')}
                                        className="inline-flex items-center gap-4 px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-100 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform relative z-10">monitoring</span>
                                        <div className="text-left relative z-10">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 opacity-80">View Pipeline & Validate Internship</p>
                                            <p className="text-base font-bold font-mono uppercase">APP-{applicationId.substring(0, 8).toUpperCase()}</p>
                                        </div>
                                        <span className="material-symbols-outlined text-2xl ml-4 group-hover:translate-x-1.5 transition-transform relative z-10">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Validaton Actions */}
                        {/* <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-t-4 border-t-indigo-600">
                            <div>
                                <h4 className="font-black text-slate-900 font-headline uppercase">Administrative Validation</h4>
                                <p className="text-slate-500 text-xs font-semibold">Generate agreement upon validation</p>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => navigate('/admin-inbox')}
                                    className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    Dismiss
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={validating}
                                    className="flex-1 md:flex-none px-8 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {validating ? "Processing..." : "Approve Validation"}
                                    {!validating && <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">done_all</span>}
                                </button>
                            </div>
                        </div> */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminAcceptanceValidation;
