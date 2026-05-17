import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import CompanyNavbar from '../components/CompanyNavbar';
import useSocket from '../hooks/useSocket';

const CompanyDashboard = () => {
    const navigate = useNavigate();
    const socket = useSocket();

    const [company, setCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [offers, setOffers] = useState([]);
    const [isLoadingOffers, setIsLoadingOffers] = useState(true);
    const [offerToDelete, setOfferToDelete] = useState(null);
    const [stats, setStats] = useState({
        activeOffers: 0,
        newApplicants: 0,
        hiredCount: 0,
        pendingReviews: 0
    });


    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/company/me');
            const data = await res.json();

            if (res.ok && data.user) {
                setCompany({
                    companyName: data.user.companyName || 'Unknown Company',
                    description: data.user.description || 'No description provided.',
                    email: data.user.email || '',
                    phoneNumber: data.user.phoneNumber || 'Not set',
                    address: data.user.address || 'Not set',
                    website: data.user.website || 'Not set',
                    logo: data.user.logo || '',
                });

                try {
                    const offersRes = await fetch('/api/company/offers');
                    const offersData = await offersRes.json();
                    if (offersRes.ok && offersData.offers) {
                        setOffers(offersData.offers);
                    }

                    const statsRes = await fetch('/api/company/dashboard-stats');
                    const statsData = await statsRes.json();
                    if (statsRes.ok && statsData.success) {
                        setStats(statsData.stats);
                    }
                } catch (err) {
                    console.error('Error fetching dashboard data:', err);
                } finally {
                    setIsLoadingOffers(false);
                }
            }
        } catch (err) {
            console.error('Error fetching company profile:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        window.addEventListener('focus', fetchDashboardData);
        return () => window.removeEventListener('focus', fetchDashboardData);
    }, [navigate]);

    // ── Real-time: refresh when company profile is updated ──
    useEffect(() => {
        if (!socket) return;
        const handleUserUpdated = (payload) => {
            if (payload.type === 'company' && payload.data) {
                setCompany(prev => ({
                    ...prev,
                    companyName: payload.data.companyName || prev?.companyName,
                    description: payload.data.description || prev?.description,
                    email: payload.data.email || prev?.email,
                    phoneNumber: payload.data.phoneNumber || prev?.phoneNumber,
                    address: payload.data.address || prev?.address,
                    website: payload.data.website || prev?.website,
                    logo: payload.data.logo || prev?.logo,
                }));
            }
        };
        socket.on('user:updated', handleUserUpdated);
        return () => socket.off('user:updated', handleUserUpdated);
    }, [socket]);

    // ── Real-time: refresh stats when a new application arrives ──
    useEffect(() => {
        if (!socket) return;
        const handleNewApplication = () => {
            // Just re-fetch dashboard stats for live counters
            fetch('/api/company/dashboard-stats')
                .then(r => r.json())
                .then(d => { if (d.success) setStats(d.stats); })
                .catch(() => {});
        };
        socket.on('application:new', handleNewApplication);
        return () => socket.off('application:new', handleNewApplication);
    }, [socket]);

    const confirmDeleteOffer = async () => {
        if (!offerToDelete) return;
        try {
            const res = await fetch(`/api/offers/${offerToDelete}`, { method: 'DELETE' });
            if (res.ok) {
                setOffers(offers.filter(offer => offer._id !== offerToDelete));
                setOfferToDelete(null);
            } else {
                alert("Failed to delete offer");
                setOfferToDelete(null);
            }
        } catch (err) {
            console.error(err);
            setOfferToDelete(null);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show local preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setCompany(prev => ({ ...prev, logo: reader.result }));
        };
        reader.readAsDataURL(file);

        // Upload to server
        const formData = new FormData();
        formData.append('logo', file);

        try {
            const res = await fetch('/api/company/profile', {
                method: 'PUT',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                // Update with server path and current timestamp for cache busting
                setCompany(prev => ({ 
                    ...prev, 
                    logo: `${data.company.logo}?t=${Date.now()}` 
                }));
            } else {
                console.error('Failed to upload logo');
                alert('Failed to upload logo. Please try again.');
            }
        } catch (err) {
            console.error('Error uploading logo:', err);
            alert('An error occurred during logo upload.');
        }
    };

    if (isLoading) {
        return (
            <div className="bg-background-light dark:bg-background-dark dark:bg-slate-900 min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="bg-background-light dark:bg-background-dark dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center gap-4 text-slate-900 dark:text-white dark:text-slate-100">
                <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500">error</span>
                <p>Could not load company profile.</p>
                <button onClick={() => navigate('/company-Signup')} className="text-primary hover:underline">Return to Signup</button>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark dark:bg-slate-900 text-slate-900 dark:text-white dark:text-slate-100 min-h-screen flex flex-col font-display">
            <CompanyNavbar company={company} />

            <main className="max-w-[1600px] mx-auto w-full p-6 lg:p-12 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">

                    {/* Left Sidebar: Company Information */}
                    <aside className="lg:col-span-3 space-y-6 sticky top-28">
                        <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm overflow-hidden">

                            <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800 dark:border-slate-800">
                                <label className="relative cursor-pointer group flex mx-auto h-24 w-24 rounded-2xl bg-primary/10 border-2 border-primary/20 items-center justify-center overflow-hidden mb-4 transition-transform hover:scale-105">
                                    {company.logo ? (
                                        <img src={`${company.logo}${company.logo.includes('?') ? '' : `?t=${Date.now()}`}`} alt="Company logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-5xl text-primary">corporate_fare</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                </label>

                                <h2 className="text-2xl font-bold font-header text-slate-900 dark:text-white dark:text-white">
                                    {company.companyName}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Enterprise Software Partner</p>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">About</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {company.description}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Contact Details</h3>
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
                                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Welcome back. Here's what's happening with your internship programs.</p>
                            </div>
                            <button onClick={() => navigate('/create-offer')} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95">
                                <span className="material-symbols-outlined">add</span>
                                <span>Create New Offer</span>
                            </button>
                        </div>

                        {/* KPI Cards Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <span className="text-emerald-500 text-xs font-bold flex items-center">Live <span className="material-symbols-outlined text-xs ml-0.5">rss_feed</span></span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-medium">Active Offers</p>
                                <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white font-header dark:text-white">{stats.activeOffers}</h3>
                            </div>
                            <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-primary/10 text-primary rounded-full">
                                        <span className="material-symbols-outlined">group</span>
                                    </div>
                                    <span className="text-emerald-500 text-xs font-bold flex items-center">New <span className="material-symbols-outlined text-xs ml-0.5">trending_up</span></span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-medium">Recent Applicants</p>
                                <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white font-header dark:text-white">{stats.newApplicants}</h3>
                            </div>
                            <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full">
                                        <span className="material-symbols-outlined">pending_actions</span>
                                    </div>
                                    <span className="text-slate-400 dark:text-slate-500 text-xs font-bold flex items-center">To Review <span className="material-symbols-outlined text-xs ml-0.5">visibility</span></span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-medium">Pending Reviews</p>
                                <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white font-header dark:text-white">{stats.pendingReviews}</h3>
                            </div>
                            <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full">
                                        <span className="material-symbols-outlined">verified</span>
                                    </div>
                                    <span className="text-emerald-500 text-xs font-bold flex items-center">Total <span className="material-symbols-outlined text-xs ml-0.5">check_circle</span></span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-medium">Validated Interns</p>
                                <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white font-header dark:text-white">{stats.hiredCount}</h3>
                            </div>
                        </div>

                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                            {/* Left Main Column: Active Internship Offers */}
                            <div className="xl:col-span-8 space-y-6">
                                <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
                                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <h2 className="text-xl font-bold font-header">Active Internship Offers</h2>
                                        <button onClick={() => navigate('/company-offers')} className="text-primary text-sm font-semibold hover:underline">View All</button>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
                                        {isLoadingOffers ? (
                                            <div className="p-6 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading offers...</div>
                                        ) : offers.length === 0 ? (
                                            <div className="p-6 flex flex-col items-center justify-center text-center">
                                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">inbox</span>
                                                <h4 className="font-semibold text-slate-700 dark:text-slate-200 dark:text-slate-300">No Active Offers</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">You haven't posted any internship offers yet.</p>
                                            </div>
                                        ) : (
                                            offers.slice(0, 5).map((offer) => (
                                                <div key={offer._id} onClick={() => navigate(`/offer-details/${offer._id}`)} className="p-8 relative hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer">
                                                    {/* Top-right Time */}
                                                    <div className="absolute top-6 right-8 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-wide">
                                                        {moment(offer.createdAt).startOf('day').fromNow()}
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex flex-shrink-0 items-center justify-center text-primary overflow-hidden">
                                                            {company.logo ? (
                                                                <img src={`${company.logo}${company.logo.includes('?') ? '' : `?t=${Date.now()}`}`} alt="logo" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="material-symbols-outlined text-3xl">terminal</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col justify-center py-1">
                                                            <h4 className="font-bold font-header text-lg text-slate-900 dark:text-white mb-0.5">{offer.title}</h4>
                                                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
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
                                                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 dark:border-slate-700">
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
                                                                className="p-2.5 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700 rounded-full transition-colors flex-shrink-0 text-slate-400 dark:text-slate-500 hover:text-primary"
                                                                title="Edit Offer"
                                                                onClick={(e) => { e.stopPropagation(); navigate(`/edit-offer/${offer._id}`); }}
                                                            >
                                                                <span className="material-symbols-outlined text-base">edit</span>
                                                            </button>
                                                            <button
                                                                className="p-2.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors flex-shrink-0 text-slate-400 dark:text-slate-500 hover:text-red-500"
                                                                title="Delete Offer"
                                                                onClick={(e) => { e.stopPropagation(); setOfferToDelete(offer._id); }}
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
                                <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 dark:border-slate-800">
                                        <h2 className="text-lg font-bold font-header">Quick Actions</h2>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 gap-3">
                                        <button onClick={() => navigate('/company-direct-messages')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-all gap-2 group">
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">chat</span>
                                            <span className="text-xs font-semibold text-center">Direct Messages</span>
                                        </button>
                                        <button onClick={() => navigate('/company-statistics')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-all gap-2 group">
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">bar_chart</span>
                                            <span className="text-xs font-semibold text-center">Export Reports</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto py-8 px-6 border-t border-slate-200 dark:border-slate-700 dark:border-slate-800 bg-white dark:bg-slate-800 dark:bg-slate-900">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm">
                    <p>© 2026 Modern Connectivity. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link to="/contact-us" className="hover:text-primary transition-colors">Help Center</Link>
                    </div>
                </div>
            </footer>

            {/* Delete Offer Confirmation Modal */}
            {offerToDelete && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-slate-100 dark:border-slate-800 dark:border-slate-800">
                        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white font-headline tracking-tight mb-2">Delete Offer?</h3>
                        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm mb-8 font-medium leading-relaxed">Are you absolutely sure you want to delete this internship offer? This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setOfferToDelete(null)} 
                                className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 dark:text-slate-300 font-bold text-sm uppercase tracking-wider rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => confirmDeleteOffer()} 
                                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-rose-600/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyDashboard;
