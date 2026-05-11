import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';


const UniversityPlacementAnalytics = () => {
    const currentMonthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const [adminUser, setAdminUser] = useState(null);
    const [trendFilter, setTrendFilter] = useState(3);
    const [isTrendDropdownOpen, setIsTrendDropdownOpen] = useState(false);
    const [stats, setStats] = useState({
        totalStudents: 0,
        acceptedApplications: 0,
        validatedApplications: 0,
        placedStudents: 0,
        unplacedStudents: 0,
        placementPercentage: 0,
        monthlyTrends: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`/api/admin/university-placement-stats?months=${trendFilter}`, { withCredentials: true });
                console.log(res.data);
                if (res.data.success) {
                    setStats({
                        totalStudents: res.data.stats.totalStudents || 0,
                        acceptedApplications: res.data.stats.acceptedApplications || 0,
                        validatedApplications: res.data.stats.validatedApplications || 0,
                        placedStudents: res.data.stats.placedStudents || 0,
                        unplacedStudents: res.data.stats.unplacedStudents || 0,
                        placementPercentage: res.data.stats.placementPercentage || 0,
                        monthlyTrends: res.data.stats.monthlyTrends || []
                    });
                }
            } catch (err) {
                console.error("Failed to fetch placement stats", err);
            }
        };

        const fetchAdminUser = async () => {
            try {
                const adminRes = await axios.get('/api/admin/me', { withCredentials: true });
                if (adminRes.data.user) {
                    setAdminUser(adminRes.data.user);
                }
            } catch (err) {
                console.error("Failed to fetch admin user", err);
            }
        };

        fetchStats();
        fetchAdminUser();
    }, [trendFilter]);

    const generateTrendPath = (data, isArea = false) => {
        if (!data || data.length === 0) return { path: '', coordinates: [], renderData: [] };

        const renderData = data;
        const points = renderData.length;
        const maxCount = Math.max(...renderData.map(d => d.count), 10);

        const height = 140;
        const width = 600;

        const coordinates = renderData.map((d, i) => {
            const x = i * (width / (points - 1 || 1));
            const y = 160 - (d.count / maxCount) * height;
            return { x, y };
        });

        let path = `M ${coordinates[0].x} ${coordinates[0].y}`;
        for (let i = 1; i < coordinates.length; i++) {
            const cp1x = coordinates[i - 1].x + (coordinates[i].x - coordinates[i - 1].x) / 2;
            const cp1y = coordinates[i - 1].y;
            const cp2x = coordinates[i - 1].x + (coordinates[i].x - coordinates[i - 1].x) / 2;
            const cp2y = coordinates[i].y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${coordinates[i].x} ${coordinates[i].y}`;
        }

        if (isArea) {
            path += ` L ${width} 200 L 0 200 Z`;
        }
        return { path, coordinates, renderData };
    };

    const trendData = stats.monthlyTrends || [];
    const { path: trendLinePath, coordinates: trendCoords, renderData: trendRenderData } = generateTrendPath(trendData, false);
    const { path: trendAreaPath } = generateTrendPath(trendData, true);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-screen font-body">
            {/* TopNavBar */}
            <AdminNavbar admin={adminUser} />

            {/* SideNavBar */}
            <div className="hidden md:block">
                <AdminSidebar activePage="stats" adminUser={adminUser} />
            </div>

            {/* Main Content */}
            <main className="md:ml-64 pt-24 pb-12 px-6 lg:px-10">
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 font-headline">Institutional Placement Analytics</h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">Visualizing career transition performance and institutional placement metrics for Academic Year 2026.</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            Live Analytics
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                            <span className="material-symbols-outlined text-xs">calendar_today</span>
                            {currentMonthYear}
                        </span>
                    </div>
                </header>

                {/* Enhanced KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 flex justify-between items-start mb-6">
                            <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                                <span className="material-symbols-outlined text-2xl" data-icon="groups">groups</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Student Pool</span>
                                <span className="text-xs font-bold text-indigo-600">Active</span>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-extrabold mb-1 tracking-tight font-headline">{stats.totalStudents.toLocaleString()}</h3>
                            <p className="text-sm text-slate-500">Total Enrolled Candidates</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-sky-50/50 dark:bg-sky-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 flex justify-between items-start mb-6">
                            <div className="p-3 bg-sky-500 text-white rounded-xl shadow-lg shadow-sky-200 dark:shadow-none">
                                <span className="material-symbols-outlined text-2xl" data-icon="trending_up">trending_up</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Acceptances</span>
                                <span className="text-xs font-bold text-emerald-600">+15% vs LY</span>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-extrabold mb-1 tracking-tight font-headline">{stats.acceptedApplications.toLocaleString()}</h3>
                            <p className="text-sm text-slate-500">Secured in {currentMonthYear}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 flex justify-between items-start mb-6">
                            <div className="p-3 bg-indigo-900 text-white rounded-xl shadow-lg shadow-slate-200 dark:shadow-none">
                                <span className="material-symbols-outlined text-2xl" data-icon="verified">verified</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Compliance</span>
                                <span className="text-xs font-bold text-indigo-600">Validated</span>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-extrabold mb-1 tracking-tight font-headline">{stats.validatedApplications.toLocaleString()}</h3>
                            <p className="text-sm text-slate-500">Internships Certified</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Global Placement Rate Section */}
                    <div className="xl:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col items-center justify-center">
                        <div className="w-full mb-6">
                            <h2 className="font-bold text-xl mb-1 font-headline">Global Placement Rate</h2>
                            <p className="text-xs text-slate-500">Academic Year Performance Index</p>
                        </div>
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            {/* Large Donut Chart SVG */}
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle className="dark:stroke-slate-800" cx="50" cy="50" fill="transparent" r="40" stroke="#F1F5F9" strokeDasharray="251.32" strokeWidth="12"></circle>
                                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#4F46E5" strokeDasharray={`${(stats.placementPercentage / 100) * 251.32} 251.32`} strokeLinecap="round" strokeWidth="12"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-slate-900 dark:text-white">{stats.placementPercentage}%</span>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">Placed</span>
                            </div>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-4 mt-8">
                            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                                    <span className="text-xs font-bold">Placed</span>
                                </div>
                                <p className="text-xl font-bold">{stats.placedStudents.toLocaleString()}</p>
                                <p className="text-[10px] text-slate-500 uppercase">Students</p>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Unplaced</span>
                                </div>
                                <p className="text-xl font-bold">{stats.unplacedStudents.toLocaleString()}</p>
                                <p className="text-[10px] text-slate-500 uppercase">Students</p>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Trends & Categories */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Monthly Placement Trends (Area Chart Visual) */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="font-bold text-xl mb-1 font-headline">Monthly Placement Trends</h2>
                                    <p className="text-xs text-slate-500">{trendFilter === 1 ? 'Current Month Trajectory' : `${trendFilter}-Month Growth Trajectory`}</p>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-indigo-600"></div>
                                        <span className="text-[10px] font-bold uppercase text-slate-400">Placements</span>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsTrendDropdownOpen(!isTrendDropdownOpen)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase transition-colors"
                                        >
                                            <span>{trendFilter === 1 ? 'This Month' : `Last ${trendFilter} Months`}</span>
                                            <span className="material-symbols-outlined text-[14px]">expand_more</span>
                                        </button>

                                        {isTrendDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                                                <button
                                                    onClick={() => { setTrendFilter(1); setIsTrendDropdownOpen(false); }}
                                                    className={`w-full text-left px-4 py-2 text-xs font-semibold ${trendFilter === 1 ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'} transition-colors`}
                                                >
                                                    This Month
                                                </button>
                                                <button
                                                    onClick={() => { setTrendFilter(3); setIsTrendDropdownOpen(false); }}
                                                    className={`w-full text-left px-4 py-2 text-xs font-semibold ${trendFilter === 3 ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'} transition-colors`}
                                                >
                                                    Last 3 Months
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="h-48 flex items-end gap-2 relative border-b border-slate-100 dark:border-slate-800">
                                {trendData.length > 0 ? (
                                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 200">
                                        <defs>
                                            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="5%" stopColor="#4F46E5" stopOpacity="0.2"></stop>
                                                <stop offset="95%" stopColor="#4F46E5" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                        <path d={trendAreaPath} fill="url(#areaGradient)"></path>
                                        <path d={trendLinePath} fill="none" stroke="#4F46E5" strokeWidth="3"></path>
                                        {trendCoords.map((coord, i) => (
                                            <g key={i}>
                                                <circle cx={coord.x} cy={coord.y} fill="white" r="4" stroke="#4F46E5" strokeWidth="2"></circle>
                                                <text
                                                    x={coord.x}
                                                    y={coord.y - 12}
                                                    fill="#4F46E5"
                                                    className="text-[12px] font-bold"
                                                    textAnchor={i === 0 ? "start" : i === trendCoords.length - 1 ? "end" : "middle"}
                                                >
                                                    {trendRenderData && trendRenderData[i] ? trendRenderData[i].count : 0}
                                                </text>
                                            </g>
                                        ))}
                                    </svg>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">Loading trends...</div>
                                )}
                            </div>
                            <div className="flex justify-between mt-4 px-2">
                                {trendData.map((d, i) => (
                                    <span key={i} className={`text-[10px] font-bold uppercase ${i === trendData.length - 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                                        {d.month}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Top Placed Categories */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                            <h2 className="font-bold text-xl mb-6 font-headline">Top Placed Categories</h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold">Software Development</span>
                                        <span className="text-indigo-600 font-bold">482</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold">Data Analytics &amp; AI</span>
                                        <span className="text-sky-500 font-bold">310</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-sky-500 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold">Business Strategy</span>
                                        <span className="text-indigo-900 dark:text-indigo-400 font-bold">204</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-900 dark:bg-indigo-700 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold">UI/UX Design</span>
                                        <span className="text-sky-300 font-bold">135</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-sky-300 rounded-full" style={{ width: '30%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Stats & Connectivity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                        <h3 className="font-bold text-lg mb-6 font-headline">Recent System Activity</h3>
                        <div className="space-y-5">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <span className="material-symbols-outlined text-xl">add_business</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">New Partner Onboarded</p>
                                    <p className="text-xs text-slate-500">Tesla Gigafactory Berlin added to host pool.</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-600 flex-shrink-0">
                                    <span className="material-symbols-outlined text-xl">verified_user</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Compliance Milestone</p>
                                    <p className="text-xs text-slate-500">Batch #44 agreements (12 units) fully validated.</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1">5 hours ago</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            View Full Audit History
                        </button>
                    </div>

                    <div className="bg-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <circle cx="20" cy="20" fill="white" r="1"></circle>
                                <circle cx="80" cy="30" fill="white" r="1"></circle>
                                <circle cx="50" cy="70" fill="white" r="1"></circle>
                                <circle cx="30" cy="80" fill="white" r="1"></circle>
                                <circle cx="70" cy="10" fill="white" r="1"></circle>
                                <line stroke="white" strokeWidth="0.2" x1="20" x2="80" y1="20" y2="30"></line>
                                <line stroke="white" strokeWidth="0.2" x1="80" x2="50" y1="30" y2="70"></line>
                                <line stroke="white" strokeWidth="0.2" x1="50" x2="30" y1="70" y2="80"></line>
                                <line stroke="white" strokeWidth="0.2" x1="30" x2="20" y1="80" y2="20"></line>
                                <line stroke="white" strokeWidth="0.2" x1="70" x2="80" y1="10" y2="30"></line>
                            </svg>
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-2xl mb-2 font-headline">Global Network Reach</h3>
                                <p className="text-indigo-100 text-sm max-w-xs">Expanding opportunities across borders with premium industry partners.</p>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-4xl font-black font-headline">340+</p>
                                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Global Partners</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-black font-headline">12</p>
                                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Countries</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* BottomNavBar for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
                <button className="flex flex-col items-center gap-1 text-indigo-600">
                    <span className="material-symbols-outlined text-2xl" data-icon="dashboard">dashboard</span>
                    <span className="text-[10px] font-bold">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400">
                    <span className="material-symbols-outlined text-2xl" data-icon="group">group</span>
                    <span className="text-[10px] font-bold">Students</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400">
                    <span className="material-symbols-outlined text-2xl" data-icon="analytics">analytics</span>
                    <span className="text-[10px] font-bold">Data</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400">
                    <span className="material-symbols-outlined text-2xl" data-icon="settings">settings</span>
                    <span className="text-[10px] font-bold">Settings</span>
                </button>
            </nav>
        </div>
    );
};

export default UniversityPlacementAnalytics;
