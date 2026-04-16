import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import CompanyNavbar from '../components/CompanyNavbar';

const CompanyOffers = () => {
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [offers, setOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offerToDelete, setOfferToDelete] = useState(null);

    useEffect(() => {
        const fetchCompanyAndOffers = async () => {
            try {
                // Fetch company profile
                const res = await fetch('/api/company/me');
                if (res.ok) {
                    const data = await res.json();
                    setCompany(data.user || null);
                }

                // Fetch associated offers
                const offersRes = await fetch('/api/company/offers');
                if (offersRes.ok) {
                    const data = await offersRes.json();
                    setOffers(data.offers || []);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanyAndOffers();
    }, []);

    const confirmDeleteOffer = async () => {
        if (!offerToDelete) return;
        try {
            const res = await fetch(`/api/offers/${offerToDelete}`, { method: 'DELETE' });
            if (res.ok) {
                setOffers(offers.filter(o => o._id !== offerToDelete));
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

    return (
        <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-body">
            <CompanyNavbar company={company} />

            <main className="max-w-6xl mx-auto w-full p-6 lg:p-12 flex-1 flex flex-col">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black font-header tracking-tight text-slate-900 dark:text-white">My Internship Offers</h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">Manage and edit all your posted internship opportunities in one place.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/create-offer')} 
                        className="flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] w-full sm:w-auto justify-center"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Create New Offer
                    </button>
                </div>

                {/* Main List Container */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden mb-12">
                    
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">All Offers</h2>
                        <span className="bg-[#4F46E5]/10 text-[#4F46E5] px-3 py-1 rounded-full text-xs font-bold">{offers.length} Total</span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 flex flex-col relative overflow-y-auto">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 z-10">
                                <div className="w-10 h-10 border-4 border-[#4F46E5] border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
                            </div>
                        ) : offers.length === 0 ? (
                            <div className="p-16 flex flex-col items-center justify-center text-center flex-1">
                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">post_add</span>
                                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">No Offers Created Yet</h4>
                                <p className="text-sm text-slate-500 max-w-sm">You haven't posted any internship opportunities. Click "Create New Offer" to get started.</p>
                            </div>
                        ) : (
                            offers.map((offer) => (
                                <div 
                                    key={offer._id} 
                                    onClick={() => navigate(`/offer-details/${offer._id}`)} 
                                    className="p-6 md:p-8 relative hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6 group cursor-pointer"
                                >
                                    
                                    {/* Top-right Time for Mobile View, embedded cleanly for Desktop */}
                                    <div className="absolute top-6 right-6 lg:static lg:right-auto lg:top-auto text-slate-400 text-xs font-semibold tracking-wide order-3 lg:order-none hidden sm:block">
                                        Posted {moment(offer.createdAt).startOf('day').fromNow()}
                                    </div>

                                    {/* Info Block */}
                                    <div className="flex items-start md:items-center gap-6 flex-1 min-w-0">
                                        <div className="h-16 w-16 md:h-14 md:w-14 rounded-2xl bg-[#4F46E5]/10 flex flex-shrink-0 items-center justify-center border border-[#4F46E5]/20 overflow-hidden text-[#4F46E5]">
                                            {company?.logo ? (
                                                <img src={company.logo} alt="Company logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-3xl">work</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center py-1 min-w-0">
                                            <h4 className="font-black text-lg md:text-xl text-slate-900 dark:text-white mb-1 truncate group-hover:text-[#4F46E5] transition-colors">{offer.title}</h4>
                                            
                                            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                                                <span className="flex items-center gap-1.5 flex-shrink-0">
                                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                    {offer.wilaya}
                                                </span>
                                                <span className="flex items-center gap-1.5 flex-shrink-0">
                                                    <span className="material-symbols-outlined text-[16px]">group</span>
                                                    {offer.slotsAvailable} Seats
                                                </span>
                                                <span className="flex items-center gap-1.5 flex-shrink-0">
                                                    <span className="material-symbols-outlined text-[16px]">paid</span>
                                                    {offer.salary ? `${offer.salary} DA` : 'Unpaid'}
                                                </span>
                                            </div>

                                            <div className="flex items-center flex-wrap gap-2 mt-3">
                                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                                                    {offer.internshipType}
                                                </span>
                                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                                                    {offer.durationMonths} Months
                                                </span>
                                                {offer.applicantCount !== undefined && (
                                                    <span className="px-2.5 py-1 bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-bold rounded-lg flex items-center gap-1.5 border border-[#4F46E5]/30">
                                                        <span className="material-symbols-outlined text-[14px]">psychology</span>
                                                        {offer.applicantCount} Applicants
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto pl-22 lg:pl-0 mt-4 lg:mt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 pt-4 lg:pt-0">
                                        
                                        {/* Status Tag */}
                                        {(() => {
                                            const isClosed = offer.status === 'Closed' || (offer.endDateOfApplay && moment().isAfter(moment(offer.endDateOfApplay).endOf('day')));
                                            return (
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2.5 w-2.5 rounded-full ${isClosed ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                                                    <span className={`text-[10px] uppercase tracking-widest font-black ${isClosed ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                        {isClosed ? 'Closed' : 'Active'}
                                                    </span>
                                                </div>
                                            );
                                        })()}

                                        <div className="flex items-center gap-1.5 relative z-10">
                                            <button 
                                                className="h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-sm text-slate-500 hover:text-[#4F46E5]"
                                                title="Edit Offer"
                                                onClick={(e) => { e.stopPropagation(); navigate(`/edit-offer/${offer._id}`); }}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button 
                                                className="h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800 rounded-xl transition-all shadow-sm text-slate-500 hover:text-rose-500"
                                                title="Delete Offer"
                                                onClick={(e) => { e.stopPropagation(); setOfferToDelete(offer._id); }}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            ))
                        )}
                    </div>
                </div>

            </main>

            {/* Delete Offer Confirmation Modal */}
            {offerToDelete && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-slate-100 dark:border-slate-800">
                        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white font-headline tracking-tight mb-2">Delete Offer?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium leading-relaxed">Are you absolutely sure you want to delete this internship offer? This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setOfferToDelete(null)} 
                                className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider rounded-xl transition-all"
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

export default CompanyOffers;
