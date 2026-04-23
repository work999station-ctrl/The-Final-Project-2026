import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import StudentNavbar from '../components/StudentNavbar';


const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "Student Name",
        email: "student@university.edu",
        phoneNumber: "",
        university: "University",
        currentYear: "",
        country: "Location",
        githubPortfolio: "github.com",
        skills: [],
        createdAt: new Date(),
        profilePicture: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjBPPlZgqCxXn4rLkoiUfFHy3MP2QaQAbHzCF--6xNTr52Hop8mjrnlAeaIN-fCEshDEM6yUsNXF0GTpdEmLd_HxUV25KKAkcvhbYOTiZ2-t2MXeOexxuRZ3AXjdAYkGHQZkSS_KBwH14mHdxTRwTuzl_hmkabWkPMyWilyA5bApTa4vFXFuW7MjFwQCE6XUlleuLy2M-TUhBAaD_-MM92RVVtnN6fSGGoH-coRgTEIZdsXtrPeNx8JRpzFeGPOkfqcyWdRU8ZdBo"
    });

    const [offers, setOffers] = useState([]);
    const [offersLoading, setOffersLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMoreOffers, setHasMoreOffers] = useState(true);
    const [applyingTo, setApplyingTo] = useState(null);
    const [applications, setApplications] = useState([]);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'applied': return { text: 'In Review', colorClass: 'slate' };
            case 'accepted': return { text: 'Accepted', colorClass: 'indigo' };
            case 'rejected': return { text: 'Refused', colorClass: 'red' };
            case 'validated': return { text: 'Validated', colorClass: 'green' };
            default: return { text: 'Unknown', colorClass: 'slate' };
        }
    };

    const fetchOffers = async (pageNum) => {
        setOffersLoading(true);
        try {
            const skip = (pageNum - 1) * 3;
            // Fetch offers for dashboard
            const offersRes = await fetch(`/api/offers?limit=3&skip=${skip}`);
            if (offersRes.ok) {
                const offersData = await offersRes.json();
                if (offersData.success) {
                    setOffers(offersData.offers);
                    setHasMoreOffers(offersData.offers.length === 3);
                }
            }
        } catch (err) {
            console.error("Failed to fetch dashboard offers:", err);
        } finally {
            setOffersLoading(false);
        }
    };

    const handleApply = async (e, offerId) => {
        e.stopPropagation();
        setApplyingTo(offerId);
        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ offerId })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert('Success! Your application has been submitted.');
                // Local update
                setOffers(prev => prev.map(o => o._id === offerId ? { ...o, isApplied: true } : o));
            } else {
                alert(data.message || 'Failed to apply.');
            }
        } catch (err) {
            console.error('Error applying:', err);
            alert('An error occurred. Please try again later.');
        } finally {
            setApplyingTo(null);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/student/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.user) {
                        setUser(prev => ({
                            ...prev,
                            ...data.user,
                            skills: data.user.skills || []
                        }));
                    }
                } else if (res.status === 401) {
                    window.location.href = '/student-signup';
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        fetchOffers(page);
    }, [page]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch('/api/student/applications');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) setApplications(data.applications);
                }
            } catch (err) {
                console.error('Failed to fetch applications:', err);
            }
        };
        fetchApplications();
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-body min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
            <StudentNavbar student={user} />

            {/* Main Content Layout */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="font-display text-3xl font-bold tracking-tight text-text-main dark:text-gray-100">Welcome back, {user.name.split(' ')[0]}</h1>
                    <p className="text-text-muted dark:text-gray-400 mt-1">Here's what's happening with your applications today.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar: Profile Identity */}
                    <aside className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6">
                        {/* Profile Card */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lift p-6 border border-border-color dark:border-slate-700/50 sticky top-24">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative group">
                                    <div className="size-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 bg-cover bg-center"
                                        style={{ backgroundImage: `url('${user.profilePicture}')` }}>
                                    </div>
                                </div>
                                <h2 className="font-display text-xl font-bold text-text-main dark:text-gray-100">{user.name}</h2>
                                <p className="text-primary font-medium text-sm mt-1">{user.specialty}</p>
                                <p className="text-text-muted dark:text-gray-400 text-xs mt-1 mb-4">{user.currentYear} • Ready to work</p>

                                {/* User Details section */}
                                <div className="w-full flex flex-col gap-2 mb-6 text-left">
                                    <div className="flex items-center gap-2 text-sm text-text-muted dark:text-gray-400">
                                        <span className="material-symbols-outlined text-base">mail</span>
                                        <label className="text-base">email:</label>
                                        <a href={`mailto:${user.email}`} className="text-base truncate text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors">{user.email}</a>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-muted dark:text-gray-400">
                                        <span className="material-symbols-outlined text-base">phone</span>
                                        <label className="text-base">phone:</label>
                                        <span className="text-base truncate text-slate-600 dark:text-slate-300 font-medium">{user.phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-muted dark:text-gray-400">
                                        <span className="material-symbols-outlined text-base">school</span>
                                        <label className="text-base">University:</label>
                                        <span className="text-base truncate text-slate-600 dark:text-slate-300 font-medium">{user.university}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-muted dark:text-gray-400">
                                        <span className="material-symbols-outlined text-base">calendar_month</span>
                                        <label className="text-base">Current Year:</label>
                                        <span className="text-base truncate text-slate-600 dark:text-slate-300 font-medium">{user.currentYear}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-muted dark:text-gray-400">
                                        <span className="material-symbols-outlined text-base">code</span>
                                        <a href={user.githubPortfolio && user.githubPortfolio.startsWith('http') ? user.githubPortfolio : `https://${user.githubPortfolio}`} target="_blank" rel="noopener noreferrer" className="text-base truncate text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors font-mono">{user.githubPortfolio}</a>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-muted dark:text-gray-400">
                                        <span className="material-symbols-outlined text-base">location_on</span>
                                        <label className="text-base">address:</label>
                                        <span className="text-base truncate text-slate-600 dark:text-slate-300 font-medium">{user.country}</span>
                                    </div>
                                </div>

                                {/* Skills Section */}
                                <div className="w-full text-left">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-body text-xs font-bold uppercase tracking-wider text-text-muted dark:text-gray-400">My Skills</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills.map(skill => (
                                            <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md font-mono text-xs border border-slate-200 dark:border-slate-700 hover:scale-105 hover:border-primary hover:text-primary transition-all cursor-default">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-full h-px bg-border-color my-6"></div>

                                {/* Availability */}
                                <div className="w-full text-left">
                                    <h3 className="font-body text-xs font-bold uppercase tracking-wider text-text-muted dark:text-gray-400 mb-3">Availability</h3>
                                    <div className="flex items-center gap-2 text-sm text-text-main dark:text-gray-100">
                                        <span className="material-symbols-outlined text-accent text-lg">calendar_today</span>
                                        <span>{moment(user.createdAt).format('ll')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-main dark:text-gray-100 mt-2">
                                        <span className="material-symbols-outlined text-secondary text-lg">location_on</span>
                                        <span>Remote or Algiers</span>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-border-color my-6"></div>

                                {/* Action Buttons */}
                                <div className="w-full flex flex-col gap-3">
                                    <button
                                        onClick={() => navigate('/edit-student-profile')}
                                        className="w-full py-3 px-4 rounded-xl border border-primary/20 text-primary font-semibold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await fetch('/api/logout', { method: 'POST' });
                                            window.location.href = '/';
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all border border-red-100 group shadow-sm shadow-red-50"
                                    >
                                        <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">logout</span>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right Content: Actions & Discovery */}
                    <div className="lg:col-span-8 xl:col-span-8 flex flex-col gap-8">
                        {/* Active Application Tracker */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-display text-xl font-bold text-text-main dark:text-gray-100">Active Applications</h2>
                                <button onClick={() => navigate('/ApplicationTracker')} className="text-sm font-medium text-primary hover:underline">View all ({applications.length})</button>
                            </div>

                            {applications.length === 0 ? (
                                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lift p-8 border border-border-color dark:border-slate-700/50 flex flex-col items-center text-center gap-3">
                                    <span className="material-symbols-outlined text-4xl text-slate-300">description</span>
                                    <p className="text-text-muted dark:text-gray-400 font-medium">No applications yet. Start applying!</p>
                                </div>
                            ) : (() => {
                                // Show the most recent application
                                const app = [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                                const info = getStatusInfo(app.status);
                                const step2Color = ['accepted', 'rejected', 'validated'].includes(app.status) ? `bg-${info.colorClass}-600` : 'bg-slate-200 dark:bg-slate-700';
                                const step3Color = app.status === 'validated' ? 'bg-green-600' : 'bg-slate-200 dark:bg-slate-700';
                                const dateApplied = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                                return (
                                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lift p-6 border border-border-color dark:border-slate-700/50">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center p-1 overflow-hidden">
                                                    {app.offerId?.companyId?.logo ? (
                                                        <img alt="Company Logo" className="w-full h-full object-contain" src={`http://localhost:3000${app.offerId.companyId.logo}`} />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-gray-400">business</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-text-main dark:text-gray-100">{app.offerId?.title || 'Position'}</h3>
                                                    <p className="text-sm text-text-muted dark:text-gray-400">{app.offerId?.companyId?.companyName || 'Company'} • Applied {dateApplied}</p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-${info.colorClass}-100 text-${info.colorClass}-700 border border-${info.colorClass}-200`}>
                                                {info.text}
                                            </span>
                                        </div>

                                        {/* Dynamic Progress Stepper */}
                                        <div className="py-4">
                                            <div className="flex items-center w-full">
                                                {/* Step 1: Applied */}
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className={`w-10 h-10 rounded-full bg-${info.colorClass}-600 ring-4 ring-${info.colorClass}-100 flex items-center justify-center shadow-md`}>
                                                        <span className="material-symbols-outlined text-white text-base" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                                                    </div>
                                                </div>
                                                <div className={`flex-1 h-1 rounded-full mx-1 ${step2Color !== 'bg-slate-200 dark:bg-slate-700' ? `bg-${info.colorClass}-500` : 'bg-slate-200 dark:bg-slate-700'}`}></div>

                                                {/* Step 2: Accepted / Refused */}
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-4 ${app.status === 'applied'
                                                        ? `bg-white dark:bg-slate-800 ring-${info.colorClass}-100 border-2 border-${info.colorClass}-400`
                                                        : app.status === 'rejected'
                                                            ? 'bg-red-600 ring-red-100'
                                                            : ['accepted', 'validated'].includes(app.status)
                                                                ? 'bg-indigo-600 ring-indigo-100'
                                                                : 'bg-slate-200 dark:bg-slate-700 ring-slate-100'
                                                        }`}>
                                                        <span className={`material-symbols-outlined text-base ${app.status === 'applied' ? `text-${info.colorClass}-400` :
                                                            app.status === 'rejected' ? 'text-white' : 'text-white'
                                                            }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                                            {app.status === 'rejected' ? 'cancel' : 'check_circle'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={`flex-1 h-1 rounded-full mx-1 ${step3Color !== 'bg-slate-200 dark:bg-slate-700' ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>

                                                {/* Step 3: Validated */}
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-4 ${app.status === 'validated'
                                                        ? 'bg-green-600 ring-green-100'
                                                        : ['accepted', 'rejected'].includes(app.status)
                                                            ? 'bg-white dark:bg-slate-800 border-2 border-green-400 ring-green-100'
                                                            : 'bg-slate-200 dark:bg-slate-700 ring-slate-100'
                                                        }`}>
                                                        <span className={`material-symbols-outlined text-base ${app.status === 'validated' ? 'text-white' :
                                                            ['accepted', 'rejected'].includes(app.status) ? 'text-green-400' : 'text-slate-400 dark:text-slate-500'
                                                            }`} style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Labels */}
                                            <div className="flex justify-between w-full mt-3">
                                                <span className={`text-xs font-bold text-${info.colorClass}-600 text-center w-10`}>Applied</span>
                                                <span className={`text-xs font-bold text-center flex-1 ${['accepted', 'rejected'].includes(app.status) ? `text-${info.colorClass}-600` : 'text-slate-400 dark:text-slate-500'}`}>
                                                    {app.status === 'rejected' ? 'Refused' : 'Accepted'}
                                                </span>
                                                <span className={`text-xs font-bold text-center w-10 ${app.status === 'validated' ? 'text-green-600' : 'text-slate-400 dark:text-slate-500'}`}>Valid.</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                                            <button
                                                onClick={() => navigate('/ApplicationTracker')}
                                                className="text-sm font-medium text-text-main dark:text-gray-100 hover:text-primary flex items-center gap-1 transition-colors"
                                            >
                                                View All Applications
                                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}
                        </section>

                        {/* Suggested Matches */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-display text-xl font-bold text-text-main dark:text-gray-100">Suggested for You</h2>
                                    <span className="bg-secondary/10 text-secondary text-xs font-bold px-2 py-0.5 rounded-full">AI Matched</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className={`size-8 rounded-full bg-white dark:bg-slate-800 border border-border-color dark:border-slate-700/50 flex items-center justify-center transition-colors ${page === 1 ? 'text-gray-300 cursor-not-allowed opacity-50' : 'text-text-muted dark:text-gray-400 hover:border-primary hover:text-primary cursor-pointer'}`}>
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={!hasMoreOffers}
                                        className={`size-8 rounded-full bg-white dark:bg-slate-800 border border-border-color dark:border-slate-700/50 flex items-center justify-center transition-colors ${!hasMoreOffers ? 'text-gray-300 cursor-not-allowed opacity-50' : 'text-text-muted dark:text-gray-400 hover:border-primary hover:text-primary cursor-pointer'}`}>
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {offersLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-xl h-[340px] border border-border-color dark:border-slate-700/50 animate-pulse"></div>
                                    ))
                                ) : offers.length === 0 ? (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-text-muted dark:text-gray-400">
                                        <p>No offers available.</p>
                                    </div>
                                ) : offers.map((offer) => {
                                    // Flatten tags
                                    const allTags = offer.techStack
                                        ? offer.techStack.flatMap(stack => stack.tags || [])
                                        : [];

                                    // Real match score from backend aggregation pipeline
                                    const score = offer.matchPercentage !== undefined ? Math.round(offer.matchPercentage) : 0;
                                    const matchColor = score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500';

                                    return (
                                        <div key={offer._id} onClick={() => navigate(`/offer-details/${offer._id}`)} className="group bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft hover:shadow-lift border border-border-color dark:border-slate-700/50 p-5 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="size-10 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center border border-gray-100 dark:border-slate-700 overflow-hidden">
                                                    {offer.company?.logo ? (
                                                        <img alt={`${offer.company.name} Logo`} className="w-full h-full object-cover" src={offer.company.logo} />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-gray-400">corporate_fare</span>
                                                    )}
                                                </div>
                                                <div className="relative w-10 h-10 flex flex-col items-center justify-center shrink-0" title={`${score}% Match`}>
                                                    <svg className="w-full h-full absolute -rotate-90" viewBox="0 0 36 36">
                                                        <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                                        <path className={`${matchColor} drop-shadow-sm`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${score}, 100`} strokeWidth="3"></path>
                                                    </svg>
                                                    <span className="absolute text-[9px] font-bold text-slate-800 dark:text-slate-100 pointer-events-none">{score}%</span>
                                                </div>
                                            </div>
                                            <h3 className="font-display font-bold text-lg text-text-main dark:text-gray-100 leading-tight mb-1">{offer.title}</h3>
                                            <p className="text-sm text-text-muted dark:text-gray-400 mb-4">{offer.company?.name || 'Company'} • {offer.wilaya || 'Algeria'}</p>
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {allTags.slice(0, 3).map((tag, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-mono border border-gray-200">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {allTags.length === 0 && (
                                                    <span className="text-[10px] text-gray-400 italic">No specific skills listed</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                                                {offer.description || 'No description provided.'}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700 mt-auto">
                                                <button onClick={(e) => { e.stopPropagation(); }} className="text-text-muted dark:text-gray-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">bookmark</span>
                                                </button>
                                                {(() => {
                                                    const isClosed = offer.status === 'Closed' || (offer.endDateOfApplay && moment().isAfter(moment(offer.endDateOfApplay).endOf('day')));
                                                    return (
                                                        <button
                                                            onClick={(e) => handleApply(e, offer._id)}
                                                            disabled={applyingTo === offer._id || offer.isApplied || isClosed}
                                                            className={`text-sm font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1 shadow-lg ${offer.isApplied ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 cursor-default shadow-none' : (isClosed ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700 shadow-none' : (applyingTo === offer._id ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-primary hover:bg-indigo-700 text-white shadow-indigo-500/30'))}`}>
                                                            {offer.isApplied ? 'Applied' : (isClosed ? 'Offer Closed' : (applyingTo === offer._id ? 'Applying...' : 'Apply Now'))}
                                                            {offer.isApplied && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                                                            {isClosed && <span className="material-symbols-outlined text-[16px]">lock</span>}
                                                            {applyingTo === offer._id && <span className="material-symbols-outlined text-[14px] animate-spin">hourglass_empty</span>}
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Bottom CTA - only show if profile is incomplete */}
                        {(!user.name || !user.email || !user.phoneNumber || !user.university || !user.currentYear || !user.country || !user.githubPortfolio || user.skills.length === 0) && (
                            <div className="bg-gradient-to-r from-primary to-violet-600 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white dark:bg-slate-800 opacity-10 blur-3xl"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div>
                                        <h3 className="font-display text-2xl font-bold mb-2">
                                            Enhance your CV to get 3x more offers</h3>
                                        <p className="text-white/80">Recruiters are searching for specific skills. Add your portfolio and certifications.</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/edit-student-profile')}
                                        className="bg-white dark:bg-slate-800 text-primary font-bold px-6 py-3 rounded-full hover:bg-gray-50 dark:bg-slate-800 transition-colors shadow-md whitespace-nowrap"
                                    >
                                        Enhance Your CV
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
