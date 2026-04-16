import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';
import StudentSignup from './pages/StudentSignup';
import Login from './pages/Login';
import CompanySignup from './pages/CompanySignup';
import CompanyDashboard from './pages/CompanyDashboard';
import EditCompanyProfile from './pages/EditCompanyProfile';
import EditStudentProfile from './pages/EditStudentProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminSignup from './pages/AdminSignup';
import EditAdminProfile from './pages/EditAdminProfile';
import InternshipOffers from './pages/InternshipOffers';
import CompanyOffers from './pages/CompanyOffers';
import CompanyStatistics from './pages/CompanyStatistics';
import CreateInternshipOffer from './pages/CreateInternshipOffer';
import OfferDetailsSplitView from './pages/OfferDetailsSplitView';
import EditCompanyOffer from './pages/EditCompanyOffer';
import CandidateTrackingStatistics from './pages/CandidateTrackingStatistics';
import CandidateTrackingJobSpecific from './pages/CandidateTrackingJobSpecific';
import StudentProfileRecruiter from './pages/StudentProfileRecruiterView';
import CandidateTrackingAdmin from './pages/CandidateTrackingAdmin';
import CompanyProfileAdminView from './pages/CompanyProfileAdminView';
import AgreementPreview from './pages/AgreementPreview';
import ApplicationTracker from './pages/ApplicationTracker';
import CompanyInbox from './pages/CompanyInbox';
import AdminInbox from './pages/AdminInbox';
import StudentInbox from './pages/StudentInbox';
import AdminAcceptanceValidation from './pages/AdminAcceptanceValidation';
import NotificationDetails from './pages/NotificationDetails';
import CompanyProfileStudentView from './pages/CompanyProfileStudentView';
import UniversityPlacementAnalytics from './pages/UniversityPlacementAnalytics';
import ApplicationDetails from './pages/ApplicationDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/company-signup" element={<CompanySignup />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/edit-company-profile" element={<EditCompanyProfile />} />
        <Route path="/edit-student-profile" element={<EditStudentProfile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/edit-admin-profile" element={<EditAdminProfile />} />
        <Route path="/opportunities" element={<InternshipOffers />} />
        <Route path="/company-offers" element={<CompanyOffers />} />
        <Route path="/create-offer" element={<CreateInternshipOffer />} />
        <Route path="/offer-details/:id" element={<OfferDetailsSplitView />} />
        <Route path="/edit-offer/:id" element={<EditCompanyOffer />} />
        <Route path="/candidate-tracking-statistics" element={<CandidateTrackingStatistics />} />
        <Route path="/company-statistics" element={<CompanyStatistics />} />
        <Route path="/candidate-tracking-job-specific/:id" element={<CandidateTrackingJobSpecific />} />
        <Route path="/student-profile-recruiter/:id" element={<StudentProfileRecruiter />} />
        <Route path="/candidate-tracking-admin" element={<CandidateTrackingAdmin />} />
        <Route path="/company-profile-admin/:id" element={<CompanyProfileAdminView />} />
        <Route path="/agreement/:applicationId" element={<AgreementPreview />} />
        <Route path="/ApplicationTracker" element={<ApplicationTracker />} />
        <Route path="/company-inbox" element={<CompanyInbox />} />
        <Route path="/admin-inbox" element={<AdminInbox />} />
        <Route path="/student-inbox" element={<StudentInbox />} />
        <Route path="/AdminAcceptanceValidation/:applicationId" element={<AdminAcceptanceValidation />} />
        <Route path="/NotificationDetails/:applicationId" element={<NotificationDetails />} />
        <Route path="/CompanyInbox" element={<CompanyInbox />} />
        <Route path="/company-dashboard-student-view/:id" element={<CompanyProfileStudentView />} />
        <Route path="/university-placement-analytics" element={<UniversityPlacementAnalytics />} />
        <Route path="/application-details/:applicationId" element={<ApplicationDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
