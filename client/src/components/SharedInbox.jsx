import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SharedInbox = ({ userType, title, backLink, navTitle = "stage.io", hideHeader = false }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch('/api/inbox/messages');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.messages) {
                        console.log(data.messages);
                        setMessages(data.messages);
                    }
                } else if (res.status === 401) {
                    navigate('/login');
                }
            } catch (err) {
                console.error("Failed to fetch inbox messages:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [navigate]);

    const filteredMessages = messages.filter(msg =>
        msg.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex items-center justify-center font-sans">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-light text-text-main font-body min-h-screen flex flex-col antialiased overflow-hidden">
            {/* Top Navigation Bar */}
            {!hideHeader && (
                <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 lg:px-12 py-4 shrink-0">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(backLink)}>
                            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
                                <span className="material-symbols-outlined font-bold">hub</span>
                            </div>
                            <h2 className="text-xl font-bold font-header tracking-tight text-slate-900 dark:text-white">{navTitle}</h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" onClick={() => navigate(backLink)} href="#">Dashboard</a>
                            <a className="text-primary font-semibold text-sm border-b-2 border-primary py-2" href="#">{title}</a>
                        </nav>
                    </div>
                </div>
            </header>
            )}

            {/* Main Container */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900/50">
                {/* Centered Inbox List */}
                <div className="w-full max-w-4xl mx-auto border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex flex-col rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] z-10 overflow-hidden min-h-[600px]">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 flex-wrap gap-4">
                        <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">{title}</h1>
                        <div className="relative group w-72 max-w-full">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </span>
                            <input
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-600 dark:text-slate-200 placeholder:text-slate-400"
                                placeholder="Search messages..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/50">
                        {filteredMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-3 opacity-50">inbox</span>
                                <p>No messages yet.</p>
                            </div>
                        ) : (
                            filteredMessages.map(msg => (
                                <div
                                    key={msg.id}
                                    onClick={() => {
                                        // Optimistic UI update: Remove red dot immediately
                                        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));

                                        // Update server
                                        fetch(`/api/inbox/mark-as-read/${msg.id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' }
                                        }).catch(err => console.error("Error marking as read:", err));

                                        if (userType === 'admin') {
                                            navigate(`/AdminAcceptanceValidation/${msg.id}`);
                                        } else if (userType === 'company' || userType === 'student') {
                                            navigate(`/NotificationDetails/${msg.id}`);
                                        }
                                    }}
                                    className={`p-6 flex gap-5 relative cursor-pointer transition-colors ${msg.active ? 'bg-indigo-50/40 dark:bg-indigo-900/10 border-l-4 border-primary' : 'bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 border-transparent'}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className={`h-14 w-14 rounded-xl flex items-center justify-center font-bold text-2xl overflow-hidden border ${msg.logoBg} dark:border-slate-700 shadow-sm`}>
                                            {msg.logo ? (
                                                <img alt={msg.companyName} className="w-10 h-10 object-contain" src={msg.logo} />
                                            ) : (
                                                msg.logoText
                                            )}
                                        </div>
                                        {msg.unread && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"></span>}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex justify-between items-baseline gap-2 mb-1">
                                            <h3 className={`text-base truncate ${msg.active ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-800 dark:text-slate-200'}`}>
                                                {msg.companyName}
                                            </h3>
                                            <span className={`text-xs whitespace-nowrap ${msg.active ? 'font-bold text-primary uppercase tracking-wider' : 'font-medium text-slate-400'}`}>
                                                {msg.time}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${msg.active ? 'font-bold text-slate-700 dark:text-slate-300' : 'font-bold text-slate-600 dark:text-slate-400'}`}>
                                            {msg.title}
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                            {msg.snippet}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SharedInbox;
