import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSocket from '../hooks/useSocket';

const StudentProfileRecruiterView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();
    const [student, setStudent] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/student/profile-for-company/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setStudent(data.student);
                    setApplications(data.applications);
                } else {
                    setError(data.error || 'Failed to fetch student profile');
                }
            } catch (err) {
                console.error('Error fetching student profile:', err);
                setError('An error occurred while fetching the profile');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStudentProfile();
        }
    }, [id]);

    // ── Real-time: if this student updates their profile, reflect it immediately ──
    useEffect(() => {
        if (!socket) return;
        const handleUserUpdated = (payload) => {
            if (payload.type === 'student' && payload.data && String(payload.userId) === String(id)) {
                setStudent(prev => prev ? { ...prev, ...payload.data } : prev);
            }
        };
        socket.on('user:updated', handleUserUpdated);
        return () => socket.off('user:updated', handleUserUpdated);
    }, [socket, id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Loading candidate profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl">error</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Oops! Something went wrong</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!student) return null;

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-body">
            {/* TopAppBar Component */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-50">
                <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-8">
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-headline">stage.io</span>
                        <nav className="hidden md:flex gap-6 items-center h-full">
                            <button onClick={() => navigate('/company-dashboard')} className="text-slate-600 dark:text-slate-400 pb-4 pt-5 hover:text-blue-500 dark:hover:text-blue-300 transition-colors font-sans text-sm font-medium">Dashboard</button>
                            <button onClick={() => navigate('/candidate-tracking-statistics')} className="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-4 pt-5 font-sans text-sm font-medium">Candidates</button>
                            <button className="text-slate-600 dark:text-slate-400 pb-4 pt-5 hover:text-blue-500 dark:hover:text-blue-300 transition-colors font-sans text-sm font-medium">Inbox</button>
                            <button className="text-slate-600 dark:text-slate-400 pb-4 pt-5 hover:text-blue-500 dark:hover:text-blue-300 transition-colors font-sans text-sm font-medium">Schedule</button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Back Navigation */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group"
                    >
                        <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        <span className="font-medium text-sm">Back to Candidates</span>
                    </button>
                </div>

                {/* Main Profile Hero Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-500 relative"></div>
                    <div className="px-8 pb-10 -mt-16 relative">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-2xl bg-white p-1 shadow-lg overflow-hidden border border-slate-100">
                                    <img
                                        alt={student.name}
                                        className="h-full w-full object-cover rounded-xl"
                                        src={student.profilePicture}
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Student'}
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
                            </div>
                            <div className="mt-4">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-headline">{student.name}</h1>
                                <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg mt-1">{student.currentYear} Student</p>
                                <div className="flex items-center justify-center gap-2 text-slate-500 mt-2">
                                    <span className="material-symbols-outlined text-base">school</span>
                                    <span>{student.university || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3 mt-8">
                                {student.githubPortfolio && (
                                    <a
                                        href={student.githubPortfolio.startsWith('http') ? student.githubPortfolio : `https://${student.githubPortfolio}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">code</span>
                                        GitHub Portfolio
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 border-t border-slate-100 dark:border-slate-800 pt-8">
                            {/* Contact Column */}
                            <div className="space-y-4">
                                <h3 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 font-headline">
                                    <span className="material-symbols-outlined text-indigo-600 text-lg">contact_page</span>
                                    Contact Info
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-slate-400">alternate_email</span>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium font-body">Email Address</p>
                                            <p className="text-sm font-medium font-body">{student.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-slate-400">phone</span>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium font-body">Phone Number</p>
                                            <p className="text-sm font-medium font-body">{student.phoneNumber || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-slate-400">location_on</span>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium font-body">Location</p>
                                            <p className="text-sm font-medium font-body">{student.country || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Column */}
                            <div className="space-y-4">
                                <h3 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 font-headline">
                                    <span className="material-symbols-outlined text-indigo-600 text-lg">bolt</span>
                                    Top Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {student.skills && student.skills.length > 0 ? (
                                        student.skills.map((skill, idx) => (
                                            <span key={idx} className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                                        ))
                                    ) : (
                                        <span className="text-slate-400 text-sm italic">No skills listed</span>
                                    )}
                                </div>
                            </div>

                            {/* Status Column */}
                            <div className="space-y-4">
                                <h3 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 font-headline">
                                    <span className="material-symbols-outlined text-indigo-600 text-lg">event_available</span>
                                    Availability
                                </h3>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">info</span>
                                        <span className="text-sm font-semibold">Remote or Algiers</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Member since {new Date(student.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Resume Sections */}
                {(student.experience?.length > 0 || student.academicProjects?.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Experience */}
                        {student.experience && student.experience.length > 0 && (
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h2 className="text-xl font-bold font-headline mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-indigo-600">work</span>
                                    Experience
                                </h2>
                                <div className="space-y-6">
                                    {student.experience.map((exp, idx) => (
                                        <div key={idx} className="border-l-2 border-indigo-200 pl-4 py-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white capitalize">{exp.role}</h4>
                                            <p className="text-sm font-semibold text-indigo-600 mb-2">{exp.type}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Projects */}
                        {student.academicProjects && student.academicProjects.length > 0 && (
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h2 className="text-xl font-bold font-headline mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-indigo-600">terminal</span>
                                    Academic Projects
                                </h2>
                                <div className="space-y-6">
                                    {student.academicProjects.map((proj, idx) => (
                                        <div key={idx} className="border-l-2 border-indigo-200 pl-4 py-1 flex flex-col gap-1.5">
                                            <h4 className="font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                                            <p className="text-sm font-medium text-indigo-600 capitalize">Role: {proj.role}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">Tech: {proj.technologies}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{proj.result}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
                    {/* Active Applications with this Company */}
                    <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold font-headline">Applications History</h2>
                            <span className="text-indigo-600 text-sm font-semibold">{applications.length} Total</span>
                        </div>
                        <div className="space-y-4">
                            {applications.length > 0 ? (
                                applications.map((app) => (
                                    <div key={app._id} className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white overflow-hidden">
                                                <span className="material-symbols-outlined">work</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white font-headline">{app.offerId?.title || 'Unknown Position'}</h4>
                                                <p className="text-xs text-slate-500 font-body">Applied {new Date(app.createdAt).toLocaleDateString()} • {app.offerId?.wilaya || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                app.status === 'refused' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                                                    'bg-amber-50 text-amber-600 border-amber-200'
                                                } border uppercase tracking-wider`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">description</span>
                                    <p className="text-slate-400">No application history found for this candidate.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats/Notes */}
                    <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 font-headline">Additional Details</h2>
                        <div className="space-y-6">
                            {student.bio && (
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 uppercase text-xs tracking-wide">About Me</h3>
                                    <p className="whitespace-pre-line leading-relaxed">{student.bio}</p>
                                </div>
                            )}
                            {student.baccalaureate && (
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 uppercase text-xs tracking-wide">Baccalaureate Graduation Year</h3>
                                    <p>{student.baccalaureate}</p>
                                </div>
                            )}
                            <div className="text-sm text-slate-600 dark:text-slate-400 italic bg-primary/5 p-3 rounded-lg border border-primary/10">
                                "Quick View: Student is at {student.university} in their {student.currentYear} specialty of {student.specialty}. Contact them via {student.email}."
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-xs font-bold uppercase text-slate-400 mb-2">Social Profiles</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-lg">link</span>
                                        {student.githubPortfolio ? (
                                            <a
                                                href={student.githubPortfolio.startsWith('http') ? student.githubPortfolio : `https://${student.githubPortfolio}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="truncate hover:text-indigo-600 transition-colors underline decoration-slate-200 hover:decoration-indigo-400 decoration-1 underline-offset-4"
                                            >
                                                {student.githubPortfolio}
                                            </a>
                                        ) : (
                                            <span className="truncate text-slate-400 italic">No portfolio linked</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-12">
                <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">stage.io</span>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Admin · Candidate Profile View</span>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-slate-400 dark:text-slate-500 font-medium">
                        <button onClick={() => navigate('/admin-dashboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Dashboard</button>
                        <button onClick={() => navigate('/candidate-tracking-admin')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Validate</button>
                        <button onClick={() => navigate('/university-placement-analytics')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Analytics</button>
                        <button onClick={() => navigate('/contact-us')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help</button>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-600">
                        © {new Date().getFullYear()} stage.io · University Career Services
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default StudentProfileRecruiterView;
