const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure storage for uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'logo') {
            cb(null, 'public/uploads/company/');
        } else if (file.fieldname === 'profilePicture') {
            cb(null, 'public/uploads/admin/');
        } else {
            cb(null, 'public/uploads/student/');
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


const { studentSignup_get, studentSignup_post, studentDashboard_get, studentProfile_update, logout_get, login_post, login_get, companySignup_get, companySignup_post, companyProfile_update, adminSignup_post, adminProfile_update, createOffer, getAllOffers, getCompanyOffers, updateOffer, deleteOffer, getOfferById, createApplication, getCompanyApplications, getStudentProfileForRecruiter, getApplicationsByOfferId, updateApplicationStatus, getAdminApplicationsToValidate, getAdminAllApplications, getAdminCompanyProfile, getAdminApplicationById, validateApplicationAdmin, getStudentApplications, deleteApplication, getCompanyDashboardStats, getInboxMessages, markMessageAsRead, getNotificationDetails, getUniversityPlacementStats } = require('../controllers/all.controller');
const { requireAuth, requireAuthAPI } = require('../middleware/authmiddleware');

router.get('/student-Signup', studentSignup_get);
router.post('/api/studentSignup', studentSignup_post);
router.get('/studentDashboard', requireAuth, studentDashboard_get);
// router.post('/studentSignup', studentSignup_post);



// React API Routes
router.get('/api/student/me', requireAuthAPI, (req, res) => {
    if (req.userType === 'student') {
        res.status(200).json({ user: req.user });
    } else {
        res.status(403).json({ error: 'Forbidden. Not a student.' });
    }
});

router.put('/api/student/profile', requireAuthAPI, upload.single('profile_picture'), studentProfile_update);
router.get('/api/student/applications', requireAuthAPI, getStudentApplications);

router.get('/login', login_get);
router.post('/api/login', login_post);

router.get('/company-Signup', companySignup_get);
router.post('/api/companySignup', upload.single('logo'), companySignup_post);

router.get('/api/company/me', requireAuthAPI, (req, res) => {
    if (req.userType === 'company') {
        res.status(200).json({ user: req.user });
    } else {
        res.status(403).json({ error: 'Forbidden. Not a company.' });
    }
});

router.put('/api/company/profile', requireAuthAPI, upload.single('logo'), companyProfile_update);

// Admin Routes
router.post('/api/adminSignup', upload.single('profilePicture'), adminSignup_post);

router.get('/api/admin/me', requireAuthAPI, (req, res) => {
    if (req.userType === 'admin') {
        res.status(200).json({ user: req.user });
    } else {
        res.status(403).json({ error: 'Forbidden. Not an admin.' });
    }
});

router.put('/api/admin/profile', requireAuthAPI, upload.single('profilePicture'), adminProfile_update);
router.get('/api/admin/applications/pending-validation', requireAuthAPI, getAdminApplicationsToValidate);
router.put('/api/admin/applications/:id/validate', requireAuthAPI, validateApplicationAdmin);
router.get('/api/admin/applications', requireAuthAPI, getAdminAllApplications);
router.get('/api/admin/company/:id', requireAuthAPI, getAdminCompanyProfile);
router.get('/api/admin/application/:id', requireAuthAPI, getAdminApplicationById);
router.get('/api/admin/university-placement-stats', requireAuthAPI, getUniversityPlacementStats);

router.post('/api/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ success: true });
});

//create offer routes
router.get('/create-offer', requireAuth, (req, res) => {
    res.status(200).json({ success: true });
});
router.post('/api/offers', requireAuthAPI, createOffer);
router.get('/api/offers', getAllOffers);
router.get('/api/offers/:id', requireAuthAPI, getOfferById);
router.get('/api/company/offers', requireAuthAPI, getCompanyOffers);
router.get('/api/company/applications', requireAuthAPI, getCompanyApplications);
router.get('/api/company/dashboard-stats', requireAuthAPI, getCompanyDashboardStats);
router.get('/api/company/applications/offer/:id', requireAuthAPI, getApplicationsByOfferId);
router.put('/api/offers/:id', requireAuthAPI, upload.single('logo'), updateOffer);
router.delete('/api/offers/:id', requireAuthAPI, deleteOffer);
router.get('/api/student/profile-for-company/:id', requireAuthAPI, getStudentProfileForRecruiter);

// Inbox messages
router.get('/api/inbox/messages', requireAuthAPI, getInboxMessages);
router.get('/api/inbox/notification/:id', requireAuthAPI, getNotificationDetails);
router.put('/api/inbox/mark-as-read/:id', requireAuthAPI, markMessageAsRead);

//create application routes

router.post('/api/applications', requireAuth, createApplication);
router.put('/api/applications/:id/status', requireAuthAPI, updateApplicationStatus);
router.delete('/api/applications/:id', requireAuthAPI, deleteApplication);

module.exports = router;
