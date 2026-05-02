import React, { useState, useEffect } from 'react';
import SharedInbox from '../components/SharedInbox';
import StudentNavbar from '../components/StudentNavbar';
import StudentSidebar from '../components/StudentSidebar';

const StudentInbox = () => {
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const token = document.cookie.split('jwt=')[1]?.split(';')[0] || localStorage.getItem('token');
                const res = await fetch('/api/student/me', {
                    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) setStudent(data.user);
                }
            } catch (err) {
                console.error('Failed to fetch student:', err);
            }
        };
        fetchStudent();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
            <StudentNavbar student={student} />
            <StudentSidebar student={student} activePage="inbox" />
            <div className="flex-1 flex flex-col [&>div]:min-h-0 [&>div]:flex-1 md:ml-64 transition-all duration-300">
                <SharedInbox userType="student" title="My Inbox" backLink="/student-dashboard" navTitle="stage.io" hideHeader={true} />
            </div>
        </div>
    );
};

export default StudentInbox;
