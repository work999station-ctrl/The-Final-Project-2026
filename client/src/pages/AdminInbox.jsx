import React, { useState, useEffect } from 'react';
import SharedInbox from '../components/SharedInbox';
import AdminSidebar from '../components/AdminSidebar';

const AdminInbox = () => {
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await fetch('/api/admin/me');
                if (res.ok) {
                    const data = await res.json();
                    setAdminUser(data.user);
                }
            } catch (err) {
                console.error("Error fetching admin data:", err);
            }
        };
        fetchAdmin();
    }, []);

    return (
        <div className="flex font-body min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="hidden md:block w-64 shrink-0">
                <AdminSidebar activePage="inbox" adminUser={adminUser} />
            </div>
            <div className="flex-1 w-full min-w-0">
                <SharedInbox userType="admin" title="Admin Inbox" backLink="/admin-dashboard" navTitle="CampusConnect Admin" />
            </div>
        </div>
    );
};

export default AdminInbox;
