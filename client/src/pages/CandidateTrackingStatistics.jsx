import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import CompanyNavbar from '../components/CompanyNavbar';
import CompanySidebar from '../components/CompanySidebar';
import ActionSuccessConfirmation from '../components/ActionSuccessConfirmation';
import ActionRejectionConfirmation from '../components/ActionRejectionConfirmation';
import useSocket from '../hooks/useSocket';

const CandidateTrackingStatistics = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLang();
    const socket = useSocket();
    const searchParams = new URLSearchParams(location.search);
    const initialSearch = searchParams.get('search') || '';
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [searchQuery, setSearchQuery] = useState(initialSearch);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        if (search !== null) {
            setSearchQuery(search);
        }
    }, [location.search]);
    const [activeFilters, setActiveFilters] = useState({
        location: '',
        type: '',
        status: '',
        offer: '',
        date: '',
        skills: ''
    });
    const [openFilter, setOpenFilter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const filterRef = useRef(null);
    const PAGE_SIZE = 4;

    const fetchData = async () => {
        try {
            const companyRes = await fetch('/api/company/me');
            if (companyRes.ok) {
                const companyData = await companyRes.json();
                setCompany(companyData.user);
            }
            const appRes = await fetch('/api/company/applications');
            if (appRes.ok) {
                const appData = await appRes.json();
                setApplications(appData.applications || []);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        
        // Sync data when the user returns to this tab
        window.addEventListener('focus', fetchData);
        return () => window.removeEventListener('focus', fetchData);
    }, []);

    // ── Real-time: patch status instantly when company updates application ──
    useEffect(() => {
        if (!socket) return;
        const handleStatusChanged = (payload) => {
            setApplications(prev =>
                prev.map(app =>
                    app._id === payload.applicationId
                        ? { ...app, status: payload.status }
                        : app
                )
            );
        };
        socket.on('application:statusChanged', handleStatusChanged);
        return () => socket.off('application:statusChanged', handleStatusChanged);
    }, [socket]);

    // ── Real-time: when a new application arrives, refresh the list ──
    useEffect(() => {
        if (!socket) return;
        const handleNewApplication = () => { fetchData(); };
        socket.on('application:new', handleNewApplication);
        return () => socket.off('application:new', handleNewApplication);
    }, [socket]);

    const filteredApplications = applications
        .filter(app => app.studentId && app.offerId) // Ensure integrity
        .filter(app => {
            const matchesSearch = app.studentId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLocation = !activeFilters.location || app.offerId?.wilaya === activeFilters.location;
            const matchesType = !activeFilters.type || app.offerId?.internshipType === activeFilters.type;
            const matchesStatus = !activeFilters.status || app.status === activeFilters.status;
            const matchesOffer = !activeFilters.offer || app.offerId?.title === activeFilters.offer;
            const matchesSkill = !activeFilters.skills || (app.studentId?.skills || []).some(s => s.toLowerCase() === activeFilters.skills.toLowerCase());
            return matchesSearch && matchesLocation && matchesType && matchesStatus && matchesOffer && matchesSkill;
        })
        .sort((a, b) => {
            if (activeFilters.date === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (activeFilters.date === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            return 0; // no sort applied
        });

    const offerTitles = [...new Set(applications.map(app => app.offerId?.title).filter(Boolean))];
    const allSkills = [...new Set(applications.flatMap(app => app.studentId?.skills || []).map(s => s.trim()))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
    const totalApplicants = filteredApplications.length;
    const totalPages = Math.ceil(totalApplicants / PAGE_SIZE);
    const paginatedApplications = filteredApplications.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const _showingFrom = totalApplicants === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const _showingTo = Math.min(currentPage * PAGE_SIZE, totalApplicants);
    const averageMatch = totalApplicants > 0
        ? Math.round(filteredApplications.reduce((acc, curr) => acc + curr.matchPercentage, 0) / totalApplicants)
        : 0;

    const pendingFiltered = filteredApplications.filter(app => app.status === 'applied' || app.status === 'on hold').length;
    
    const acceptedAllApps = applications.filter(app => app.status === 'accepted' || app.status === 'validated').length;
    
    const highlyMatched = filteredApplications.filter(app => app.matchPercentage >= 70).length;


    const wilayas = [
        '01 - Adrar', '02 - Chlef', '03 - Laghouat', '04 - Oum El Bouaghi', '05 - Batna',
        '06 - Béjaïa', '07 - Biskra', '08 - Béchar', '09 - Blida', '10 - Bouira',
        '11 - Tamanrasset', '12 - Tébessa', '13 - Tlemcen', '14 - Tiaret', '15 - Tizi Ouzou',
        '16 - Alger', '17 - Djelfa', '18 - Jijel', '19 - Sétif', '20 - Saïda',
        '21 - Skikda', '22 - Sidi Bel Abbès', '23 - Annaba', '24 - Guelma', '25 - Constantine',
        '26 - Médéa', '27 - Mostaganem', "28 - M'Sila", '29 - Mascara', '30 - Ouargla',
        '31 - Oran', '32 - El Bayadh', '33 - Illizi', '34 - Bordj Bou Arréridj', '35 - Boumerdès',
        '36 - El Tarf', '37 - Tindouf', '38 - Tissemsilt', '39 - El Oued', '40 - Khenchela',
        '41 - Souk Ahras', '42 - Tipaza', '43 - Mila', '44 - Aïn Defla', '45 - Naâma',
        '46 - Aïn Témouchent', '47 - Ghardaïa', '48 - Relizane', "49 - El M'Ghair", '50 - El Meniaa',
        '51 - Ouled Djellal', '52 - Bordj Badji Mokhtar', '53 - Béni Abbès', '54 - Timimoun',
        '55 - Touggourt', '56 - Djanet', '57 - In Salah', '58 - In Guezzam'
    ];

    const itCategories = [
        { id: 'front', name: 'Front-end', skills: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Angular', 'HTML/CSS', 'TypeScript', 'JavaScript', 'Svelte', 'Bootstrap', 'Sass', 'jQuery'] },
        { id: 'back', name: 'Back-end', skills: ['Node.js', 'Express', 'Python', 'Django', 'Go', 'PHP', 'Java', 'C++', 'Rust', 'C#', '.NET', 'Ruby', 'Laravel', 'Flask', 'FastAPI', 'Spring Boot', 'Scala', 'R'] },
        { id: 'mobile', name: 'Mobile', skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Dart', 'Ionic'] },
        { id: 'database', name: 'Database', skills: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Firebase', 'SQL', 'SQLite', 'Oracle', 'Supabase'] },
        { id: 'devops', name: 'DevOps', skills: ['Docker', 'AWS', 'CI/CD', 'Linux', 'Git', 'Kubernetes', 'Terraform', 'Jenkins', 'Nginx', 'Azure', 'Google Cloud', 'Ansible'] },
        { id: 'ai', name: 'AI & Data Science', skills: ['TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Jupyter', 'OpenCV', 'Matlab', 'Keras'] }
    ];

    const ecommerceCategories = [
        { id: 'ecommerce1', name: 'E-commerce & Digital Business', skills: ['Shopify', 'WooCommerce', 'PrestaShop', 'Magento', 'Supply Chain', 'Dropshipping', 'Inventory Management', 'Payment Gateways'] },
        { id: 'ecommerce2', name: 'Digital Marketing & SEO', skills: ['SEO', 'Google Analytics', 'Social Media Management', 'Facebook Ads', 'Google Ads', 'Copywriting', 'Email Marketing', 'Content Strategy'] },
        { id: 'ecommerce3', name: 'Management & Business Analysis', skills: ['Project Management', 'Agile/Scrum', 'Business Analysis', 'CRM (Salesforce, HubSpot)', 'Market Research', 'Data Entry'] },
        { id: 'ecommerce4', name: 'Design & Multimedia', skills: ['Adobe Photoshop', 'Illustrator', 'Premiere Pro', 'Figma', 'Canva', 'Blender', 'After Effects', 'Video Editing', 'Brand Identity', 'Graphic Design', 'Product Photography'] }
    ];

    const psychologyCategories = [
        { id: 'psychology1', name: 'HR & Organizational Psychology', skills: ['Recruitment', 'Talent Acquisition', 'Organizational Behavior', 'Employee Well-being', 'Conflict Resolution', 'Training & Development', 'Psychometric Testing'] },
        { id: 'psychology2', name: 'Clinical Psychology & Healthcare', skills: ['Clinical Assessment', 'Cognitive Behavioral Therapy (CBT)', 'Patient Counseling', 'Child Psychology', 'Neuropsychology', 'Group Therapy', 'Case Management'] },
        { id: 'psychology3', name: 'Educational & Social Psychology', skills: ['Career Guidance', 'Special Education', 'Developmental Psychology', 'Speech Therapy (Orthophony)', 'Behavioral Intervention', 'Student Counseling'] }
    ];

    const sportCategories = [
        { id: 'sport1', name: 'Coaching & Fitness', skills: ['Sports Coaching', 'Personal Training', 'Fitness Assessment', 'Strength & Conditioning'] },
        { id: 'sport2', name: 'Health & Therapy', skills: ['Biomechanics', 'Athletic Therapy', 'Exercise Physiology', 'Kinesiology', 'Rehabilitation', 'First Aid', 'CPR'] },
        { id: 'sport3', name: 'Management & Business', skills: ['Sports Management', 'Event Planning', 'Sports Psychology', 'Sports Nutrition'] }
    ];

    const skillCategories = [
        ...itCategories,
        ...ecommerceCategories,
        ...psychologyCategories,
        ...sportCategories
    ];

    const groupedSkills = skillCategories.map(cat => ({
        ...cat,
        availableSkills: cat.skills.filter(s => allSkills.some(as => as.toLowerCase() === s.toLowerCase()))
    })).filter(cat => cat.availableSkills.length > 0);

    const categorizedSkillNames = new Set(skillCategories.flatMap(c => c.skills).map(s => s.toLowerCase()));
    const otherSkills = allSkills.filter(s => !categorizedSkillNames.has(s.toLowerCase()));

    const applyFilter = (key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
        setOpenFilter(null);
    };

    const clearFilters = () => {
        setActiveFilters({ location: '', type: '', status: '', offer: '', date: '', skills: '' });
        setSearchQuery('');
        setCurrentPage(1);
    };

    // Reset to page 1 whenever filters or search change
    React.useEffect(() => { setCurrentPage(1); }, [searchQuery, activeFilters]);

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const response = await fetch(`/api/applications/${applicationId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                // Update local state
                setApplications(prev => prev.map(app =>
                    app._id === applicationId ? { ...app, status: newStatus, statusChangedAt: data.application.statusChangedAt } : app
                ));
                if (newStatus === 'accepted') {
                    setIsSuccessModalOpen(true);
                } else if (newStatus === 'rejected') {
                    setIsRejectionModalOpen(true);
                }
            } else {
                alert(data.error || 'Failed to update status');
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert('An error occurred while updating status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
            case 'admin_rejected': return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800';
            case 'validated': return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
            case 'on hold': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
            default: return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 font-body antialiased text-slate-900 dark:text-slate-100 min-h-screen">
            <CompanyNavbar company={company} />
            <CompanySidebar company={company} activePage="applications" />

            {/* Main Content */}
            <main className="md:ml-64 pt-20 p-6 min-h-screen">
                <div className="max-w-full mx-auto">

                    {/* Page Title */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black font-header tracking-tight text-slate-900 dark:text-white leading-tight">
                                {t('candidateTracking.title')}
                            </h1>
                            <p className="text-slate-500 font-medium text-sm mt-1">
                                {t('candidateTracking.subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex items-center gap-4 mb-8 flex-wrap">
                        {/* Search Bar */}
                        <div className="relative flex-1 min-w-[200px] group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input
                                type="text"
                                placeholder={t('candidateTracking.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-700 dark:text-slate-200 shadow-sm"
                            />
                        </div>

                        {/* Filter Pills */}
                        <div className="flex flex-wrap items-center gap-3" ref={filterRef}>

                            {/* Offer Filter */}
                            <div className="relative">
                                {activeFilters.offer ? (
                                    <span className="flex items-center gap-1.5 pl-3 pr-2 py-2 bg-[#4F46E5]/10 text-[#4F46E5] rounded-full text-sm font-semibold border border-[#4F46E5]/30 shadow-sm whitespace-nowrap cursor-default">
                                        <span className="material-symbols-outlined text-lg">work</span> {activeFilters.offer || t('candidateTracking.filters.offer')}
                                        <button onClick={() => applyFilter('offer', '')} className="ml-0.5 rounded-full hover:bg-[#4F46E5]/20 p-0.5 transition-colors">
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setOpenFilter(openFilter === 'offer' ? null : 'offer')}
                                        className={`flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-slate-900 dark:text-white border shadow-sm hover:shadow-md transition-all whitespace-nowrap ${openFilter === 'offer' ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20' : 'border-transparent hover:border-[#4F46E5]/30'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">work</span>
                                        {t('candidateTracking.filters.offer')}
                                        <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform ${openFilter === 'offer' ? 'rotate-180' : ''}`}>expand_more</span>
                                    </button>
                                )}
                                {openFilter === 'offer' && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Job Offer</span>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {offerTitles.map(title => (
                                                <button
                                                    key={title}
                                                    onClick={() => applyFilter('offer', title)}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${activeFilters.offer === title ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-[#4F46E5]/5 hover:text-[#4F46E5]'}`}
                                                >
                                                    {title}
                                                    {activeFilters.offer === title && <span className="material-symbols-outlined text-[16px]">check</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                {activeFilters.status ? (
                                    <span className="flex items-center gap-1.5 pl-3 pr-2 py-2 bg-[#4F46E5]/10 text-[#4F46E5] rounded-full text-sm font-semibold border border-[#4F46E5]/30 shadow-sm whitespace-nowrap cursor-default">
                                        <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
                                        {activeFilters.status.charAt(0).toUpperCase() + activeFilters.status.slice(1)}
                                        <button onClick={() => applyFilter('status', '')} className="ml-0.5 rounded-full hover:bg-[#4F46E5]/20 p-0.5 transition-colors">
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setOpenFilter(openFilter === 'status' ? null : 'status')}
                                        className={`flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-slate-900 dark:text-white border shadow-sm hover:shadow-md transition-all whitespace-nowrap ${openFilter === 'status' ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20' : 'border-transparent hover:border-[#4F46E5]/30'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">clinical_notes</span>
                                        {t('candidateTracking.filters.status')}
                                        <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform ${openFilter === 'status' ? 'rotate-180' : ''}`}>expand_more</span>
                                    </button>
                                )}
                                {openFilter === 'status' && (
                                    <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Application Status</span>
                                        </div>
                                        <div>
                                            {['applied', 'accepted', 'rejected', 'validated', 'on hold'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => applyFilter('status', status)}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${activeFilters.status === status ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-[#4F46E5]/5 hover:text-[#4F46E5]'}`}
                                                >
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    {activeFilters.status === status && <span className="material-symbols-outlined text-[16px]">check</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Location Filter */}
                            <div className="relative">
                                {activeFilters.location ? (
                                    <span className="flex items-center gap-1.5 pl-3 pr-2 py-2 bg-[#4F46E5]/10 text-[#4F46E5] rounded-full text-sm font-semibold border border-[#4F46E5]/30 shadow-sm whitespace-nowrap cursor-default">
                                        <span className="material-symbols-outlined text-lg">location_on</span> {activeFilters.location || t('candidateTracking.filters.location')}
                                        <button onClick={() => applyFilter('location', '')} className="ml-0.5 rounded-full hover:bg-[#4F46E5]/20 p-0.5 transition-colors">
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setOpenFilter(openFilter === 'location' ? null : 'location')}
                                        className={`flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-slate-900 dark:text-white border shadow-sm hover:shadow-md transition-all whitespace-nowrap ${openFilter === 'location' ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20' : 'border-transparent hover:border-[#4F46E5]/30'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">location_on</span>
                                        {t('candidateTracking.filters.location')}
                                        <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform ${openFilter === 'location' ? 'rotate-180' : ''}`}>expand_more</span>
                                    </button>
                                )}
                                {openFilter === 'location' && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Wilaya</span>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {wilayas.map((w) => (
                                                <button
                                                    key={w}
                                                    onClick={() => applyFilter('location', w)}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${activeFilters.location === w ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-[#4F46E5]/5 hover:text-[#4F46E5]'}`}
                                                >
                                                    {w}
                                                    {activeFilters.location === w && <span className="material-symbols-outlined text-[16px]">check</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Date Filter */}
                            <div className="relative">
                                {activeFilters.date ? (
                                    <span className="flex items-center gap-1.5 pl-3 pr-2 py-2 bg-[#4F46E5]/10 text-[#4F46E5] rounded-full text-sm font-semibold border border-[#4F46E5]/30 shadow-sm whitespace-nowrap cursor-default">
                                        <span className="material-symbols-outlined text-lg">event</span> {activeFilters.date === 'newest' ? t('candidateTracking.filters.newest') : activeFilters.date === 'oldest' ? t('candidateTracking.filters.oldest') : t('candidateTracking.filters.date')}
                                        <button onClick={() => applyFilter('date', '')} className="ml-0.5 rounded-full hover:bg-[#4F46E5]/20 p-0.5 transition-colors">
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setOpenFilter(openFilter === 'date' ? null : 'date')}
                                        className={`flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-slate-900 dark:text-white border shadow-sm hover:shadow-md transition-all whitespace-nowrap ${openFilter === 'date' ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20' : 'border-transparent hover:border-[#4F46E5]/30'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">date_range</span>
                                        {t('candidateTracking.filters.date')}
                                        <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform ${openFilter === 'date' ? 'rotate-180' : ''}`}>expand_more</span>
                                    </button>
                                )}
                                {openFilter === 'date' && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Date</span>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">

                                            {['newest', 'oldest'].map((date) => (
                                                <button
                                                    key={date}
                                                    onClick={() => applyFilter('date', date)}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${activeFilters.date === date ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-[#4F46E5]/5 hover:text-[#4F46E5]'}`}
                                                >
                                                    {date === 'newest' ? t('candidateTracking.filters.newest') : t('candidateTracking.filters.oldest')}
                                                    {activeFilters.date === date && <span className="material-symbols-outlined text-[16px]">check</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Skills Filter */}
                            <div className="relative">
                                {activeFilters.skills ? (
                                    <span className="flex items-center gap-1.5 pl-3 pr-2 py-2 bg-[#4F46E5]/10 text-[#4F46E5] rounded-full text-sm font-semibold border border-[#4F46E5]/30 shadow-sm whitespace-nowrap cursor-default">
                                        <span className="material-symbols-outlined text-lg">code</span> {activeFilters.skills}
                                        <button onClick={() => applyFilter('skills', '')} className="ml-0.5 rounded-full hover:bg-[#4F46E5]/20 p-0.5 transition-colors">
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setOpenFilter(openFilter === 'skills' ? null : 'skills')}
                                        className={`flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-slate-900 dark:text-white border shadow-sm hover:shadow-md transition-all whitespace-nowrap ${openFilter === 'skills' ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20' : 'border-transparent hover:border-[#4F46E5]/30'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">code</span>
                                        {t('candidateTracking.filters.skills')}
                                        <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform ${openFilter === 'skills' ? 'rotate-180' : ''}`}>expand_more</span>
                                    </button>
                                )}
                                {openFilter === 'skills' && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Skill</span>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {groupedSkills.map((category) => (
                                                <div key={category.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 pb-1 mb-1 last:pb-0 last:mb-0">
                                                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
                                                        {category.name}
                                                    </div>
                                                    {category.availableSkills.map((skill) => (
                                                        <button
                                                            key={skill}
                                                            onClick={() => applyFilter('skills', skill)}
                                                            className={`w-full text-left px-6 py-2 text-sm transition-colors flex items-center justify-between ${activeFilters.skills === skill ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-[#4F46E5]/5 hover:text-[#4F46E5]'}`}
                                                        >
                                                            {skill}
                                                            {activeFilters.skills === skill && <span className="material-symbols-outlined text-[16px]">check</span>}
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                            {otherSkills.length > 0 && (
                                                <div className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 pb-1 mb-1 last:pb-0 last:mb-0">
                                                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
                                                        Other Skills
                                                    </div>
                                                    {otherSkills.map(skill => (
                                                        <button
                                                            key={skill}
                                                            onClick={() => applyFilter('skills', skill)}
                                                            className={`w-full text-left px-6 py-2 text-sm transition-colors flex items-center justify-between ${activeFilters.skills === skill ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-[#4F46E5]/5 hover:text-[#4F46E5]'}`}
                                                        >
                                                            {skill}
                                                            {activeFilters.skills === skill && <span className="material-symbols-outlined text-[16px]">check</span>}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {allSkills.length === 0 && (
                                                <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                                    No skills found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Clear All Button */}
                            {(activeFilters.location || activeFilters.type || activeFilters.status || activeFilters.offer || activeFilters.skills || searchQuery) && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1.5 px-4 py-2 text-slate-500 hover:text-[#4F46E5] text-sm font-bold transition-all whitespace-nowrap hover:bg-white dark:hover:bg-slate-800 rounded-full"
                                >
                                    <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                                    Clear All
                                </button>
                            )}

                        </div>
                    </div>

                    {/* Candidates Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-slate-800/50">
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{t('candidateTracking.table.student')}</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{t('candidateTracking.table.university')}</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{t('candidateTracking.table.offer')}</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">{t('candidateTracking.table.date')}</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{t('candidateTracking.table.match')}</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{t('candidateTracking.table.status')}</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">{t('candidateTracking.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {loading ? (
                                        [1, 2, 3, 4].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan="7" className="px-6 py-8 bg-slate-50/20"></td>
                                            </tr>
                                        ))
                                    ) : paginatedApplications.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-20 text-center text-slate-400 font-medium">
                                                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">{t('candidateTracking.noResults')}</h4>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedApplications.map((app) => {
                                            const deadlineVal = new Date(new Date(app.offerId?.endDateOfApplay).getTime() + 10 * 24 * 60 * 60 * 1000);
                                            const isAcceptanceOverdue = new Date() > deadlineVal;
                                            return (
                                            <tr key={app._id} onClick={() => navigate(`/student-profile-recruiter/${app.studentId?._id}`)} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                                            {app.studentId?.profilePicture ? (
                                                                <img alt={app.studentId.name} className="w-full h-full object-cover" src={app.studentId.profilePicture} />
                                                            ) : (
                                                                <span className="material-symbols-outlined text-slate-400 text-2xl">person</span>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight truncate">{app.studentId?.name || 'Unknown Student'}</div>
                                                            <div className="text-[11px] text-slate-500 font-medium mt-0.5">{app.studentId?.currentYear || 'Year'} Student</div>
                                                            {app.studentId?.skills && app.studentId.skills.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-1.5 max-w-[200px]">
                                                                    {app.studentId.skills.slice(0, 3).map((skill, index) => (
                                                                        <span key={index} className="text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                    {app.studentId.skills.length > 3 && (
                                                                        <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 self-center">
                                                                            +{app.studentId.skills.length - 3}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-[13px] font-bold text-slate-600 dark:text-slate-400 max-w-[120px] truncate">
                                                    {app.studentId?.university || 'N/A'}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md max-w-[140px] truncate block">
                                                        {app.offerId?.title || 'Job Offer'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-[13px] font-medium text-slate-500">
                                                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-center">
                                                        <span className={`text-[12px] font-black px-2 py-1 rounded-md ${app.matchPercentage >= 70 ? 'bg-emerald-50 text-emerald-600' : app.matchPercentage >= 40 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                                            {app.matchPercentage}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded shadow-sm">
                                                        {app.offerId?.endDateOfApplay ? new Date(new Date(app.offerId.endDateOfApplay).getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(app.status === 'applied' && isAcceptanceOverdue ? 'rejected' : app.status)}`}>
                                                        {app.status === 'applied' && isAcceptanceOverdue ? 'rejected' : app.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {app.status === 'applied' && !isAcceptanceOverdue && (
                                                            <>
                                                                <button onClick={(e) => { e.stopPropagation(); handleStatusChange(app._id, 'accepted'); }} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-transform active:scale-[0.98]">Accept</button>
                                                                <button onClick={(e) => { e.stopPropagation(); handleStatusChange(app._id, 'rejected'); }} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-600 hover:text-rose-600 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">Refuse</button>
                                                            </>
                                                        )}
                                                        {app.status === 'applied' && isAcceptanceOverdue && (
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex flex-col items-end">
                                                                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded border border-rose-100">Decision Window Closed</span>
                                                                    <span className="text-[9px] text-slate-400 mt-0.5">Status: Automated Refusal</span>
                                                                </div>
                                                                <button onClick={(e) => { e.stopPropagation(); handleStatusChange(app._id, 'accepted'); }} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-transform active:scale-[0.98]">Accept</button>
                                                            </div>
                                                        )}
                                                        {(app.status === 'rejected' || app.status === 'refused' || app.status === 'admin_rejected') && (
                                                            <button onClick={(e) => { e.stopPropagation(); handleStatusChange(app._id, 'accepted'); }} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-transform active:scale-[0.98]">Accept</button>
                                                        )}
                                                        {app.status === 'accepted' && (
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-[14px] text-amber-500">schedule</span>
                                                                    Waiting for Admin ...
                                                                </span>
                                                            </div>
                                                        )}
                                                        {app.status === 'validated' && (
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 flex items-center gap-1 shadow-sm">
                                                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                                    Validated
                                                                </span>
                                                                <button
                                                                    className="p-2 flex items-center justify-center text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors active:scale-95 shadow-sm border border-indigo-200"
                                                                    title="View Agreement"
                                                                    onClick={(e) => { e.stopPropagation(); navigate(`/agreement/${app._id}`); }}
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">description</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                        <button
                                                            className="p-2 flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors active:scale-95 shadow-sm border border-blue-200"
                                                            title="Message Candidate"
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/application-details/${app._id}`); }}
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">chat</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                                );
                                            })
                                        )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-sm text-slate-500 font-medium">
                                    {t('candidateTracking.showing')} <span className="text-slate-900 dark:text-white font-bold">{_showingFrom}</span> {t('candidateTracking.to')} <span className="text-slate-900 dark:text-white font-bold">{_showingTo}</span> {t('candidateTracking.of')} <span className="text-slate-900 dark:text-white font-bold">{totalApplicants}</span> {t('candidateTracking.results')}
                                </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                </button>
                                <span className="px-3 text-xs font-bold text-slate-700 dark:text-slate-300">{currentPage} / {totalPages || 1}</span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-indigo-100 text-[11px] font-bold uppercase tracking-widest mb-1">Total Impact</p>
                                <h3 className="text-3xl font-black mb-4">{acceptedAllApps} Offers Made</h3>
                                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">{t('candidateTracking.stats.pending')}</p>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <span className="material-symbols-outlined text-[120px]">analytics</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-indigo-200 transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">person_search</span>
                                    </span>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">LIVE COUNT</span>
                                </div>
                                <h4 className="font-bold text-slate-500 text-sm">Filtered Candidates</h4>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{totalApplicants}</span>
                                    <span className="text-[10px] font-bold text-indigo-600">{pendingFiltered} Pending Review</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-emerald-200 transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">how_to_reg</span>
                                    </span>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">PERFORMANCE</span>
                                </div>
                                <h4 className="font-bold text-slate-500 text-sm">Average Match Score</h4>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{averageMatch}%</span>
                                    <span className="text-[10px] font-bold text-emerald-600">{highlyMatched} Highly Matched (70%+)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <ActionSuccessConfirmation isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} />
            <ActionRejectionConfirmation isOpen={isRejectionModalOpen} onClose={() => setIsRejectionModalOpen(false)} />
        </div>
    );
};

export default CandidateTrackingStatistics;
