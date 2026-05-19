import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import StudentNavbar from '../components/StudentNavbar';
import StudentSidebar from '../components/StudentSidebar';

const CompanyProfileStudentView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const socket = useSocket();

    const [company, setCompany] = useState(null);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = document.cookie.split('jwt=')[1]?.split(';')[0] || localStorage.getItem('token');
                const [companyRes, studentRes] = await Promise.all([
                    fetch(`/api/admin/company/${id}`, { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } }),
                    fetch('/api/student/me', { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } })
                ]);

                const companyData = await companyRes.json();
                if (companyData.success) {
                    setCompany(companyData.company);
                } else {
                    setError(companyData.error || 'Failed to fetch company profile');
                }

                if (studentRes.ok) {
                    const studentData = await studentRes.json();
                    if (studentData.user) {
                        setStudent(studentData.user);
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    // ── Real-time: patch company profile data when a company updates their profile ──
    useEffect(() => {
        if (!socket) return;
        const handleUserUpdated = (payload) => {
            if (payload.type === 'company' && payload.data && String(payload.userId) === String(id)) {
                setCompany(prev => prev ? { ...prev, ...payload.data } : prev);
            }
        };
        socket.on('user:updated', handleUserUpdated);
        return () => socket.off('user:updated', handleUserUpdated);
    }, [socket, id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-red-500 font-bold">{error}</p></div>;
    if (!company) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50"><p className="text-slate-500 text-lg">Company not found.</p><button onClick={() => navigate('/student-dashboard')} className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium">Return to Dashboard</button></div>;


    return (
        <div className="bg-slate-50 text-slate-900 antialiased min-h-screen">
            <StudentNavbar student={student} />
            <StudentSidebar student={student} activePage="offers" />

            {/* Main Content */}
            <main className="md:ml-64 pt-20 pb-12 px-6">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Main Profile Hero Card */}
                    <section className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-slate-100">
                        <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-900 relative" title="abstract geometric pattern with flowing indigo and deep violet gradients"></div>
                        <div className="px-8 pb-10 -mt-16 relative">
                            <div className="flex flex-col items-center text-center">
                                <div className="p-2 bg-white rounded-2xl shadow-lg mb-6">
                                    <div className="w-28 h-28 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 overflow-hidden shadow-sm">
                                        {company.logo ? (
                                            <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-black text-indigo-400">{company.name?.substring(0, 1)?.toUpperCase() || 'C'}</span>
                                        )}
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{company.name}</h1>
                                <p className="text-indigo-600 font-semibold text-lg">{company.tagline}</p>
                                <div className="flex items-center justify-center gap-2 text-slate-500 mt-2">
                                    <span className="material-symbols-outlined text-base">corporate_fare</span>
                                    <span>Enterprise Technology</span>
                                </div>

                                {/* Action Row */}
                                <div className="flex flex-wrap justify-center gap-3 mt-8">
                                    <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                                        Contact Company
                                    </button>
                                    <button className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                        View Active Offers
                                    </button>
                                </div>
                            </div>

                            {/* Info Grid Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 border-t border-slate-100 pt-8">
                                {/* Company Info Column */}
                                <div className="space-y-4">
                                    <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                        <span className="material-symbols-outlined text-indigo-600 text-lg">contact_page</span>
                                        Company Info
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-slate-400">language</span>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium">Website</p>
                                                <a className="text-sm font-medium text-indigo-600 hover:underline" href={company.websiteUrl}>{company.website}</a>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-slate-400">corporate_fare</span>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium">Industry</p>
                                                <p className="text-sm font-medium">{company.industry}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-slate-400">location_on</span>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium">Location</p>
                                                <p className="text-sm font-medium">{company.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-slate-400">groups</span>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium">phone Number</p>
                                                <p className="text-sm font-medium">{company.phoneNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Industry Focus Column */}
                                <div className="space-y-4">
                                    <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                        <span className="material-symbols-outlined text-indigo-600 text-lg">bolt</span>
                                        Key Sectors
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {company.keySectors.map((sector, index) => (
                                            <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${index === company.keySectors.length - 1 ? 'bg-slate-100 text-slate-600' : 'bg-indigo-50 text-indigo-700'}`}>
                                                {sector}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Mission Statement Column */}
                                <div className="space-y-4">
                                    <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                        <span className="material-symbols-outlined text-indigo-600 text-lg">stars</span>
                                        Mission
                                    </h3>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-600 leading-relaxed italic">
                                            "{company.mission}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Statistics Section */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-indigo-600 rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden h-40">
                            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/10 text-9xl">check_circle</span>
                            <div>
                                <h3 className="text-indigo-100 uppercase text-xs font-bold tracking-widest mb-1">Total Placed</h3>
                                <p className="text-5xl font-bold">{company.stats.totalPlaced}</p>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-indigo-100 text-sm">
                                <span className="material-symbols-outlined text-emerald-400 text-sm">trending_up</span>
                                <span>+12% from last year</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-40">
                            <div>
                                <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-1">Current Interns</h3>
                                <p className="text-5xl font-bold text-slate-900 tracking-tighter">{company.stats.currentInterns}</p>
                            </div>
                            <div className="mt-4 flex -space-x-2"> */}
                    {/* Mocked Avatars */}
                    {/* {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                                        <span className="material-symbols-outlined text-sm">person</span>
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">+25</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-40">
                            <div>
                                <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-1">Average Rating</h3>
                                <div className="flex items-center gap-4">
                                    <p className="text-5xl font-bold text-slate-900">{company.stats.rating}</p>
                                    <div className="flex flex-col">
                                        <div className="flex text-amber-400">
                                            {[...Array(4)].map((_, i) => <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium">{company.stats.reviews} reviews</span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                Read Reviews <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div> */}

                    {/* Recent Internship Postings Section */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900">Recent Internship Postings {company.recentPostings.length}</h2>
                            <button className="text-indigo-600 text-sm font-bold">View Archive</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {company.recentPostings.map((posting) => (
                                <div key={posting.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-indigo-200 hover:bg-indigo-50/10 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${posting.iconColor}`}>
                                            <span className="material-symbols-outlined">{posting.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{posting.title}</h4>
                                            <p className="text-sm text-slate-500">{posting.team}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {posting.tags.map(tag => (
                                            <span key={tag.label} className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${tag.classes}`}>{tag.label}</span>
                                        ))}
                                        <span className="text-[10px] text-slate-400">{posting.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default CompanyProfileStudentView;
