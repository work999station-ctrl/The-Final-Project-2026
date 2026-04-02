import React from 'react';
import SharedInbox from '../components/SharedInbox';

const AdminInbox = () => {
    return <SharedInbox userType="admin" title="Admin Inbox" backLink="/admin-dashboard" navTitle="CampusConnect Admin" />;
};

export default AdminInbox;
