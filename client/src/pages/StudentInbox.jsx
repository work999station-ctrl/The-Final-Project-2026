import React from 'react';
import SharedInbox from '../components/SharedInbox';

import StudentNavbar from '../components/StudentNavbar';

const StudentInbox = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <StudentNavbar />
            <SharedInbox userType="student" title="My Inbox" backLink="/student-dashboard" navTitle="stage.io" hideHeader={true} />
        </div>
    );
};

export default StudentInbox;
