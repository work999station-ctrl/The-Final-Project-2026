import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const CompanyDashboard = () => {
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [offers, setOffers] = useState([]);
    const [isLoadingOffers, setIsLoadingOffers] = useState(true);
    const [stats, setStats] = useState({
        activeOffers: 0,
        newApplicants: 0,
        hiredCount: 0,
        pendingReviews: 0
    });
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const res = await fetch('/api/company/me');
                const data = await res.json();

                if (res.ok && data.user) {
                    // Set fetched data, and provide default fallbacks for missing text fields
                    setCompany({
                        companyName: data.user.companyName || 'Unknown Company',
                        description: data.user.description || 'No description provided.',
                        email: data.user.email || '',
                        phoneNumber: data.user.phoneNumber || 'Not set',
                        address: data.user.address || 'Not set',
                        website: data.user.website || 'Not set',
                        logo: data.user.logo || '',
                    });

                    // Fetch associated offers
                    try {
                        setIsLoadingOffers(true);
                        const offersRes = await fetch('/api/company/offers');
                        const offersData = await offersRes.json();
                        if (offersRes.ok && offersData.offers) {
                            setOffers(offersData.offers);
                        }

                        // Fetch dashboard stats
                        const statsRes = await fetch('/api/company/dashboard-stats');
                        const statsData = await statsRes.json();
                        if (statsRes.ok && statsData.success) {
                            setStats(statsData.stats);
                        }

                        // Fetch inbox messages for unread dot
                        const inboxRes = await fetch('/api/inbox/messages');
                        if (inboxRes.ok) {
                            const inboxData = await inboxRes.json();
                            setMessages(inboxData.messages || []);
                        }
                    } catch (err) {
                        console.error('Error fetching dashboard data:', err);
                    } finally {
                        setIsLoadingOffers(false);
                    }
                } else {
                    console.error('Failed to fetch company profile:', data.error);
                    // navigate('/company-Signup');
                }
            } catch (err) {
                console.error('Error fetching company profile:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyProfile();
    }, [navigate]);

    const handleDeleteOffer = async (id) => {
        if (!window.confirm("Are you sure you want to delete this offer?")) return;
        try {
            const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setOffers(offers.filter(offer => offer._id !== id));
            } else {
                alert("Failed to delete offer");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setCompany(prev => ({ ...prev, logo: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    if (isLoading) {
        return (
            <div className="bg-background-light dark:bg-slate-900 min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="bg-background-light dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center gap-4 text-slate-900 dark:text-slate-100">
                <span className="material-symbols-outlined text-6xl text-slate-400">error</span>
                <p>Could not load company profile.</p>
                <button onClick={() => navigate('/company-Signup')} className="text-primary hover:underline">Return to Signup</button>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 lg:px-12 py-4">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
                                <span className="material-symbols-outlined font-bold">hub</span>
                            </div>
                            <h2 className="text-xl font-bold font-header tracking-tight text-slate-900 dark:text-white">CampusConnect</h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <a className="text-primary font-semibold text-sm" href="#">Dashboard</a>
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="/candidate-tracking-statistics">Postings</a>
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="/company-inbox">Inbox</a>
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="#">Talent Pool</a>
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="#">Analytics</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input className="bg-slate-100 dark:bg-slate-800 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 w-64 outline-none" placeholder="Search students..." type="text" />
                        </div>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative" onClick={() => navigate('/company-inbox')}>
                            <span className="material-symbols-outlined">notifications</span>
                            {messages.some(msg => msg.unread) && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            )}
                        </button>
                        <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden cursor-pointer">
                            {company.logo ? (
                                <img alt="Company Admin" className="w-full h-full object-cover" src={company.logo} />
                            ) : (
                                <span className="material-symbols-outlined text-primary">person</span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto w-full p-6 lg:p-12 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">

                    {/* Left Sidebar: Company Information */}
                    <aside className="lg:col-span-3 space-y-6 sticky top-28">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

                            <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800">
                                <label className="relative cursor-pointer group flex mx-auto h-24 w-24 rounded-2xl bg-primary/10 border-2 border-primary/20 items-center justify-center overflow-hidden mb-4 transition-transform hover:scale-105">
                                    {company.logo ? (
                                        <img src={company.logo} alt="Company logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-5xl text-primary">corporate_fare</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                </label>

                                <h2 className="text-2xl font-bold font-header text-slate-900 dark:text-white">
                                    {company.companyName}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enterprise Software Partner</p>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">About</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {company.description}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 w-full">
                                            <span className="material-symbols-outlined text-primary text-lg">mail</span>
                                            <a href={`mailto:${company.email}`} className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors truncate">
                                                {company.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3 w-full">
                                            <span className="material-symbols-outlined text-primary text-lg">phone</span>
                                            <span className="text-sm text-slate-600 dark:text-slate-300 truncate">
                                                {company.phoneNumber}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 w-full">
                                            <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                            <span className="text-sm text-slate-600 dark:text-slate-300 truncate">
                                                {company.address}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 w-full">
                                            <span className="material-symbols-outlined text-primary text-lg">language</span>
                                            <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors truncate">
                                                {company.website}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => navigate('/edit-company-profile')}
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
                                        <span className="material-symbols-outlined text-lg">logout</span>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right Content Area */}
                    <div className="lg:col-span-9 space-y-8">

                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold font-header tracking-tight">Employer Portal</h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back. Here's what's happening with your internship programs.</p>
                            </div>
                            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95">
                                <span className="material-symbols-outlined">add</span>
                                <span><a href="/create-offer">Create New Offer</a></span>
                            </button>
                        </div>

                        {/* KPI Cards Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <span className="text-emerald-500 text-xs font-bold flex items-center">Live <span className="material-symbols-outlined text-xs ml-0.5">rss_feed</span></span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Offers</p>
                                <h3 className="text-2xl font-bold mt-1 text-slate-900 font-header dark:text-white">{stats.activeOffers}</h3>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-primary/10 text-primary rounded-full">
                                        <span className="material-symbols-outlined">group</span>
                                    </div>
                                    <span className="text-emerald-500 text-xs font-bold flex items-center">New <span className="material-symbols-outlined text-xs ml-0.5">trending_up</span></span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Recent Applicants</p>
                                <h3 className="text-2xl font-bold mt-1 text-slate-900 font-header dark:text-white">{stats.newApplicants}</h3>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full">
                                        <span className="material-symbols-outlined">pending_actions</span>
                                    </div>
                                    <span className="text-slate-400 text-xs font-bold flex items-center">To Review <span className="material-symbols-outlined text-xs ml-0.5">visibility</span></span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Reviews</p>
                                <h3 className="text-2xl font-bold mt-1 text-slate-900 font-header dark:text-white">{stats.pendingReviews}</h3>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full">
                                        <span className="material-symbols-outlined">verified</span>
                                    </div>
                                    <span className="text-emerald-500 text-xs font-bold flex items-center">Total <span className="material-symbols-outlined text-xs ml-0.5">check_circle</span></span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Validated Interns</p>
                                <h3 className="text-2xl font-bold mt-1 text-slate-900 font-header dark:text-white">{stats.hiredCount}</h3>
                            </div>
                        </div>

                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                            {/* Left Main Column: Active Internship Offers */}
                            <div className="xl:col-span-8 space-y-6">
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
                                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <h2 className="text-xl font-bold font-header">Active Internship Offers</h2>
                                        <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
                                        {isLoadingOffers ? (
                                            <div className="p-6 text-center text-slate-500">Loading offers...</div>
                                        ) : offers.length === 0 ? (
                                            <div className="p-6 flex flex-col items-center justify-center text-center">
                                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">inbox</span>
                                                <h4 className="font-semibold text-slate-700 dark:text-slate-300">No Active Offers</h4>
                                                <p className="text-sm text-slate-500">You haven't posted any internship offers yet.</p>
                                            </div>
                                        ) : (
                                            offers.map((offer) => (
                                                <div key={offer._id} onClick={() => navigate(`/offer-details/${offer._id}`)} className="p-8 relative hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer">
                                                    {/* Top-right Time */}
                                                    <div className="absolute top-6 right-8 text-slate-400 text-xs font-semibold tracking-wide">
                                                        {moment(offer.createdAt).startOf('day').fromNow()}
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex flex-shrink-0 items-center justify-center text-primary overflow-hidden">
                                                            {company.logo ? (
                                                                <img src={company.logo} alt="logo" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="material-symbols-outlined text-3xl">terminal</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col justify-center py-1">
                                                            <h4 className="font-bold font-header text-lg text-slate-900 dark:text-white mb-0.5">{offer.title}</h4>
                                                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                                <span className="flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                                                    {offer.slotsAvailable} Total Seats available
                                                                </span>
                                                                <span className="flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[18px]">paid</span>
                                                                    {offer.salary}.00 DA
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700">
                                                                    {offer.internshipType}
                                                                </span>
                                                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                                                    {offer.durationMonths} Months
                                                                </span>
                                                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[16px]">group</span>
                                                                    {offer.applicantCount || 0} Applicants
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {(() => {
                                                            const isClosed = offer.status === 'Closed' || (offer.endDateOfApplay && moment().isAfter(moment(offer.endDateOfApplay).endOf('day')));
                                                            return (
                                                                <span className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase ${isClosed ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                                                    {isClosed ? 'Closed' : 'Open'}
                                                                </span>
                                                            );
                                                        })()}
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors flex-shrink-0 text-slate-400 hover:text-primary"
                                                                title="Edit Offer"
                                                                onClick={(e) => { e.stopPropagation(); navigate(`/edit-offer/${offer._id}`); }}
                                                            >
                                                                <span className="material-symbols-outlined text-base">edit</span>
                                                            </button>
                                                            <button
                                                                className="p-2.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors flex-shrink-0 text-slate-400 hover:text-red-500"
                                                                title="Delete Offer"
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteOffer(offer._id); }}
                                                            >
                                                                <span className="material-symbols-outlined text-base">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar Inset: Recent Activity & Quick Actions */}
                            <div className="xl:col-span-4 space-y-8">

                                {/* Quick Actions */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                        <h2 className="text-lg font-bold font-header">Quick Actions</h2>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 gap-3">
                                        <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all gap-2 group">
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">assignment_turned_in</span>
                                            <span className="text-xs font-semibold text-center">Review Agreements</span>
                                        </button>
                                        <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all gap-2 group">
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">person_search</span>
                                            <span className="text-xs font-semibold text-center">Search Students</span>
                                        </button>
                                        <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all gap-2 group">
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">mail</span>
                                            <span className="text-xs font-semibold text-center">Message All</span>
                                        </button>
                                        <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all gap-2 group">
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">bar_chart</span>
                                            <span className="text-xs font-semibold text-center">Export Reports</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                        <h2 className="text-lg font-bold font-header">Recent Activity</h2>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="flex gap-4">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm leading-relaxed">
                                                    <span className="font-bold text-slate-900 dark:text-white">Amine B.</span> applied to <span className="font-medium text-primary cursor-pointer hover:underline">React Intern</span>
                                                </p>
                                                <p className="text-xs text-slate-400">14 minutes ago</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[18px] text-emerald-500">check_circle</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm leading-relaxed">
                                                    <span className="font-bold text-slate-900 dark:text-white">Sarah M.</span> accepted the offer for <span className="font-medium text-primary cursor-pointer hover:underline">Design Lead</span>
                                                </p>
                                                <p className="text-xs text-slate-400">2 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-center border-t border-slate-100 dark:border-slate-800">
                                        <button className="text-sm font-semibold text-primary hover:underline">View All Activity</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto py-8 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
                    <p>© 2024 Modern Connectivity. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                        <a className="hover:text-primary transition-colors" href="#">Help Center</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CompanyDashboard;
