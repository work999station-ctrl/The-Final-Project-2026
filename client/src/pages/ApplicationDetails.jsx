import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CompanyNavbar from '../components/CompanyNavbar';
import StudentNavbar from '../components/StudentNavbar';
import moment from 'moment';

const ApplicationDetails = () => {
    const navigate = useNavigate();
    const { applicationId } = useParams();
    const [company, setCompany] = useState(null);
    const [student, setStudent] = useState(null);
    const [fetchedApp, setFetchedApp] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, status: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user
                let isCompany = false;
                const resCompany = await fetch('/api/company/me');
                if (resCompany.ok) {
                    const dataCompany = await resCompany.json();
                    if (dataCompany.user) {
                        setCompany(dataCompany.user);
                        isCompany = true;
                    }
                }
                
                if (!isCompany) {
                    const resStudent = await fetch('/api/student/me');
                    if (resStudent.ok) {
                        const dataStudent = await resStudent.json();
                        if (dataStudent.user) setStudent(dataStudent.user);
                    }
                }

                // Try to fetch application if endpoint exists
                const resApp = await fetch(`/api/company/applications/${applicationId}`);
                if (resApp.ok) {
                    const appData = await resApp.json();
                    if (appData.success && appData.application) {
                        setFetchedApp(appData.application);
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [applicationId]);

    const handleAddFeedback = async () => {
        if (!feedbackText.trim() || isSubmittingFeedback) return;
        setIsSubmittingFeedback(true);
        try {
            const res = await fetch(`/api/company/applications/${applicationId}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: feedbackText.trim() })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setFeedbackText('');
                    setFetchedApp(data.application);
                }
            } else {
                alert('Failed to send feedback.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to send feedback.');
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const handleAction = async () => {
        const newStatus = confirmationModal.status;
        if (!newStatus) return;

        setActionLoading(true);
        try {
            const res = await fetch(`/api/company/applications/${applicationId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setFetchedApp(prev => prev ? { ...prev, status: newStatus } : null);
                }
            } else {
                console.warn("Backend endpoint might not exist yet.");
                setFetchedApp(prev => prev ? { ...prev, status: newStatus } : { dummyStatus: newStatus });
            }
        } catch (err) {
            console.error(err);
            setFetchedApp(prev => prev ? { ...prev, status: newStatus } : { dummyStatus: newStatus });
        } finally {
            setActionLoading(false);
            setConfirmationModal({ isOpen: false, status: null });
        }
    };

    if (isLoading) {
        return (
            <div className="bg-background-light dark:bg-background-dark dark:bg-slate-900 min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
            </div>
        );
    }

    // Merge fetched UI with placeholder UI for development
    const appData = {
        name: fetchedApp?.studentId?.name || "Alex Rivers",
        profilePicture: fetchedApp?.studentId?.profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuBHtLMRQ_YPF-KXsydSsHAdeNDvLA79bSudtCUEIhEdz5eSgoAeIF92aIJu6E5gHFn9tpJXiNEX0XHROi2Tj8Om2O6ZAxpqTn2yNGNQnOmAeP6rnJdWiWTU6GbwBRDeyPIbpCKPGvFmAqaeTrRNbnYR19DW_TynWWJlXuOjTlealoLyD-gQUuKpX1Dd8sM70OUU7rswlEw1MD94Kb3uruTd40Y61jEHIYZ_MbDApMKrIFOHccJgusBsRZ3syz6pIPVEi1WcxIymIb0",
        role: fetchedApp?.offerId?.title || "Product Design Intern",
        skills: fetchedApp?.studentId?.skills || ["Figma", "UI/UX", "Prototyping"],
        matchScore: fetchedApp?.matchPercentage || 94,
        status: fetchedApp?.status || fetchedApp?.dummyStatus || "Under Review",
        email: fetchedApp?.studentId?.email || "a.rivers@example.com",
        phone: fetchedApp?.studentId?.phoneNumber || "+1 (555) 012-3456",
        university: fetchedApp?.studentId?.university || "University of Technology",
    };

    const feedbackList = fetchedApp?.feedback || [];

    const tabs = [
        { id: 'Overview', icon: 'person' },
        { id: 'Timeline', icon: 'history' },
        { id: 'Documents', icon: 'description' },
        { id: 'Feedback', icon: 'rate_review' },
    ];

    return (
        <div className="bg-slate-50 dark:bg-slate-900 dark:bg-slate-950 text-slate-900 dark:text-white dark:text-slate-100 min-h-screen flex flex-col font-body">
            {company && <CompanyNavbar company={company} />}
            {student && <StudentNavbar student={student} />}
            {!company && !student && (
                <header className="flex justify-between items-center px-6 h-16 w-full sticky top-0 z-50 bg-white dark:bg-slate-800 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm dark:shadow-none">
                    <span className="text-xl font-bold font-display text-primary">stage.io</span>
                </header>
            )}

            <div className="flex flex-1">
                {/* SideNavBar */}
                <aside className="hidden md:flex flex-col w-64 p-4 bg-slate-50 dark:bg-slate-900 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-700 dark:border-slate-800 h-[calc(100vh-64px)] sticky top-16">
                    <div className="mb-8 px-4 flex flex-col items-center text-center mt-4">
                        <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-md mb-3 overflow-hidden">
                            <img alt="Candidate profile picture" className="w-full h-full object-cover" src={appData.profilePicture} />
                        </div>
                        <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white dark:text-slate-100">{appData.name}</h2>
                        <p className="font-body text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">{appData.role}</p>
                        {/* Interview button removed as requested */}
                    </div>
                    <nav className="flex-1 flex flex-col gap-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-2 font-body text-sm rounded-lg transition-colors w-full ${activeTab === tab.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-primary font-semibold' : 'text-slate-600 dark:text-slate-300 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-900'}`}
                            >
                                <span className="material-symbols-outlined">{tab.icon}</span>
                                <span>{tab.id}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
                    <div className="max-w-[1200px] mx-auto">
                        {/* Breadcrumbs & Header */}
                        <div className="mb-8">
                            <nav className="flex text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-2 gap-2">
                                <span className="hover:text-primary cursor-pointer" onClick={() => navigate(company ? '/company-dashboard' : '/application-tracker')}>Dashboard</span>
                                <span>›</span>
                                <span className="hover:text-primary cursor-pointer">Applications</span>
                                <span>›</span>
                                <span className="text-slate-900 dark:text-white font-medium">{appData.name}</span>
                            </nav>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                                <div>
                                    <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white leading-tight">{appData.name}</h1>
                                    <p className="text-primary font-medium text-lg">{appData.role}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {appData.skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-semibold border border-indigo-100 dark:border-indigo-800">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* KPI Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-600">bolt</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">Match Score</p>
                                    <p className="text-2xl font-bold font-display text-slate-900 dark:text-white dark:text-white">{appData.matchScore}%</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">Days in Pipeline</p>
                                    <p className="text-2xl font-bold font-display text-slate-900 dark:text-white dark:text-white">4</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-orange-600">pending</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">Status</p>
                                    <p className="text-xl font-bold font-display text-slate-900 dark:text-white dark:text-white">{appData.status}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column (2/3) */}
                            <div className="lg:col-span-2 space-y-8">

                                {activeTab === 'Overview' && (
                                    <>
                                        <section className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm transition-all">
                                            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">mail</span>
                                                Cover Letter
                                            </h3>
                                            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 dark:text-slate-400 dark:text-slate-500 leading-relaxed text-sm md:text-base">
                                                <p>Dear Hiring Team,</p>
                                                <p className="mt-4">As a Product Design intern with a passion for creating impactful user experiences, I was thrilled to see the opening at your company. With a foundation in UI/UX principles and hands-on experience in prototyping with Figma, I am eager to bring my skills to your design team.</p>
                                                <p className="mt-4">My approach centers around user-centric design and scalable components. I believe my creative problem-solving skills make me a strong candidate for this role.</p>
                                            </div>
                                        </section>

                                        <section className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm transition-all">
                                            <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">work</span>
                                                Experience Summary
                                            </h3>
                                            <div className="space-y-6">
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 dark:text-slate-500">corporate_fare</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white dark:text-white">UI/UX Design Intern @ Creative Co</h4>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-2">Summer 2023 • Internship</p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-300 dark:text-slate-400 dark:text-slate-500 leading-relaxed">Assisted in redesigning the core dashboard interface, resulting in a 20% improvement in user satisfaction metrics.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm transition-all">
                                            <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">school</span>
                                                Education
                                            </h3>
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 dark:text-slate-500">school</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white dark:text-white">B.Sc. in Human-Computer Interaction</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">University of Technology • Expected 2025</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 dark:text-slate-400 dark:text-slate-500 mt-2">Specializing in interactive systems and cognitive psychology.</p>
                                                </div>
                                            </div>
                                        </section>
                                    </>
                                )}

                                {activeTab === 'Timeline' && (
                                    <section className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm transition-all h-full">
                                        <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">history</span>
                                            Detailed Timeline
                                        </h3>
                                        <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-100 dark:before:bg-slate-800">
                                            <div className="relative">
                                                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-indigo-50 dark:ring-indigo-900/40"></div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white dark:text-white">Screening Call Scheduled</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Nov 22, 2023 • 2:00 PM</p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-400 ring-4 ring-indigo-50 dark:ring-indigo-900/40"></div>
                                                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 dark:text-slate-300">Review Started</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Nov 20, 2023 • 10:15 AM</p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-400 ring-4 ring-indigo-50 dark:ring-indigo-900/40"></div>
                                                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 dark:text-slate-300">Applied</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Nov 18, 2023 • 4:30 PM</p>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {activeTab === 'Documents' && (
                                    <section className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm transition-all h-full">
                                        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">description</span>
                                            Documents & Attachments
                                        </h3>
                                        <div className="flex flex-col gap-4">
                                            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors">
                                                <span className="material-symbols-outlined text-red-500 text-3xl">picture_as_pdf</span>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100 dark:text-slate-200">Resume.pdf</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">1.2 MB • Uploaded at application</p>
                                                </div>
                                                <button className="material-symbols-outlined text-slate-400 dark:text-slate-500 hover:text-primary transition-colors">download</button>
                                            </div>
                                            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors">
                                                <span className="material-symbols-outlined text-indigo-500 text-3xl">folder_zip</span>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100 dark:text-slate-200">Portfolio_Final.zip</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">24 MB • Uploaded at application</p>
                                                </div>
                                                <button className="material-symbols-outlined text-slate-400 dark:text-slate-500 hover:text-primary transition-colors">download</button>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {activeTab === 'Feedback' && (
                                    <section className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm transition-all h-full min-h-[300px]">
                                        <h3 className="font-display text-lg font-bold mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">rate_review</span>
                                            {company ? 'Internal Feedback / Messaging' : 'Message Company'}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm mb-6">{company ? 'Collaborate with your team or message the candidate.' : 'Communicate directly with the company.'}</p>
                                        <div className="flex flex-col h-full min-h-[400px]">
                                            <div className="flex-1 bg-slate-50 dark:bg-slate-900 dark:bg-slate-800/50 rounded-lg p-4 mb-4 border border-slate-100 dark:border-slate-800 overflow-y-auto max-h-[400px] flex flex-col gap-3">
                                                {feedbackList.length === 0 ? (
                                                    <div className="h-full flex items-center justify-center">
                                                        <p className="text-slate-400 dark:text-slate-500 text-sm italic">No messages yet.</p>
                                                    </div>
                                                ) : (
                                                    feedbackList.map((fb, idx) => (
                                                        <div key={idx} className="bg-white dark:bg-slate-800 dark:bg-slate-700 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-600 shrink-0">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className="font-bold text-xs text-slate-800 dark:text-slate-100 dark:text-slate-200">{fb.authorName}</span>
                                                                <span className="text-[10px] text-slate-400 dark:text-slate-500">{moment(fb.createdAt).fromNow()}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-300 dark:text-slate-300">{fb.text}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <textarea
                                                    value={feedbackText}
                                                    onChange={e => setFeedbackText(e.target.value)}
                                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddFeedback(); } }}
                                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary placeholder-slate-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                                    placeholder={!company && feedbackList.length === 0 ? "Wait for the company to message you first..." : "Write a message..."}
                                                    rows="2"
                                                    disabled={isSubmittingFeedback || (!company && feedbackList.length === 0)}
                                                ></textarea>
                                                <button
                                                    onClick={handleAddFeedback}
                                                    disabled={isSubmittingFeedback || !feedbackText.trim() || (!company && feedbackList.length === 0)}
                                                    className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-4 rounded-lg transition-colors flex items-center justify-center min-w-[50px]"
                                                >
                                                    {isSubmittingFeedback ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span className="material-symbols-outlined">send</span>}
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                )}

                            </div>

                            {/* Right Column (1/3) */}
                            <div className="space-y-6">
                                {/* Candidate Actions */}
                                {company && (
                                <section className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-lg">
                                    <h3 className="font-display text-sm font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Candidate Actions</h3>
                                    {appData.status === 'accepted' ? (
                                        <div className="flex flex-col items-center gap-3 py-4 px-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl text-center">
                                            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl">hourglass_top</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-amber-800 dark:text-amber-300 text-sm">Waiting for Admin Validation</p>
                                                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1 leading-relaxed">This application has been accepted. The university admin must now validate it before proceeding.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <button
                                                disabled={actionLoading}
                                                onClick={() => setConfirmationModal({ isOpen: true, status: 'Accepted' })}
                                                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-green-100 dark:shadow-none"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                Accept
                                            </button>
                                            <button
                                                disabled={actionLoading}
                                                onClick={() => setConfirmationModal({ isOpen: true, status: 'Refused' })}
                                                className="w-full bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border border-red-100 dark:border-red-900/50"
                                            >
                                                <span className="material-symbols-outlined">cancel</span>
                                                Refuse
                                            </button>
                                            <button
                                                disabled={actionLoading}
                                                onClick={() => setConfirmationModal({ isOpen: true, status: 'On Hold' })}
                                                className="w-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-800 disabled:opacity-50 text-slate-600 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border border-slate-200 dark:border-slate-700 dark:border-slate-700"
                                            >
                                                <span className="material-symbols-outlined">schedule</span>
                                                Put on Hold
                                            </button>
                                        </div>
                                    )}
                                </section>
                                )}

                                {/* Quick Info */}
                                <section className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm">
                                    <h3 className="font-display text-sm font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">Quick Info</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 dark:bg-slate-800 p-2 rounded-lg">alternate_email</span>
                                            <div className="truncate">
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Email</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-300">{appData.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 dark:bg-slate-800 p-2 rounded-lg">call</span>
                                            <div>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Phone</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-300">{appData.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 dark:bg-slate-800 p-2 rounded-lg">account_balance</span>
                                            <div>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">University</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 dark:text-slate-300">{appData.university}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 dark:bg-slate-800 p-2 rounded-lg">link</span>
                                            <div>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Social</p>
                                                <a className="text-sm font-bold text-primary hover:underline" href="#">LinkedIn Profile</a>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Right column redundant timeline hidden from user when Timeline tab is not active but kept clean. */}
                                {activeTab === 'Overview' && (
                                    <section className="bg-white dark:bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm transition-all hidden xl:block">
                                        <p className="text-xs text-center text-slate-400 dark:text-slate-500 italic">Navigate through sidebar tabs for deeper applicant insight.</p>
                                    </section>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Stylish Confirmation Modal */}
            {confirmationModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-1 ${confirmationModal.status === 'Accepted' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                confirmationModal.status === 'Refused' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 dark:bg-slate-800 dark:text-slate-300'
                                }`}>
                                <span className="material-symbols-outlined text-2xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {confirmationModal.status === 'Accepted' ? 'check_circle' :
                                        confirmationModal.status === 'Refused' ? 'cancel' : 'schedule'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white dark:text-white">
                                    Confirm Status Update
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
                                    Are you sure you want to mark <span className="font-semibold text-slate-700 dark:text-slate-200 dark:text-slate-300">{appData.name}</span>'s application as <span className="font-bold text-slate-800 dark:text-slate-100 dark:text-slate-200">&quot;{confirmationModal.status}&quot;</span>? This action can trigger automated emails and dashboard updates.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 dark:border-slate-800/60">
                            <button
                                onClick={() => setConfirmationModal({ isOpen: false, status: null })}
                                disabled={actionLoading}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:text-slate-500 dark:hover:text-white dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAction}
                                disabled={actionLoading}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center min-w-[140px] gap-2 transition-all active:scale-95 disabled:opacity-75 ${confirmationModal.status === 'Accepted' ? 'bg-green-600 hover:bg-green-700 shadow-md shadow-green-100 dark:shadow-none' :
                                    confirmationModal.status === 'Refused' ? 'bg-red-600 hover:bg-red-700 shadow-md shadow-red-100 dark:shadow-none' :
                                        'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-md shadow-slate-200 dark:shadow-none'
                                    }`}
                            >
                                {actionLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Confirm Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationDetails;
