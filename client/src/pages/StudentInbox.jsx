import React from 'react';
import SharedInbox from '../components/SharedInbox';
import StudentNavbar from '../components/StudentNavbar';



const StudentInbox = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
            <StudentNavbar />
            <div className="flex-1 flex flex-col [&>div]:min-h-0 [&>div]:flex-1">
                <SharedInbox userType="student" title="My Inbox" backLink="/student-dashboard" navTitle="stage.io" hideHeader={true} />
            </div>
        </div>
    );
};

export default StudentInbox;
