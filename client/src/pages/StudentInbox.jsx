import React from 'react';
import SharedInbox from '../components/SharedInbox';

const StudentInbox = () => {
    return <SharedInbox userType="student" title="My Inbox" backLink="/student-dashboard" navTitle="stage.io" />;
};

export default StudentInbox;
