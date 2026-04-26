import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import StudentNavbar from '../components/StudentNavbar';

const InternshipOffers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openFilter, setOpenFilter] = useState(null);
    const filterRef = useRef(null);
    const [offers, setOffers] = useState([]);
    const [offersLoading, setOffersLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState({ wilaya: '', duration: '', type: '', skill: '' });
    const [searchQuery, setSearchQuery] = useState(() => new URLSearchParams(location.search).get('search') || '');

    // Sync search query whenever the URL ?search= param changes (e.g. navbar search)
    useEffect(() => {
        const urlSearch = new URLSearchParams(location.search).get('search') || '';
        setSearchQuery(urlSearch);
    }, [location.search]);
    const [student, setStudent] = useState(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setOpenFilter(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [applyingTo, setApplyingTo] = useState(null);
    const [limit, setLimit] = useState(6);
    const [hasMore, setHasMore] = useState(false);

    // Fetch offers — re-runs whenever activeFilters changes
    const fetchOffers = useCallback(async () => {
        setOffersLoading(true);
        try {
            const params = new URLSearchParams({ limit });
            if (activeFilters.wilaya) params.append('wilaya', activeFilters.wilaya);
            if (activeFilters.duration) params.append('duration', activeFilters.duration);
            if (activeFilters.type) params.append('type', activeFilters.type);
            if (activeFilters.skill) params.append('skill', activeFilters.skill);
            console.log(params.toString());
            const res = await fetch(`/api/offers?${params.toString()}`);
            const data = await res.json();
            if (res.ok && data.success) {
                setOffers(data.offers);
                setHasMore(data.offers.length >= limit);
            }
        } catch (err) {
            console.error('Failed to fetch offers:', err);
        } finally {
            setOffersLoading(false);
        }
    }, [activeFilters, limit]);

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
                // Local update to set isApplied to true
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

    useEffect(() => { fetchOffers(); }, [fetchOffers]);

    // Fetch student profile for header
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await fetch('/api/student/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.user) setStudent(data.user);
                }
            } catch (err) {
                console.error('Failed to fetch student:', err);
            }
        };
        fetchStudent();
    }, []);

    // Apply a filter and close dropdown
    const applyFilter = (key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
        setLimit(6);
        setOpenFilter(null);
    };

    // Clear a single filter
    const clearFilter = (key) => {
        setActiveFilters(prev => ({ ...prev, [key]: '' }));
        setLimit(6);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setActiveFilters({ wilaya: '', duration: '', type: '', skill: '' });
        setLimit(6);
    };

    const hasActiveFilters = Object.values(activeFilters).some(Boolean) || !!searchQuery;

    // Client-side filter by search query (title, company name, tags)
    const filteredOffers = searchQuery.trim()
        ? offers.filter(o => {
            const q = searchQuery.toLowerCase();
            const allTags = o.techStack ? o.techStack.flatMap(s => s.tags || []) : [];
            return (
                (o.title || '').toLowerCase().includes(q) ||
                (o.company?.companyName || o.company?.name || '').toLowerCase().includes(q) ||
                allTags.some(t => t.toLowerCase().includes(q))
            );
          })
        : offers;

    const wilayas = [
        '01 - Adrar', '02 - Chlef', '03 - Laghouat', '04 - Oum El Bouaghi', '05 - Batna',
        '06 - Béjaïa', '07 - Biskra', '08 - Béchar', '09 - Blida', '10 - Bouira',
        '11 - Tamanrasset', '12 - Tébessa', '13 - Tlemcen', '14 - Tiaret', '15 - Tizi Ouzou',
        '16 - Alger', '17 - Djelfa', '18 - Jijel', '19 - Sétif', '20 - Saïda',
        '21 - Skikda', '22 - Sidi Bel Abbès', '23 - Annaba', '24 - Guelma', '25 - Constantine',
        '26 - Médéa', '27 - Mostaganem', '28 - M\'Sila', '29 - Mascara', '30 - Ouargla',
        '31 - Oran', '32 - El Bayadh', '33 - Illizi', '34 - Bordj Bou Arréridj', '35 - Boumerdès',
        '36 - El Tarf', '37 - Tindouf', '38 - Tissemsilt', '39 - El Oued', '40 - Khenchela',
        '41 - Souk Ahras', '42 - Tipaza', '43 - Mila', '44 - Aïn Defla', '45 - Naâma',
        '46 - Aïn Témouchent', '47 - Ghardaïa', '48 - Relizane', '49 - El M\'Ghair', '50 - El Meniaa',
        '51 - Ouled Djellal', '52 - Bordj Badji Mokhtar', '53 - Béni Abbès', '54 - Timimoun',
        '55 - Touggourt', '56 - Djanet', '57 - In Salah', '58 - In Guezzam'
    ];

    const skillCategories = [
        { name: 'Front-end', skills: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Angular', 'HTML/CSS'] },
        { name: 'Back-end', skills: ['Node.js', 'Express', 'Python', 'Django', 'Go', 'PHP'] },
        { name: 'Mobile', skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'] },
        { name: 'Database', skills: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Firebase'] },
        { name: 'DevOps', skills: ['Docker', 'AWS', 'CI/CD', 'Linux'] }
    ];

    return (
        <div className="bg-[#F8FAFC] dark:bg-[#121121] font-body text-slate-900 dark:text-white antialiased min-h-screen flex flex-col">
            {/* Top Navbar */}
            <StudentNavbar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-4 md:px-8 lg:px-12 py-8 gap-8">
                {/* Sticky Filter Bar Section */}
                <section className="sticky top-[73px] z-40 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-4 bg-[#F8FAFC]/95 dark:bg-[#121121]/95 backdrop-blur-sm transition-all duration-300">
                    <div className="max-w-[960px] mx-auto flex flex-col md:flex-row gap-4 items-center">
                        {/* Search Input */}
                        <div className="relative w-full md:flex-1 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#4F46E5]">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                className="block w-full pl-12 pr-10 py-3.5 bg-white dark:bg-slate-800 dark:text-white border-0 rounded-full text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-[#4F46E5] shadow-sm group-hover:shadow-lg transition-all duration-300 text-base font-medium outline-none"
                                placeholder="React, Civil Engineering, Marketing..."
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    onClick={() => setSearchQuery('')}
                                    type="button"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            )}
                        </div>
                        {/* Filters */}
                        <div className="flex gap-3 overflow-x-auto md:overflow-visible w-full md:w-auto pb-2 md:pb-0 scrollbar-hide" ref={filterRef}>
                            {/* Wilaya Filter */}
                            <div className="relative">
                                {activeFilters.wilaya ? (
                                    <span className="flex items-center gap-1.5 pl-3 pr-2 py-2 bg-[#4F46E5]/10 text-[#4F46E5] rounded-full text-sm font-semibold border border-[#4F46E5]/30 shadow-sm whitespace-nowrap cursor-default">
                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                        {activeFilters.wilaya}
                                        <button onClick={() => clearFilter('wilaya')} className="ml-0.5 rounded-full hover:bg-[#4F46E5]/20 p-0.5 transition-colors"><span className="material-symbols-outlined text-[14px]">close</span></button>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setOpenFilter(openFilter === 'wilaya' ? null : 'wilaya')}
                                        className={`flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-slate-900 dark:text-white border shadow-sm hover:shadow-md transition-all whitespace-nowrap ${openFilter === 'wilaya' ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20' : 'border-transparent hover:border-[#4F46E5]/30'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">location_on</span>
                                        Wilaya
                                        <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform ${openFilter === 'wilaya' ? 'rotate-180' : ''}`}>expand_more</span>
                                    </button>
                                )}
                                {openFilter === 'wilaya' && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Wilaya</span>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {wilayas.map((w) => (
                                                <button key={w} className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${activeFilters.wilaya === w ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-[#4F46E5]/5 hover:text-[#4F46E5]'}`} onClick={() => applyFilter('wilaya', w)}>
                                                    {w}
                                                    {activeFilters.wilaya === w && <span className="material-symbols-outlined text-[16px]">check</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Duration Filter */}
                            <div className="relative">
                                {activeFilters.duration ? (
                                    <span className="flex items-center gap-1.5 pl-3 pr-2 py-2 bg-[#4F46E5]/10 text-[#4F46E5] rounded-full text-sm font-semibold border border-[#4F46E5]/30 shadow-sm whitespace-nowrap cursor-default">
                                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                                        {activeFilters.duration} {activeFilters.duration === '1' ? 'Month' : 'Months'}
                                        <button onClick={() => clearFilter('duration')} className="ml-0.5 rounded-full hover:bg-[#4F46E5]/20 p-0.5 transition-colors"><span className="material-symbols-outlined text-[14px]">close</span></button>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setOpenFilter(openFilter === 'duration' ? null : 'duration')}
                                        className={`flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-slate-900 dark:text-white border shadow-sm hover:shadow-md transition-all whitespace-nowrap ${openFilter === 'duration' ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20' : 'border-transparent hover:border-[#4F46E5]/30'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">schedule</span>
                                        Duration
                                        <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform ${openFilter === 'duration' ? 'rotate-180' : ''}`}>expand_more</span>
                                    </button>
                                )}
                                {openFilter === 'duration' && (
                                    <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Duration</span>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                                <button key={m} className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${activeFilters.duration === String(m) ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-[#4F46E5]/5 hover:text-[#4F46E5]'}`} onClick={() => applyFilter('duration', String(m))}>
                                                    {m} {m === 1 ? 'Month' : 'Months'}
                                                    {activeFilters.duration === String(m) && <span className="material-symbols-outlined text-[16px]">check</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Type Filter */}
                            <div className="relative">
                                {activeFilters.type ? (
                                    <span className="flex items-center gap-1.5 pl-3 pr-2 py-2 bg-[#4F46E5]/10 text-[#4F46E5] rounded-full text-sm font-semibold border border-[#4F46E5]/30 shadow-sm whitespace-nowrap cursor-default">
                                        <span className="material-symbols-outlined text-[16px]">laptop_mac</span>
                                        {activeFilters.type}
                                        <button onClick={() => clearFilter('type')} className="ml-0.5 rounded-full hover:bg-[#4F46E5]/20 p-0.5 transition-colors"><span className="material-symbols-outlined text-[14px]">close</span></button>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setOpenFilter(openFilter === 'type' ? null : 'type')}
                                        className={`flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-slate-900 dark:text-white border shadow-sm hover:shadow-md transition-all whitespace-nowrap ${openFilter === 'type' ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20' : 'border-transparent hover:border-[#4F46E5]/30'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">laptop_mac</span>
                                        Remote / Onsite
                                        <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform ${openFilter === 'type' ? 'rotate-180' : ''}`}>expand_more</span>
                                    </button>
                                )}
                                {openFilter === 'type' && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Internship Type</span>
                                        </div>
                                        <div>
                                            {['PFE', 'Remote', 'Perfectionnement', 'Observation'].map((type) => (
                                                <button key={type} className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3 ${activeFilters.type === type ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-[#4F46E5]/5 hover:text-[#4F46E5]'}`} onClick={() => applyFilter('type', type)}>
                                                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                                                        {type === 'PFE' ? 'school' : type === 'Remote' ? 'home' : type === 'Perfectionnement' ? 'build' : 'visibility'}
                                                    </span>
                                                    {type}
                                                    {activeFilters.type === type && <span className="material-symbols-outlined text-[16px] ml-auto">check</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Skills / Tech Filter */}
                            <div className="relative">
                                {activeFilters.skill ? (
                                    <span className="flex items-center gap-1.5 pl-3 pr-2 py-2 bg-[#4F46E5]/10 text-[#4F46E5] rounded-full text-sm font-semibold border border-[#4F46E5]/30 shadow-sm whitespace-nowrap cursor-default">
                                        <span className="material-symbols-outlined text-[16px]">code</span>
                                        {activeFilters.skill}
                                        <button onClick={() => clearFilter('skill')} className="ml-0.5 rounded-full hover:bg-[#4F46E5]/20 p-0.5 transition-colors"><span className="material-symbols-outlined text-[14px]">close</span></button>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setOpenFilter(openFilter === 'skills' ? null : 'skills')}
                                        className={`flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-slate-900 dark:text-white border shadow-sm hover:shadow-md transition-all whitespace-nowrap ${openFilter === 'skills' ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20' : 'border-transparent hover:border-[#4F46E5]/30'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">code</span>
                                        Skills / Tech
                                        <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform ${openFilter === 'skills' ? 'rotate-180' : ''}`}>expand_more</span>
                                    </button>
                                )}
                                {openFilter === 'skills' && (
                                    <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Skills & Technologies</span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto p-2">
                                            {skillCategories.map((cat) => (
                                                <div key={cat.name} className="mb-3 last:mb-0">
                                                    <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">{cat.name}</div>
                                                    <div className="flex flex-wrap gap-1.5 px-2">
                                                        {cat.skills.map((skill) => (
                                                            <button
                                                                key={skill}
                                                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${activeFilters.skill === skill
                                                                    ? 'border-[#4F46E5] text-[#4F46E5] bg-[#4F46E5]/10'
                                                                    : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-600 hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5'
                                                                    }`}
                                                                onClick={() => applyFilter('skill', skill)}
                                                            >
                                                                {skill}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Clear All Button */}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearAllFilters}
                                    className="flex items-center gap-1.5 px-4 py-2 text-slate-500 hover:text-[#4F46E5] dark:hover:text-[#4F46E5] text-sm font-bold transition-all whitespace-nowrap hover:bg-white dark:hover:bg-slate-800 rounded-full"
                                >
                                    <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Stats / Subheader */}
                <section className="max-w-[1200px] mx-auto w-full flex justify-between items-end pb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {searchQuery ? `Results for "${searchQuery}"` : hasActiveFilters ? 'Filtered Results' : 'Recommended for You'}
                        </h1>
                        <p className="text-slate-500 text-sm">
                            {hasActiveFilters ? 'Showing offers matching your selected filters.' : 'Browse the latest opportunities available on the platform.'}
                        </p>
                    </div>
                    <div className="hidden sm:block text-sm font-medium text-slate-500">
                        Showing <span className="text-slate-900 dark:text-white font-bold">{filteredOffers.length}</span> opportunities
                    </div>
                </section>

                {/* Opportunity Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1200px] mx-auto w-full pb-12">
                    {offersLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse h-72"></div>
                        ))
                    ) : filteredOffers.length === 0 ? (
                        <div className="col-span-3 text-center py-20 text-slate-400">
                            <span className="material-symbols-outlined text-5xl mb-4 block">{searchQuery ? 'search_off' : 'inbox'}</span>
                            <p className="text-lg font-semibold">
                                {searchQuery ? `Offer not found for "${searchQuery}"` : 'No offers available yet.'}
                            </p>
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="mt-4 text-sm text-[#4F46E5] hover:underline font-medium">Clear search</button>
                            )}
                        </div>
                    ) : (
                        filteredOffers.map((offer) => {
                            // Flatten all tags from all techStack categories
                            const allTags = offer.techStack
                                ? offer.techStack.flatMap(stack => stack.tags || [])
                                : [];

                            return (
                                <article
                                    key={offer._id}
                                    onClick={() => navigate(`/offer-details/${offer._id}`)}
                                    className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/50 overflow-hidden">
                                                {offer.company?.logo ? (
                                                    <img alt={`${offer.company?.name} logo`} className="w-full h-full object-cover" src={offer.company.logo} />
                                                ) : (
                                                    <span className="material-symbols-outlined text-2xl text-indigo-400">corporate_fare</span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-[#4F46E5] transition-colors">{offer.title}</h3>
                                                <p className="text-sm text-slate-500 font-medium mt-0.5">
                                                    {offer.company?.name || 'Company'} • {offer.wilaya || 'Algeria'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    {offer.internshipType && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-md text-[11px] font-semibold border border-indigo-100 dark:border-indigo-800/40">
                                                            <span className="material-symbols-outlined text-[12px]">school</span>
                                                            {offer.internshipType}
                                                        </span>
                                                    )}
                                                    {offer.durationMonths && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-md text-[11px] font-semibold border border-slate-100 dark:border-slate-600">
                                                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                                                            {offer.durationMonths} {offer.durationMonths === 1 ? 'Month' : 'Months'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Match gauge */}
                                        {(() => {
                                            const score = offer.matchPercentage !== undefined ? Math.round(offer.matchPercentage) : 0;
                                            const color = score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500';
                                            return (
                                                <div className="relative w-12 h-12 flex items-center justify-center shrink-0" title={`${score}% Match`}>
                                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                        <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                                        <path className={`${color} drop-shadow-sm`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${score}, 100`} strokeWidth="3"></path>
                                                    </svg>
                                                    <span className="absolute text-[10px] font-bold text-slate-900 dark:text-white">{score}%</span>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Tech Stack Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {allTags.slice(0, 4).map((tag, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-mono border border-slate-100 dark:border-slate-600">
                                                {tag}
                                            </span>
                                        ))}
                                        {allTags.length > 4 && (
                                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-md text-xs font-mono border border-slate-100 dark:border-slate-600">
                                                +{allTags.length - 4} more
                                            </span>
                                        )}
                                        {allTags.length === 0 && (
                                            <span className="text-xs text-slate-400 italic">No specific skills listed</span>
                                        )}
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                                        {offer.description || 'No description available.'}
                                    </p>

                                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-50 dark:border-slate-700">
                                        {(() => {
                                            const isClosed = offer.status === 'Closed' || (offer.endDateOfApplay && moment().isAfter(moment(offer.endDateOfApplay).endOf('day')));
                                            return (
                                                <button
                                                    onClick={(e) => handleApply(e, offer._id)}
                                                    disabled={applyingTo === offer._id || offer.isApplied || isClosed}
                                                    className={`flex-1 font-semibold py-2.5 px-4 rounded-full transition-all flex items-center justify-center gap-2 ${offer.isApplied ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 cursor-default' : (isClosed ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700' : (applyingTo === offer._id ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-[#4F46E5] hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none'))}`}
                                                >
                                                    {offer.isApplied ? 'Applied' : (isClosed ? 'Offer Closed' : (applyingTo === offer._id ? 'Applying...' : 'Apply Now'))}
                                                    {offer.isApplied && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                                                    {isClosed && <span className="material-symbols-outlined text-[18px]">lock</span>}
                                                    {applyingTo === offer._id && <span className="material-symbols-outlined text-[16px] animate-spin">hourglass_empty</span>}
                                                </button>
                                            );
                                        })()}
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>


                {/* Pagination / Load More */}
                {hasMore && (
                    <div className="flex justify-center pb-12">
                        <button onClick={() => setLimit(prev => prev + 6)} className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-all shadow-sm">
                            Show More Opportunities
                            <span className="material-symbols-outlined text-[18px]">expand_more</span>
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InternshipOffers;
