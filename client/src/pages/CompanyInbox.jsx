import React from 'react';
import SharedInbox from '../components/SharedInbox';

const CompanyInbox = () => {
    return <SharedInbox userType="company" title="Inbox" backLink="/company-dashboard" />;
};

export default CompanyInbox;
