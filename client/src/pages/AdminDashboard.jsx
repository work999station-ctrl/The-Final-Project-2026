import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';


const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        fullName: "Admin Name",
        email: "admin@university.edu",
        role: "Internship_Office_Staff",
        universityName: "University",
        profilePicture: "",
        phone: ""
    });
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [filterStatus, setFilterStatus] = useState('All Statuses');
    const [sortOrder, setSortOrder] = useState('Latest');
    const [stats, setStats] = useState({
        placedStudents: 0,
        unplacedStudents: 0
    });

    const fetchDashboardData = async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setLoading(true);
        try {
            const [userRes, appsRes, statsRes] = await Promise.all([
                fetch('/api/admin/me'),
                fetch('/api/admin/applications/pending-validation'),
                fetch('/api/admin/university-placement-stats?months=1')
            ]);

            if (userRes.ok) {
                const data = await userRes.json();
                console.log(data);
                if (data && data.user) {
                    setUser(prev => ({
                        ...prev,
                        ...data.user
                    }));
                }
            } else if (userRes.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (appsRes.ok) {
                const appsData = await appsRes.json();
                setApplications(appsData.applications || []);
            }

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                if (statsData.success && statsData.stats) {
                    setStats({
                        placedStudents: statsData.stats.placedStudents || 0,
                        unplacedStudents: statsData.stats.unplacedStudents || 0
                    });
                }
            }
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const pendingValidations = applications.filter(app => app.status === 'accepted');
    const recentPlacements = applications.filter(app => {
        if (!['accepted', 'validated'].includes(app.status)) return false;
        if (filterStatus === 'Agreement Generated') return app.status === 'validated';
        if (filterStatus === 'Pending') return app.status === 'accepted';
        return true;
    }).sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return sortOrder === 'Latest' ? dateB - dateA : dateA - dateB;
    });

    const totalStudents = stats.placedStudents + stats.unplacedStudents;
    const placedPercentage = totalStudents > 0 ? Math.round((stats.placedStudents / totalStudents) * 100) : 0;
    const unplacedPercentage = totalStudents > 0 ? 100 - placedPercentage : 0;

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white antialiased font-body min-h-screen flex flex-col">
            <AdminNavbar admin={user} />

            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar activePage="dashboard" adminUser={user} />

                {/* Main Content (Center/Right) */}
                <main className="md:ml-64 flex-1 p-8 overflow-y-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 font-headline">Admin Control Center</h1>
                            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 flex items-center gap-2 text-sm font-medium">
                                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => fetchDashboardData(true)}
                                disabled={isRefreshing}
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-60"
                            >
                                <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin' : ''}`}>sync</span>
                                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                    </div>

                    {/* Global Stats Update */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Placed Students KPI */}
                        <div className="bg-primary p-8 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-white/80 text-sm font-semibold mb-2 uppercase tracking-wider">Placed Students</p>
                                <h4 className="text-5xl font-black mb-3 font-headline">{stats.placedStudents.toLocaleString()}</h4>
                                <div className="flex items-center gap-2 text-white/90">
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                    <span className="text-xs font-semibold">{placedPercentage}% of total students</span>
                                </div>
                            </div>
                            <div className="relative z-10 w-24 h-24">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <circle className="stroke-white/20" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                                    <circle className="stroke-white" cx="18" cy="18" fill="none" r="16" strokeDasharray="100" strokeDashoffset={100 - placedPercentage} strokeLinecap="round" strokeWidth="3"></circle>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-3xl">school</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-[12rem] opacity-10 absolute -right-8 -bottom-8 pointer-events-none">groups</span>
                        </div>

                        {/* Unplaced Students KPI */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between relative overflow-hidden">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-semibold mb-2 uppercase tracking-wider">Unplaced Students</p>
                                <h4 className="text-5xl font-black text-slate-900 dark:text-white mb-3 font-headline">{stats.unplacedStudents.toLocaleString()}</h4>
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">
                                    <span className="material-symbols-outlined text-[16px]">person_search</span>
                                    <span className="text-xs font-semibold">{unplacedPercentage}% currently seeking placements</span>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-slate-900 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 dark:border-slate-800">
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-5xl">person_search</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Action Center: Pending Validation */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-4 space-y-4">
                                <div className="flex items-center justify-between xl:flex-row flex-col xl:items-center items-start gap-2 mb-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-headline">
                                        <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                                        Pending Validation
                                    </h2>
                                    <span className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tight whitespace-nowrap">High Priority</span>
                                </div>

                                <div className="space-y-4">
                                    {pendingValidations.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500 dark:text-slate-400 dark:text-slate-500">
                                            No applications pending validation.
                                        </div>
                                    ) : (
                                        pendingValidations.slice(0, 3).map(app => (
                                            <div key={app._id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                                                <div className="absolute left-0 top-3 bottom-3 w-1 bg-orange-500 rounded-r-full"></div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg font-headline">{app.studentId?.name || 'Unknown'}</h4>
                                                        <p className="text-sm text-primary font-medium">{app.studentId?.fieldOfStudy || 'Student'}</p>
                                                    </div>
                                                    <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-300 transition-colors"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-900 dark:bg-slate-900/50 rounded-xl p-4 mb-4 flex items-center gap-3 border border-slate-100 dark:border-slate-800 dark:border-slate-800">
                                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm overflow-hidden flex items-center justify-center text-slate-500 dark:text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 dark:border-slate-700">
                                                        {app.offerId?.companyId?.logo ? (
                                                            <img src={app.offerId.companyId.logo} alt={app.offerId.companyId.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium mb-0.5 uppercase tracking-wider">Accepted at</p>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{app.offerId?.companyId?.name || 'Company'}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => navigate('/candidate-tracking-admin')}
                                                    className="w-full py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 dark:text-slate-300 text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-colors group-hover:border-primary/30"
                                                >
                                                    Review & Validate <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                                </button>
                                            </div>
                                        ))
                                    )}

                                    {pendingValidations.length > 0 && (
                                        <button
                                            onClick={() => navigate('/candidate-tracking-admin')}
                                            className="w-full py-3.5 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2"
                                        >
                                            VIEW ALL ({pendingValidations.length} PENDING)
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Records Table */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 dark:border-slate-700 flex flex-wrap gap-4 justify-between items-center">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-headline">Recent Placements</h2>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => fetchDashboardData(true)}
                                            disabled={isRefreshing}
                                            title="Refresh"
                                            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 disabled:opacity-50"
                                        >
                                            <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin' : ''}`}>sync</span>
                                        </button>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm">filter_alt</span>
                                            <select 
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                                className="pl-9 pr-8 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:ring-primary focus:border-primary text-slate-600 dark:text-slate-300 appearance-none outline-none"
                                            >
                                                <option>All Statuses</option>
                                                <option>Agreement Generated</option>
                                                <option>Pending</option>
                                            </select>
                                        </div>
                                        <button 
                                            onClick={() => setSortOrder(prev => prev === 'Latest' ? 'Oldest' : 'Latest')}
                                            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            Sort: {sortOrder}
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead className="bg-slate-50 dark:bg-slate-900 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest">Student Details</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest">Company</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dept</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest">Document Status</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading data...</td>
                                                </tr>
                                            ) : recentPlacements.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500">No recent placements found.</td>
                                                </tr>
                                            ) : (
                                                recentPlacements.map((app) => (
                                                    <tr key={app._id} className="hover:bg-slate-50 dark:bg-slate-900/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black ring-2 ring-white dark:ring-slate-800 overflow-hidden">
                                                                    {app.studentId?.profilePicture ? (
                                                                        <img src={app.studentId.profilePicture} alt={app.studentId.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        app.studentId?.name?.substring(0, 2).toUpperCase() || 'ST'
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-900 dark:text-white dark:text-white">{app.studentId?.name || 'Unknown'}</p>
                                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">{app.studentId?.fieldOfStudy || 'Student'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 dark:text-slate-300">{app.offerId?.companyId?.name || 'Company'}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded uppercase tracking-wider line-clamp-1 max-w-[120px]" title={app.offerId?.title}>
                                                                {app.offerId?.title || 'Role'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {app.status === 'validated' ? (
                                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                                                                    Agreement Generated
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                                                                    Pending
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => navigate('/candidate-tracking-admin')}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-primary transition-all ml-auto opacity-0 group-hover:opacity-100"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                                    <button 
                                        onClick={() => navigate('/candidate-tracking-admin')}
                                        className="text-[11px] font-bold text-primary hover:text-primary/80 tracking-widest uppercase flex items-center gap-2 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">database</span>
                                        Access Full Academic Database
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
