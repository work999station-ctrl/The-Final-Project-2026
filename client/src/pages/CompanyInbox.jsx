import React, { useState, useEffect } from 'react';
import SharedInbox from '../components/SharedInbox';
import CompanySidebar from '../components/CompanySidebar';

const CompanyInbox = () => {
    const [company, setCompany] = useState(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await fetch('/api/company/me');
                if (res.ok) {
                    const data = await res.json();
                    setCompany(data.user);
                }
            } catch (err) {
                console.error("Error fetching company data:", err);
            }
        };
        fetchCompany();
    }, []);

    return (
        <div className="flex font-body min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="hidden md:block w-64 shrink-0">
                <CompanySidebar company={company} activePage="inbox" topOffset="top-0" />
            </div>
            <div className="flex-1 w-full min-w-0">
                <SharedInbox userType="company" title="Inbox" backLink="/company-dashboard" />
            </div>
        </div>
    );
};

export default CompanyInbox;
