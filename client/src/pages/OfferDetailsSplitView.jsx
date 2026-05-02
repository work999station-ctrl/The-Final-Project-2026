import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { getProfileCompletion } from '../utils/profileCompletion';

const OfferDetailsSplitView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [userType, setUserType] = useState(null); // 'student' or 'company'
    const [applicants, setApplicants] = useState([]);
    const [applicantsLoading, setApplicantsLoading] = useState(false);
    const [actionModal, setActionModal] = useState(null);
    const [applyModal, setApplyModal] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [profileIncompleteModal, setProfileIncompleteModal] = useState(false);

    useEffect(() => {
        const fetchOfferDetails = async () => {
            try {
                // Also fetch user type to handle permissions
                const studentRes = await fetch('/api/student/me');
                if (studentRes.ok) {
                    setUserType('student');
                    const studentJson = await studentRes.json();
                    if (studentJson && studentJson.user) setStudentData(studentJson.user);
                } else {
                    const companyRes = await fetch('/api/company/me');
                    if (companyRes.ok) {
                        setUserType('company');
                    } else {
                        const adminRes = await fetch('/api/admin/me');
                        if (adminRes.ok) setUserType('admin');
                    }
                }

                const response = await fetch(`/api/offers/${id}`);
                const data = await response.json();
                if (response.ok && data.success) {
                    setOffer(data.offer);
                    setCompany(data.company);
                } else {
                    setError(data.error || 'Failed to fetch offer details.');
                }
            } catch (err) {
                setError('Failed to fetch offer details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOfferDetails();
    }, [id]);

    useEffect(() => {
        const fetchApplicants = async () => {
            if (userType !== 'company' || !id) return;

            try {
                setApplicantsLoading(true);
                const res = await fetch(`/api/company/applications/offer/${id}`);
                const data = await res.json();
                if (res.ok && data.success) {
                    setApplicants(data.applications);
                }
            } catch (err) {
                console.error("Error fetching applicants:", err);
            } finally {
                setApplicantsLoading(false);
            }
        };

        fetchApplicants();
    }, [id, userType]);

    const handleApply = async () => {
        // Check profile completion before applying
        if (studentData) {
            const completion = getProfileCompletion(studentData);
            if (completion < 80) {
                setApplyModal(false);
                setProfileIncompleteModal(true);
                return;
            }
        }
        setApplyModal(false);
        setIsApplying(true);
        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ offerId: id })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setToastMessage('Your application has been submitted successfully!');
                setTimeout(() => setToastMessage(null), 4000);
                setOffer(prev => ({ ...prev, isApplied: true }));
            } else {
                setToastMessage(data.message || 'Failed to apply.');
                setTimeout(() => setToastMessage(null), 4000);
            }
        } catch (err) {
            console.error('Error applying:', err);
            setToastMessage('An error occurred. Please try again later.');
            setTimeout(() => setToastMessage(null), 4000);
        } finally {
            setIsApplying(false);
        }
    };
    const handleCloseOffer = async () => {
        try {
            const token = document.cookie.split('jwt=')[1]?.split(';')[0] || localStorage.getItem('token');
            const res = await fetch(`/api/offers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ status: 'Closed' })
            });

            if (res.ok) {
                setOffer(prev => ({ ...prev, status: 'Closed' }));
                setActionModal(null);
                setToastMessage("Offer closed successfully.");
                setTimeout(() => setToastMessage(null), 4000);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to close offer");
                setActionModal(null);
            }
        } catch (err) {
            console.error("Error closing offer:", err);
            alert("Connection error. Please try again.");
            setActionModal(null);
        }
    };

    const handleReopenOffer = async () => {
        let newDeadline = offer.endDateOfApplay;
        const deadlineExpired = moment().isAfter(moment(offer.endDateOfApplay).endOf('day'));

        // If deadline expired, automatically extend it by 14 days to make it truly 'open' again
        if (deadlineExpired) {
            newDeadline = moment().add(14, 'days').toDate();
        }

        try {
            const res = await fetch(`/api/offers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'Open',
                    endDateOfApplay: newDeadline
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setOffer(data.offer);
                    setActionModal(null);
                    setToastMessage(deadlineExpired
                        ? `Offer re-opened successfully. Application deadline has been extended to ${moment(newDeadline).format('LL')}.`
                        : "Offer re-opened successfully."
                    );
                    setTimeout(() => setToastMessage(null), 4000);
                }
            } else {
                const errorData = await res.json();
                alert(errorData.error || "Failed to re-open offer");
                setActionModal(null);
            }
        } catch (err) {
            console.error("Error re-opening offer:", err);
            alert("An error occurred while re-opening the offer.");
            setActionModal(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex items-center justify-center font-sans">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !offer) {
        return (
            <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex items-center justify-center font-sans flex-col gap-4">
                <div className="text-red-500 font-bold">{error || 'Offer not found.'}</div>
                <button onClick={() => navigate('/company-dashboard')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Go Back</button>
            </div>
        );
    }

    const isClosed = offer.status === 'Closed' || (offer.endDateOfApplay && moment().isAfter(moment(offer.endDateOfApplay).endOf('day')));

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
            <main className="pt-12 pb-12 px-6 max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                            <Link
                                to={userType === 'student' ? "/student-dashboard" : (userType === 'admin' ? "/admin-dashboard" : "/company-dashboard")}
                                className="hover:text-indigo-600 cursor-pointer"
                            >
                                Dashboard
                            </Link>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                            {userType === 'student' ? (
                                <>
                                    <Link to="/opportunities" className="hover:text-indigo-600 cursor-pointer">Offers</Link>
                                    <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                                </>
                            ) : null}
                            <span className="text-slate-900 dark:text-slate-200 font-medium">{offer.title}</span>
                        </nav>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {userType === 'admin' ? 'Offer Review' : (userType === 'student' ? 'Offer Details' : 'Offer Management')}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {userType === 'company' && (
                            <>
                                <button
                                    onClick={() => navigate(`/edit-offer/${id}`)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                    Edit Offer
                                </button>
                                {isClosed ? (
                                    <button
                                        onClick={() => setActionModal({ type: 'reopen' })}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                        Re-open Offer
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setActionModal({ type: 'close' })}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-md active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-lg">block</span>
                                        Close Offer
                                    </button>
                                )}
                            </>
                        )}
                        {userType === 'student' && (
                            <>
                                <button
                                    onClick={() => setApplyModal(true)}
                                    disabled={isApplying || (offer && offer.isApplied) || isClosed}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg ${offer && offer.applicationStatus === 'admin_rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50 cursor-default shadow-none' : (offer && offer.isApplied ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 cursor-default shadow-none' : (isClosed ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700 shadow-none' : (isApplying ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-indigo-900/40')))}`}>
                                    {offer && offer.applicationStatus === 'admin_rejected' ? 'Refused' : (offer && offer.isApplied ? 'Applied' : (isClosed ? 'Offer Closed' : (isApplying ? 'Applying...' : 'Apply now')))}
                                    <span className={`material-symbols-outlined text-lg ${isApplying ? 'animate-spin' : ''}`}>
                                        {offer && offer.applicationStatus === 'admin_rejected' ? 'block' : (offer && offer.isApplied ? 'check_circle' : (isClosed ? 'lock' : (isApplying ? 'hourglass_empty' : 'send')))}
                                    </span>
                                </button>
                                <button
                                    onClick={() => navigate(`/company-dashboard-student-view/${company?._id}`)} // Placeholder for student view
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all"
                                >
                                    View Company
                                    <span className="material-symbols-outlined text-lg">corporate_fare</span>
                                </button>
                            </>
                        )}
                        {userType === 'admin' && (
                            <button
                                onClick={() => navigate(`/company-profile-admin/${company?._id}`)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined text-lg">corporate_fare</span>
                                View Company
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Pane: Detailed Card */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="h-32 bg-indigo-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-800 opacity-90"></div>
                                {/* Optional: Add company banner if exists */}
                                {company?.banner && <img src={company.banner} alt="banner" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" />}
                                <div className="absolute -bottom-6 left-8">
                                    <div className="h-20 w-20 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                        <div className="w-full h-full bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center overflow-hidden">
                                            {company?.logo ? (
                                                <img src={company.logo} alt="Company Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>developer_board</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-10 px-8 pb-8">
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{offer.title}</h2>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-base">location_on</span>
                                                {offer.wilaya || 'Remote / Unknown Location'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-base">schedule</span>
                                                Posted {moment(offer.createdAt).fromNow()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isClosed ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'}`}>
                                        <span className={`w-2 h-2 rounded-full ${isClosed ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                                        {isClosed ? 'Closed' : 'Open'}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">Description</h3>
                                        <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                                            {offer.description || 'No description provided.'}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">How you'll work</h3>
                                        <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                                            {offer.internshipType === 'PFE' && 'The "Graduation Project" internship. It is long-term (4–6 months) and requires a final thesis and defense.'}
                                            {offer.internshipType === 'Observation' && 'A short-term "Summer Internship" (usually 1 month) aimed at discovering the professional environment.'}
                                            {offer.internshipType === 'Perfectionnement' && 'A technical internship (2–3 months) focused on mastering a specific skill or tool.'}
                                            {offer.internshipType === 'Remote' && 'This is a growing "Type" filter where the student can work from home.'}
                                            {(!['PFE', 'Observation', 'Perfectionnement', 'Remote'].includes(offer.internshipType)) && 'Standard internship procedures apply based on company policies and university guidelines.'}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">Required Skills</h3>
                                        <div className="flex flex-col gap-4">
                                            {offer.techStack && offer.techStack.length > 0 ? (
                                                offer.techStack.map((stack, index) => (
                                                    <div key={index}>
                                                        {stack.category && (
                                                            <div className="flex items-center gap-3 mb-3 mt-1">
                                                                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
                                                                    <span className="material-symbols-outlined text-[16px]">category</span>
                                                                </span>
                                                                <h4 className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 uppercase tracking-widest">
                                                                    {stack.category}
                                                                </h4>
                                                                <div className="flex-1 min-w-[20px] h-px bg-gradient-to-r from-slate-200 dark:from-slate-700 to-transparent"></div>
                                                            </div>
                                                        )}
                                                        <div className="flex flex-wrap gap-2">
                                                            {stack.tags && stack.tags.map((tag, tagIndex) => (
                                                                <span key={tagIndex} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold border border-indigo-100 dark:border-indigo-800">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-sm text-slate-500">No specific skills listed.</span>
                                            )}
                                        </div>
                                    </section>

                                    <section className="mt-8">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">Application Deadline</h3>
                                        {offer.endDateOfApplay ? (
                                            <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-transparent dark:from-amber-800/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">calendar_clock</span>
                                                <span className="text-sm font-bold text-amber-900 dark:text-amber-100">
                                                    {new Date(offer.endDateOfApplay).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-slate-500 italic">No exact deadline specified.</span>
                                        )}
                                    </section>

                                    <section className="mt-8">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">About the Company</h3>
                                        {company ? (
                                            <>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                                    {company.description || company.companyName || 'Company details not available.'}
                                                </p>
                                                {company.website && (
                                                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                                                        Visit Website
                                                        <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                                    </a>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-sm text-slate-500">Company details not available.</p>
                                        )}
                                    </section>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mt-6 border-t border-slate-100 dark:border-slate-700">
                                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                        <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Duration</span>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{offer.durationMonths || 0} Months</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                        <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Salary</span>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{offer.salary}.00 DA</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                        <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Type</span>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">{offer.internshipType || 'Full-time'}</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                        <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Openings</span>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{offer.slotsAvailable || 1} Seats</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Info Grid - Only shown to companies */}
                        {userType === 'company' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-symbols-outlined text-indigo-500">analytics</span>
                                        <h3 className="font-bold">Application Trends</h3>
                                    </div>
                                    <div className="flex items-end gap-1 h-24 mb-4">
                                        <div className="flex-1 bg-indigo-100 dark:bg-indigo-900/40 rounded-t-sm h-[40%]"></div>
                                        <div className="flex-1 bg-indigo-200 dark:bg-indigo-900/60 rounded-t-sm h-[65%]"></div>
                                        <div className="flex-1 bg-indigo-300 dark:bg-indigo-800/60 rounded-t-sm h-[50%]"></div>
                                        <div className="flex-1 bg-indigo-400 dark:bg-indigo-700/60 rounded-t-sm h-[85%]"></div>
                                        <div className="flex-1 bg-indigo-600 dark:bg-indigo-600 rounded-t-sm h-[100%]"></div>
                                    </div>
                                    <p className="text-xs text-slate-500">Applications increased by 24% since yesterday.</p>
                                </div>

                                <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-lg mb-2">Hire faster with AI</h3>
                                        <p className="text-indigo-100 text-sm mb-4">Use our smart matching system to find the best 5% of candidates automatically.</p>
                                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">Generate Shortlist</button>
                                    </div>
                                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/10 text-9xl">psychology</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Pane: Quick Applicant List - Only shown to companies */}
                    {userType === 'company' && (
                        <div className="lg:col-span-4">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full sticky top-8 min-h-[500px]">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Quick Applicant List</h3>
                                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">{applicants.length} Total</span>
                                </div>
                                <div className="flex-1 overflow-y-auto max-h-[600px] p-4 space-y-3">
                                    {applicantsLoading ? (
                                        <div className="space-y-3 animate-pulse">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-24 bg-slate-100 dark:bg-slate-700/50 rounded-xl"></div>
                                            ))}
                                        </div>
                                    ) : (
                                        applicants.length > 0 ? (
                                            applicants.map((app) => (
                                                <div key={app._id} className="p-4 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            alt={app.studentId?.name}
                                                            className="h-12 w-12 rounded-full object-cover bg-slate-200 dark:bg-slate-700"
                                                            src={app.studentId?.profilePicture || 'https://via.placeholder.com/150'}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{app.studentId?.name || 'Anonymous candidate'}</h4>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{app.studentId?.university || 'N/A'} • {app.studentId?.currentYear || 'N/A'}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="block text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded">
                                                                {app.matchPercentage}% Match
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                        <span className="text-[10px] text-slate-400">Applied {moment(app.createdAt).fromNow()}</span>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => navigate(`/student-profile-recruiter/${app.studentId._id}`)}
                                                                className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:underline cursor-pointer"
                                                            >
                                                                Profile
                                                            </button>
                                                            <button
                                                                onClick={() => navigate(`/application-details/${app._id}`)}
                                                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                                                            >
                                                                View Application
                                                                <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">person_search</span>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">No applicants yet.</p>
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => navigate('/candidate-tracking-statistics')}
                                        className="w-full py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        View All Candidates
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Floating Apply Confirmation Modal */}
            {applyModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setApplyModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl">send</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Apply to this offer?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 font-semibold">{offer?.title}</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mb-8">at {company?.companyName || 'Company'}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setApplyModal(false)}
                                className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">send</span>
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Incomplete Modal */}
            {profileIncompleteModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setProfileIncompleteModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Profile Incomplete</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 font-semibold">Your profile is only {studentData ? getProfileCompletion(studentData) : 0}% complete.</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mb-8">You need at least 80% to apply to offers. Please complete your profile information first.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setProfileIncompleteModal(false)}
                                className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => navigate('/edit-student-profile')}
                                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                                Complete Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Confirmation Modal */}
            {actionModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-slate-100 dark:border-slate-800">
                        <div className={`w-16 h-16 ${actionModal.type === 'close' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30 text-amber-600' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30 text-emerald-600'} border rounded-full flex items-center justify-center mx-auto mb-6`}>
                            <span className="material-symbols-outlined text-3xl">{actionModal.type === 'close' ? 'lock' : 'lock_open'}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white font-headline tracking-tight mb-2">{actionModal.type === 'close' ? 'Close Offer?' : 'Reopen Offer?'}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium leading-relaxed">
                            {actionModal.type === 'close' 
                                ? 'Are you sure you want to close this internship offer? Candidates will no longer be able to apply.' 
                                : 'Are you sure you want to reopen this internship offer? Candidates will be able to apply again.'}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActionModal(null)}
                                className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={actionModal.type === 'close' ? handleCloseOffer : handleReopenOffer}
                                className={`flex-1 py-3 ${actionModal.type === 'close' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'} text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl`}
                            >
                                {actionModal.type === 'close' ? 'Close Offer' : 'Reopen Offer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-[200] animate-fade-in-up">
                    <div className="bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-sm">
                        <div className="bg-white/20 p-2 rounded-full flex-shrink-0">
                            <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                        </div>
                        <p className="text-sm font-semibold">{toastMessage}</p>
                        <button 
                            onClick={() => setToastMessage(null)}
                            className="ml-auto text-white/80 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfferDetailsSplitView;
