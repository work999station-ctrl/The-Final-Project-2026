const Student = require('../models/Student.model');
const Company = require('../models/Company.model');
const Admin = require('../models/Admin.model');
const SuperAdmin = require('../models/superAdmin.model');
const Offer = require('../models/Offer.model');
const Application = require('../models/application.model');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const socketManager = require('../socket');
const { sendAgreementEmails } = require('../utils/emailService');
const fs = require('fs');


// Helper — safely emit so the app doesn't crash if socket isn't ready
const emit = (event, payload) => {
  try { socketManager.getIO().emit(event, payload); } catch (_) { }
};

// Helper — convert uploaded image files to Base64 data URI to support multi-device/multi-PC persistent state
const fileToBase64 = (file) => {
  if (!file) return null;
  try {
    const fileBuffer = fs.readFileSync(file.path);
    const base64Data = fileBuffer.toString('base64');
    const mimeType = file.mimetype;
    // Delete local temp file
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      console.error("Failed to delete temp file:", e);
    }
    return `data:${mimeType};base64,${base64Data}`;
  } catch (err) {
    console.error("Error converting file to base64:", err);
    return null;
  }
};



const handelErrors = (err) => {
  console.log(err, err.code);
  let errors = { name: '', email: '', password: '' };

  if (err.name === 'MongooseError' || (err.message && (err.message.includes('buffering timed out') || err.message.includes('ETIMEOUT')))) {
    errors.email = 'Database connection error. Please try again later or check MongoDB status.';
    return errors;
  }

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password 
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }

  // validation errors for any model (e.g., 'student validation failed' or 'user validation failed')
  if (err.message.includes('validation failed')) {
    Object.values(err.errors).forEach(error => {
      errors[error.path] = error.message;
    });
  }

  return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', { expiresIn: maxAge });
}

const studentSignup_get = async (req, res) => {
  res.status(200).json({ message: "Use the React frontend for signup" });
}
const studentSignup_post = async (req, res) => {
  try {
    console.log(req.body);
    const user = await Student.create({ ...req.body });

    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handelErrors(err);
    res.status(400).json(errors);
  }
}
const studentDashboard_get = async (req, res) => {
  res.status(200).json({ message: "Use the React frontend for dashboard" });
}


const studentProfile_update = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (updateData.githubPortfolio && !/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+/.test(updateData.githubPortfolio)) {
      return res.status(400).json({ error: 'Please enter a valid GitHub profile link.' });
    }

    // Parse JSON string fields (from FormData)
    ['skills', 'technicalSkills', 'academicProjects', 'experience'].forEach(field => {
      if (typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          // Keep as is or ignore invalid JSON
        }
      }
    });

    // If files were uploaded, add their paths/base64 to updateData
    if (req.files) {
      if (req.files.profile_picture) {
        const base64Pic = fileToBase64(req.files.profile_picture[0]);
        if (base64Pic) updateData.profilePicture = base64Pic;
      }
      if (req.files.cv) {
        updateData.cvUrl = `/uploads/student/${req.files.cv[0].filename}`;
      }
    } else if (req.file) {
      const base64Pic = fileToBase64(req.file);
      if (base64Pic) updateData.profilePicture = base64Pic;
    }

    const result = await Student.findByIdAndUpdate(req.user._id, updateData, { returnDocument: 'after' });
    console.log('Profile updated:', result);
    // Notify all connected clients that this student's profile changed
    emit('user:updated', { type: 'student', userId: String(req.user._id), data: result });
    res.status(200).json({ success: true, user: result });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const logout_get = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Try student login first
    let user;
    let role;
    try {
      user = await Student.login(email, password);
      role = 'student';
    } catch (studentErr) {
      // If student typed wrong password, throw immediately
      if (studentErr.message === 'incorrect password') throw studentErr;

      // If student login fails due to incorrect email, try company login
      try {
        user = await Company.login(email, password);
        role = 'company';
      } catch (companyErr) {
        // If company typed wrong password, throw immediately
        if (companyErr.message === 'incorrect password') throw companyErr;

        // If company login fails due to incorrect email, try admin login
        try {
          user = await Admin.login(email, password);
          role = 'admin';
        } catch (adminErr) {
          if (adminErr.message === 'incorrect password') throw adminErr;
          
          // Try SuperAdmin login
          user = await SuperAdmin.login(email, password);
          role = 'superAdmin';
        }
      }
    }

    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, role });

  } catch (err) {
    const errors = handelErrors(err);
    res.status(400).json({ errors });
  }
}
const login_get = (req, res) => {
  res.status(200).json({ message: "Use the React frontend for login" });
}

const companySignup_post = async (req, res) => {
  try {
    console.log(req.body);
    let companyData = { ...req.body };
    if (req.file) {
      const base64Logo = fileToBase64(req.file);
      if (base64Logo) companyData.logo = base64Logo;
    }

    const company = await Company.create(companyData);

    const token = createToken(company._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: company._id });
  } catch (err) {
    const errors = handelErrors(err);
    res.status(400).json(errors);
  }
}
const companySignup_get = async (req, res) => {
  res.status(200).json({ message: "Use the React frontend for company signup" });
}

const companyProfile_update = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If a file was uploaded, convert it to Base64 and add to updateData
    if (req.file) {
      const base64Logo = fileToBase64(req.file);
      if (base64Logo) updateData.logo = base64Logo;
    }

    const company = await Company.findById(req.user._id);

    // Only allow updates to defined fields
    const allowedUpdates = ['companyName', 'email', 'phoneNumber', 'address', 'website', 'description', 'internshipOffice', 'companyRole'];
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        company[field] = updateData[field];
      }
    });

    if (updateData.logo) {
      company.logo = updateData.logo;
    }

    // Save to trigger any model validations/hooks if necessary (though findByIdAndUpdate could also be used)
    await company.save();

    console.log('Company profile updated:', company._id);
    // Notify all connected clients that this company's profile changed
    emit('user:updated', { type: 'company', userId: String(company._id), data: company });
    res.status(200).json({ success: true, user: company });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update company profile' });
  }
};

const adminProfile_update = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If a file was uploaded, convert it to Base64 and add to updateData
    if (req.file) {
      const base64Pic = fileToBase64(req.file);
      if (base64Pic) updateData.profilePicture = base64Pic;
    }

    const admin = await Admin.findById(req.user._id);

    // Only allow updates to defined fields
    const allowedUpdates = ['fullName', 'email', 'phone', 'universityName', 'role'];
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        admin[field] = updateData[field];
      }
    });

    if (updateData.profilePicture) {
      admin.profilePicture = updateData.profilePicture;
    }

    await admin.save();

    console.log('Admin profile updated:', admin._id);
    // Notify all connected clients that this admin's profile changed
    emit('user:updated', { type: 'admin', userId: String(admin._id), data: admin });
    res.status(200).json({ success: true, user: admin });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update admin profile' });
  }
};

const adminSignup_post = async (req, res) => {
  try {
    console.log(req.body);
    let adminData = { ...req.body };
    if (req.file) {
      const base64Pic = fileToBase64(req.file);
      if (base64Pic) adminData.profilePicture = base64Pic;
    }

    const admin = await Admin.create(adminData);

    const token = createToken(admin._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: admin._id });
  } catch (err) {
    const errors = handelErrors(err);
    res.status(400).json(errors);
  }
}

const createOffer = async (req, res) => {
  try {
    if (req.userType !== 'company') {
      return res.status(403).json({ error: 'Only companies can create offers' });
    }

    // Parse techStack if sent as JSON string
    if (req.body.techStack && typeof req.body.techStack === 'string') {
      try { req.body.techStack = JSON.parse(req.body.techStack); } catch (e) {}
    }

    const offerData = {
      ...req.body,
      companyId: req.user._id
    };

    // If a custom offer photo was uploaded, convert it to Base64
    if (req.file) {
      const base64Photo = fileToBase64(req.file);
      if (base64Photo) offerData.photo = base64Photo;
    }

    const newOffer = await Offer.create(offerData);

    res.status(201).json({ success: true, offer: newOffer });
  } catch (err) {
    const errors = handelErrors(err);
    console.error("Error in createOffer:", err);
    res.status(400).json({ errors, details: err.message });
  }
}

const getAllOffers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const skip = parseInt(req.query.skip) || 0;
    const { wilaya, duration, type, skill } = req.query;

    let studentSkills = [];

    // Check if user is a student to fetch their skills
    const token = req.cookies.jwt;
    if (token) {
      try {
        const decoded = jwt.verify(token, 'net ninja secret');
        const student = await Student.findById(decoded.id);
        if (student && student.skills) {
          studentSkills = student.skills.filter(s => !!s).map(s => s.toLowerCase());
        }
      } catch (err) {
        // Token invalid or expired, ignore
      }
    }

    // Build dynamic filter query
    const query = {};
    if (wilaya) {
      query.wilaya = { $regex: wilaya, $options: 'i' };
    }
    if (duration) {
      query.durationMonths = parseInt(duration);
    }
    if (type) {
      query.internshipType = { $regex: type, $options: 'i' };
    }
    if (skill) {
      query['techStack.tags'] = { $in: [new RegExp(skill, 'i')] };
    }

    const pipeline = [
      { $match: query },
      {
        $addFields: {
          allOfferTags: {
            $reduce: {
              input: { $ifNull: ["$techStack", []] },
              initialValue: [],
              in: { $concatArrays: ["$$value", { $ifNull: ["$$this.tags", []] }] }
            }
          }
        }
      },
      {
        $addFields: {
          lowerOfferTags: {
            $map: {
              input: "$allOfferTags",
              as: "tag",
              in: { $toLower: "$$tag" }
            }
          }
        }
      },
      {
        $addFields: {
          totalRequiredSkills: { $size: "$lowerOfferTags" },
          matchingSkillsCount: {
            $size: {
              $setIntersection: ["$lowerOfferTags", studentSkills]
            }
          }
        }
      },
      {
        $addFields: {
          matchPercentage: {
            $cond: {
              if: { $eq: ["$totalRequiredSkills", 0] },
              then: 100,
              else: {
                $multiply: [
                  { $divide: ["$matchingSkillsCount", "$totalRequiredSkills"] },
                  100
                ]
              }
            }
          }
        }
      },
      { $sort: { matchPercentage: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "company"
        }
      },
      {
        $unwind: {
          path: "$company",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          "company.password": 0, // exclude sensitive company info
        }
      }
    ];

    // Log the query to debug
    console.log("Fetching offers with query:", JSON.stringify(query));

    const offersWithCompany = await Offer.aggregate(pipeline);

    console.log("Found offers:", offersWithCompany.length);

    // If user is a student, check which offers they already applied to
    let finalizedOffers = offersWithCompany;
    if (token) {
      try {
        const decoded = jwt.verify(token, 'net ninja secret');
        const applications = await Application.find({ studentId: decoded.id });
        const appliedOfferMap = new Map(applications.map(app => [app.offerId.toString(), app.status]));

        finalizedOffers = offersWithCompany.map(offer => {
          const status = appliedOfferMap.get(offer._id.toString());
          return {
            ...offer,
            isApplied: !!status,
            applicationStatus: status || null
          };
        });
      } catch (e) {
        // ignore
      }
    }

    res.status(200).json({ success: true, offers: finalizedOffers });
  } catch (err) {
    console.error("Error in getAllOffers aggregation:", err);
    res.status(500).json({ error: 'Failed to fetch offers', details: err.message });
  }
}

const getCompanyOffers = async (req, res) => {
  try {
    if (req.userType !== 'company') {
      return res.status(403).json({ error: 'Only companies can perform this action' });
    }

    // Fetch offers and manually count applications for each
    const offers = await Offer.find({ companyId: req.user._id }).sort({ createdAt: -1 }).lean();

    const finalizedOffers = await Promise.all(offers.map(async (offer) => {
      const applicantCount = await Application.countDocuments({ offerId: offer._id });
      return { ...offer, applicantCount };
    }));

    res.status(200).json({ success: true, offers: finalizedOffers });
  } catch (err) {
    console.error("Error fetching company offers:", err);
    res.status(500).json({ error: 'Failed to fetch offers', details: err.message });
  }
}

const getCompanyDashboardStats = async (req, res) => {
  try {
    if (req.userType !== 'company') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const companyId = req.user._id;
    console.log('Fetching dashboard stats for company:', companyId);

    // 1. Active Offers: Not manually closed AND deadline not passed
    const activeOffers = await Offer.countDocuments({
      companyId,
      status: 'Open',
      endDateOfApplay: { $gte: new Date() }
    });
    console.log('Active offers count:', activeOffers);

    // Total offers and closed offers
    const totalOffers = await Offer.countDocuments({ companyId });
    const closedOffers = totalOffers - activeOffers;

    // Get all offer IDs for this company to count related applications
    const companyOffers = await Offer.find({ companyId }, '_id');
    const offerIds = companyOffers.map(o => o._id);

    // 2. New Applicants (Last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const newApplicants = await Application.countDocuments({
      offerId: { $in: offerIds },
      createdAt: { $gte: sevenDaysAgo }
    });
    console.log('New applicants count:', newApplicants);

    const prevNewApplicants = await Application.countDocuments({
      offerId: { $in: offerIds },
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
    });

    // Calculate applicant growth
    let applicantGrowth = 0;
    if (prevNewApplicants > 0) {
      applicantGrowth = ((newApplicants - prevNewApplicants) / prevNewApplicants) * 100;
    } else if (newApplicants > 0) {
      applicantGrowth = 100; // 100% growth if prev was 0
    }

    // 3. Total Validated (Hired)
    const hiredCount = await Application.countDocuments({
      offerId: { $in: offerIds },
      status: 'validated'
    });

    // 4. Active Offers growth (vs last month)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prevActiveOffers = await Offer.countDocuments({
      companyId,
      createdAt: { $lt: thirtyDaysAgo },
      status: 'Open',
      endDateOfApplay: { $gte: thirtyDaysAgo }
    });

    let offersGrowth = 0;
    if (prevActiveOffers > 0) {
      offersGrowth = ((activeOffers - prevActiveOffers) / prevActiveOffers) * 100;
    } else if (activeOffers > 0) {
      offersGrowth = 100;
    }

    // Total applicants (all time)
    const totalApplicants = await Application.countDocuments({
      offerId: { $in: offerIds }
    });

    // Accepted count
    const acceptedCount = await Application.countDocuments({
      offerId: { $in: offerIds },
      status: 'accepted'
    });

    // Rejected count
    const rejectedCount = await Application.countDocuments({
      offerId: { $in: offerIds },
      status: 'rejected'
    });

    // Pending Reviews
    const pendingReviews = await Application.countDocuments({
      offerId: { $in: offerIds },
      status: 'applied'
    });
    console.log('Pending reviews count:', pendingReviews);

    // 5. Daily application data for the last 30 days
    console.log('Fetching daily applications stats...');
    const dailyApplications = await Application.aggregate([
      {
        $match: {
          offerId: { $in: offerIds },
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Build a full 30-day array with zero-fills for days with no applications
    const dailyData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const found = dailyApplications.find(d => d._id === dateStr);
      dailyData.push({
        date: dateStr,
        count: found ? found.count : 0
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        activeOffers,
        totalOffers,
        closedOffers,
        newApplicants,
        totalApplicants,
        hiredCount,
        acceptedCount,
        rejectedCount,
        pendingReviews,
        dailyApplications: dailyData,
        applicantGrowth: applicantGrowth.toFixed(1),
        offersGrowth: offersGrowth.toFixed(1)
      }
    });
  } catch (err) {
    console.error("Error fetching company dashboard stats:", err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

const updateOffer = async (req, res) => {
  try {
    if (req.userType !== 'company') {
      return res.status(403).json({ error: 'Only companies can perform this action' });
    }
    // ensure the offer belongs to the requesting company
    const offer = await Offer.findOne({ _id: req.params.id, companyId: req.user._id });
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found or unauthorized' });
    }

    // Parse techStack if it's sent as a JSON string (from FormData)
    if (req.body.techStack && typeof req.body.techStack === 'string') {
      try {
        req.body.techStack = JSON.parse(req.body.techStack);
      } catch (e) {
        console.error('Failed to parse techStack:', e);
      }
    }

    // Update offer data
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    // If a photo was uploaded, update the offer photo with Base64
    if (req.file) {
      const base64Photo = fileToBase64(req.file);
      if (base64Photo) {
        updatedOffer.photo = base64Photo;
        await updatedOffer.save();
      }
    }

    res.status(200).json({ success: true, offer: updatedOffer });
  } catch (err) {
    const errors = handelErrors(err);
    res.status(400).json({ errors });
  }
}

const deleteOffer = async (req, res) => {
  try {
    if (req.userType !== 'company') {
      return res.status(403).json({ error: 'Only companies can perform this action' });
    }
    const offer = await Offer.findOneAndDelete({ _id: req.params.id, companyId: req.user._id });
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found or unauthorized' });
    }
    res.status(200).json({ success: true, message: 'Offer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete offer' });
  }
}

const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Check application status if user is a student
    let isApplied = false;
    let applicationStatus = null;

    // Check if user is logged in via req.user (middleware) or via cookie manually
    const token = req.cookies.jwt;
    let studentId = null;

    if (req.user && req.userType === 'student') {
      studentId = req.user._id;
    } else if (token) {
      try {
        const decoded = jwt.verify(token, 'net ninja secret');
        const student = await Student.findById(decoded.id);
        if (student) studentId = student._id;
      } catch (err) {
        // Token invalid, ignore
      }
    }

    if (studentId) {
      const application = await Application.findOne({
        offerId: req.params.id,
        studentId: studentId
      });
      if (application) {
        isApplied = true;
        applicationStatus = application.status;
      }
    }

    // Fetch associated company to display details
    const company = await Company.findById(offer.companyId).select('-password');
    res.status(200).json({
      success: true,
      offer: { ...offer._doc, isApplied, applicationStatus },
      company
    });
  } catch (err) {
    console.error("Error in getOfferById:", err);
    res.status(500).json({ error: 'Failed to fetch offer', details: err.message });
  }
}


const createApplication = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Verify the user is actually a student
    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(403).json({ success: false, message: 'Only students can apply to offers' });
    }

    const { offerId } = req.body;
    const studentId = req.user._id;

    if (!offerId) {
      return res.status(400).json({ success: false, message: 'Offer ID is required' });
    }

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    // Check if offer is open
    if (offer.status && offer.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'This internship offer is no longer open for applications.' });
    }

    // Check if deadline has passed
    if (offer.endDateOfApplay && new Date(offer.endDateOfApplay) < new Date()) {
      return res.status(400).json({ success: false, message: 'The application deadline for this offer has passed.' });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({ offerId, studentId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied to this offer' });
    }

    const application = await Application.create({
      offerId,
      studentId,
      status: 'applied'
    });

    // Notify the company that a new application arrived for their offer
    const relatedOffer = await Offer.findById(offerId).select('companyId');
    if (relatedOffer) {
      emit('application:new', { offerId: String(offerId), companyId: String(relatedOffer.companyId) });
    }
    res.status(201).json({ success: true, application });
  } catch (err) {
    console.error("Error creating application:", err);
    res.status(500).json({ success: false, message: 'An error occurred while creating the application' });
  }
}

const getCompanyApplications = async (req, res) => {
  try {
    if (req.userType !== 'company') {
      return res.status(403).json({ error: 'Only companies can perform this action' });
    }

    // 1. Find all offers belonging to this company
    const companyOffers = await Offer.find({ companyId: req.user._id });
    const offerIds = companyOffers.map(o => o._id);

    // 2. Find all applications for these offers and populate student and offer data
    // The model name is 'student' (lowercase) in its export
    const applications = await Application.find({ offerId: { $in: offerIds } })
      .populate({ path: 'studentId', model: 'student' })
      .populate('offerId')
      .sort({ createdAt: -1 });
    console.log(applications);

    // 3. Process and calculate match percentage for each application using the existing system
    const processedApplications = applications.map(app => {
      const student = app.studentId;
      const offer = app.offerId;

      let matchPercentage = 0;
      if (student && student.skills && offer && offer.techStack) {
        // Reuse the matching logic from getAllOffers
        const studentSkills = Array.isArray(student.skills)
          ? student.skills.filter(s => !!s).map(s => s.toLowerCase())
          : [];

        const allOfferTags = Array.isArray(offer.techStack)
          ? offer.techStack.flatMap(stack => stack.tags || [])
          : [];

        const lowerOfferTags = allOfferTags.map(tag => tag.toLowerCase());
        const totalRequiredSkills = lowerOfferTags.length;

        // Calculate intersection
        const matchingSkillsCount = lowerOfferTags.filter(tag => studentSkills.includes(tag)).length;

        if (totalRequiredSkills === 0) {
          matchPercentage = 100;
        } else {
          matchPercentage = (matchingSkillsCount / totalRequiredSkills) * 100;
        }
      }

      return {
        ...app.toObject(),
        matchPercentage: Math.round(matchPercentage)
      };
    });

    // 4. Sort by match percentage high to low
    processedApplications.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({ success: true, applications: processedApplications });
  } catch (err) {
    console.error("Error in getCompanyApplications:", err);
    res.status(500).json({ error: 'Failed to fetch company applications' });
  }
}

const getStudentProfileForRecruiter = async (req, res) => {
  try {
    if (req.userType !== 'company' && req.userType !== 'admin' && req.userType !== 'superadmin') {
      return res.status(403).json({ error: 'Only companies, admins, and superadmins can view detailed student profiles' });
    }

    const studentId = req.params.id;
    const student = await Student.findById(studentId).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    let applications = [];
    if (req.userType === 'company') {
      // Find all offers by the requesting company
      const companyOffers = await Offer.find({ companyId: req.user._id });
      const offerIds = companyOffers.map(o => o._id);

      // Find student's applications for these company offers
      applications = await Application.find({
        studentId,
        offerId: { $in: offerIds }
      }).populate('offerId').sort({ createdAt: -1 });
    } else {
      // Admins and superadmins see all applications for this student
      applications = await Application.find({ studentId }).populate('offerId').sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, student, applications });
  } catch (err) {
    console.error("Error in getStudentProfileForRecruiter:", err);
    res.status(500).json({ error: 'Failed to fetch student profile and history' });
  }
}

const getApplicationsByOfferId = async (req, res) => {
  try {
    const { id: offerId } = req.params;

    if (req.userType !== 'company') {
      return res.status(403).json({ error: 'Only companies can perform this action' });
    }

    // 1. Verify the offer belongs to this company
    const offer = await Offer.findOne({ _id: offerId, companyId: req.user._id });
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found or unauthorized' });
    }

    // 2. Find applications for this specific offer
    const applications = await Application.find({ offerId })
      .populate({ path: 'studentId', model: 'student' })
      .sort({ createdAt: -1 });

    // 3. Process and calculate match percentage
    const processedApplications = applications.map(app => {
      const student = app.studentId;
      let matchPercentage = 0;

      if (student && student.skills && offer.techStack) {
        const studentSkills = Array.isArray(student.skills)
          ? student.skills.filter(s => !!s).map(s => s.toLowerCase())
          : [];

        const allOfferTags = Array.isArray(offer.techStack)
          ? offer.techStack.flatMap(stack => stack.tags || [])
          : [];

        const lowerOfferTags = allOfferTags.map(tag => tag.toLowerCase());
        const totalRequiredSkills = lowerOfferTags.length;

        const matchingSkillsCount = lowerOfferTags.filter(tag => studentSkills.includes(tag)).length;

        if (totalRequiredSkills === 0) {
          matchPercentage = 100;
        } else {
          matchPercentage = (matchingSkillsCount / totalRequiredSkills) * 100;
        }
      }

      return {
        ...app.toObject(),
        matchPercentage: Math.round(matchPercentage)
      };
    });

    // Sort by match percentage high to low
    processedApplications.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({ success: true, applications: processedApplications });
  } catch (err) {
    console.error("Error in getApplicationsByOfferId:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getCompanyApplicationById = async (req, res) => {
  try {
    if (req.userType !== 'company' && req.userType !== 'student') {
      return res.status(403).json({ error: 'Only companies and students can perform this action' });
    }

    const { id: applicationId } = req.params;

    // 1. Find the application and populate the related offer
    const application = await Application.findById(applicationId)
      .populate('studentId')
      .populate('offerId');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // 2. Verify authorization
    if (req.userType === 'company') {
      if (application.offerId.companyId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized to view this application' });
      }
    } else { // student
      if (application.studentId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized to view this application' });
      }
    }

    // Reuse the existing matchPercentage logic to provide consistency
    let matchPercentage = 0;
    const student = application.studentId;
    const offer = application.offerId;
    if (student && student.skills && offer && offer.techStack) {
      const studentSkills = Array.isArray(student.skills)
        ? student.skills.filter(s => !!s).map(s => s.toLowerCase())
        : [];
      const allOfferTags = Array.isArray(offer.techStack)
        ? offer.techStack.flatMap(stack => stack.tags || [])
        : [];
      const lowerOfferTags = allOfferTags.map(tag => tag.toLowerCase());
      const totalRequiredSkills = lowerOfferTags.length;
      const matchingSkillsCount = lowerOfferTags.filter(tag => studentSkills.includes(tag)).length;
      if (totalRequiredSkills === 0) {
        matchPercentage = 100;
      } else {
        matchPercentage = (matchingSkillsCount / totalRequiredSkills) * 100;
      }
    }

    const applicationWithMatch = {
      ...application.toObject(),
      matchPercentage: Math.round(matchPercentage)
    };

    res.status(200).json({ success: true, application: applicationWithMatch });
  } catch (err) {
    console.error("Error fetching getCompanyApplicationById:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addApplicationFeedback = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { text } = req.body;

    if (req.userType !== 'company' && req.userType !== 'student') {
      return res.status(403).json({ error: 'Only companies and students can add feedback' });
    }

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Feedback text is required' });
    }

    const application = await Application.findById(applicationId).populate('offerId');
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (req.userType === 'company') {
      if (application.offerId.companyId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized to add feedback to this application' });
      }
    } else if (req.userType === 'student') {
      if (application.studentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized to add feedback to this application' });
      }
      if (application.feedback.length === 0) {
        return res.status(403).json({ error: 'Wait for the company to message you first.' });
      }
    }

    // Add new feedback
    application.feedback.push({
      text: text.trim(),
      authorName: req.userType === 'company' ? (req.user.companyName || 'Company Representative') : (req.user.name || 'Candidate'),
      createdAt: new Date()
    });

    await application.save();

    res.status(200).json({ success: true, application });
  } catch (err) {
    console.error("Error adding application feedback:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { status } = req.body;

    if (req.userType !== 'company') {
      return res.status(403).json({ error: 'Only companies can update application statuses' });
    }

    const normalizedStatus = status.toLowerCase();

    if (!['accepted', 'rejected', 'refused', 'on hold'].includes(normalizedStatus)) {
      return res.status(400).json({ error: 'Invalid status. Must be accepted, rejected, refused, or on hold' });
    }

    // 1. Find the application and populate the offer to check ownership
    const application = await Application.findById(applicationId).populate('offerId');
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // 2. Verify the associated offer belongs to the requesting company
    if (application.offerId.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to update this application' });
    }

    // Guard: Prevent modifications if the application status is already accepted or validated
    if (['accepted', 'validated'].includes(application.status)) {
      return res.status(400).json({ error: 'This application state is locked and cannot be updated' });
    }

    // 3. Update the status
    application.status = normalizedStatus === 'refused' ? 'rejected' : normalizedStatus;
    application.statusChangedAt = new Date();
    await application.save();

    // Notify all clients about the status change
    emit('application:statusChanged', {
      applicationId: String(applicationId),
      status: application.status,
      studentId: String(application.studentId),
      offerId: String(application.offerId._id || application.offerId)
    });
    res.status(200).json({ success: true, application });
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const validateApplicationAdmin = async (req, res) => {
  try {
    const { id: applicationId } = req.params;

    if (req.userType !== 'admin') {
      return res.status(403).json({ error: 'Only admins can validate applications' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update the status
    application.status = 'validated';
    application.statusChangedAt = new Date();
    await application.save();

    // Notify all clients about the admin validation
    emit('application:statusChanged', {
      applicationId: String(applicationId),
      status: 'validated',
      studentId: String(application.studentId),
      offerId: String(application.offerId)
    });

    // ── Generate PDF then send to student & company ──
    try {
      const populatedApp = await Application.findById(applicationId)
        .populate('studentId')
        .populate({ path: 'offerId', populate: { path: 'companyId' } });

      if (populatedApp) {
        const studentEmail = populatedApp.studentId?.email;
        const companyEmail = populatedApp.offerId?.companyId?.email;
        const appUrl = process.env.APP_URL || 'http://localhost:5173';

        // Generate the agreement PDF buffer
        let pdfBuffer = null;
        try {
          pdfBuffer = await generateAgreementPDF(populatedApp);
          console.log('[PDF] Agreement PDF generated successfully.');
        } catch (pdfErr) {
          console.error('[PDF] Failed to generate agreement PDF:', pdfErr.message);
        }

        await sendAgreementEmails({
          application: populatedApp,
          studentEmail,
          companyEmail,
          appUrl,
          pdfBuffer,
        });
      }
    } catch (emailErr) {
      // Do not fail the request if email/pdf sending fails — just log it
      console.error('[Email] Error sending agreement emails:', emailErr.message);
    }

    res.status(200).json({ success: true, application });
  } catch (err) {
    console.error("Error validating application (admin):", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rejectApplicationAdmin = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { reason } = req.body;

    if (req.userType !== 'admin') {
      return res.status(403).json({ error: 'Only admins can reject applications' });
    }

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ error: 'A rejection reason is required' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = 'admin_rejected';
    application.adminRejectionReason = reason.trim();
    application.statusChangedAt = new Date();
    application.studentRead = false;
    application.companyRead = false;
    await application.save();

    // Notify all clients about the admin rejection
    emit('application:statusChanged', {
      applicationId: String(applicationId),
      status: 'admin_rejected',
      studentId: String(application.studentId),
      offerId: String(application.offerId)
    });
    res.status(200).json({ success: true, application });
  } catch (err) {
    console.error("Error rejecting application (admin):", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAdminApplicationsToValidate = async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view these applications' });
    }

    // Fetch accepted, validated, and admin_rejected applications
    let applications = await Application.find({ status: { $in: ['accepted', 'validated', 'admin_rejected'] } })
      .populate('studentId')
      .populate({
        path: 'offerId',
        populate: { path: 'companyId', select: 'companyName logo' }
      })
      .sort({ updatedAt: -1 });
    // Filter manually to ensure case-insensitive matching in case of data inconsistencies
    const adminUni = req.user.universityName ? req.user.universityName.trim().toLowerCase() : '';

    const adminDeptHead = req.user.DeptHead ? req.user.DeptHead.trim().toLowerCase() : '';


    applications = applications.filter(app => {
      if (!app.offerId) return false;
      if (!app.studentId || !app.studentId.specialty || !app.studentId.university) return false;
      const studentSpecialty = app.studentId.specialty.trim().toLowerCase();
      const studentUni = app.studentId.university.trim().toLowerCase();
      return studentSpecialty === adminDeptHead && studentUni === adminUni;
    });

    res.status(200).json({ success: true, applications });
  } catch (err) {
    console.error("Error fetching admin validations:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAdminAllApplications = async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view these applications' });
    }

    let applications = await Application.find()
      .populate('studentId')
      .populate({
        path: 'offerId',
        populate: { path: 'companyId', select: 'companyName logo' }
      })
      .sort({ updatedAt: -1 });

    // Filter manually to ensure case-insensitive matching
    const adminUni = req.user.universityName ? req.user.universityName.trim().toLowerCase() : '';

    applications = applications.filter(app => {
      if (!app.studentId || !app.studentId.university) return false;
      const studentUni = app.studentId.university.trim().toLowerCase();
      return studentUni === adminUni;
    });

    res.status(200).json({ success: true, applications });
  } catch (err) {
    console.error("Error fetching all admin applications:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStudentApplications = async (req, res) => {
  try {
    if (req.userType !== 'student') {
      return res.status(403).json({ error: 'Only students can view their applications' });
    }

    const applications = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'offerId',
        populate: { path: 'companyId', select: 'companyName logo' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (err) {
    console.error("Error fetching student applications:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAdminCompanyProfile = async (req, res) => {
  try {
    if (req.userType !== 'admin' && req.userType !== 'student' && req.userType !== 'superadmin') {
      return res.status(403).json({ error: 'Only admins, students, and superadmins can view company profiles' });
    }

    const { id: companyId } = req.params;

    // Fetch the company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Fetch all offers from this company
    const offers = await Offer.find({ companyId });

    // For stats, we find all applications linked to these offers
    const offerIds = offers.map(o => o._id);
    const applications = await Application.find({ offerId: { $in: offerIds } })
      .populate('studentId');

    // Filter applications down to the admin's university matches (allow all for superadmin/student)
    const isSuperAdmin = req.userType === 'superadmin';
    const isStudent = req.userType === 'student';
    const adminUni = (!isSuperAdmin && !isStudent && req.user && req.user.universityName) ? req.user.universityName.trim().toLowerCase() : '';
    
    const universityApplications = applications.filter(app => {
      if (isSuperAdmin || isStudent) return true;
      if (!app.studentId || !app.studentId.university) return false;
      const studentUni = app.studentId.university.trim().toLowerCase();
      return studentUni === adminUni;
    });

    // Calculate "Total Placed" based on validated applications from this university
    const totalPlaced = universityApplications.filter(app => app.status === 'validated').length;
    // Calculate "Current Interns" as a subset or just same as placed for now
    const currentInterns = totalPlaced;

    // Formatting offers for the frontend
    const recentPostings = offers.map(o => {
      // Determine if offer is open or closed based on arbitrary logic or dates
      const isOpen = o.slotsAvailable > 0;

      return {
        _id: o._id,
        title: o.title,
        team: `${o.techStack && o.techStack.length > 0 ? o.techStack[0].category : 'Engineering'} • ${o.internshipType}`,
        tags: [{ label: isOpen ? 'Open' : 'Closed', classes: isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500' }],
        time: `Posted ${new Date(o.createdAt).toLocaleDateString()}`
      };
    }).reverse();

    return res.status(200).json({
      success: true,
      company: {
        _id: company._id,
        name: company.companyName,
        email: company.email,
        industry: "Technology", // Mocked Fallback since schema doesn't have it
        location: company.address || "Location Unknown",
        size: "N/A", // Mocked Fallback
        website: company.website || "No website provided",
        websiteUrl: company.website ? (company.website.startsWith('http') ? company.website : `https://${company.website}`) : '#',
        tagline: company.companyRole || (company.companyName + " Profile"),
        companyRole: company.companyRole || '',
        mission: company.description || "No mission statement provided.",
        keySectors: (offers.length > 0 && offers[0].techStack) ? offers[0].techStack.map(ts => ts.category) : ['Technology'], // Inferred from offers
        logo: company.logo,
        stats: {
          totalPlaced,
          currentInterns,
          rating: 4.8, // Mocked rating
          reviews: Math.floor(Math.random() * 50) + 10 // Mocked reviews
        },
        recentPostings
      }
    });

  } catch (err) {
    console.error("Error fetching getAdminCompanyProfile:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAdminApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('studentId')
      .populate({
        path: 'offerId',
        populate: { path: 'companyId' }
      });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const student = application.studentId || {};
    const offer = application.offerId || {};
    const company = offer.companyId || {};

    let admin = await Admin.findById(req.user._id).select('universityName DeptHead fullName profilePicture');
    if (!admin) {
      // If the requester is a student or company, find the Admin corresponding to the student's specialty
      admin = await Admin.findOne({ DeptHead: student.specialty }).select('universityName DeptHead fullName profilePicture');
      if (!admin) {
        // Fallback to the first available admin if no exact DeptHead match is found
        admin = await Admin.findOne().select('universityName DeptHead fullName profilePicture');
      }
    }

    const formattedData = {
      studentId: student._id || null,
      studentProfilePicture: student.profilePicture || "",
      studentName: student.name || "Unknown Student",
      studentDept: student.specialty || "Unknown Specialization",
      studentYear: student.currentYear || "Unknown Year",
      offerId: offer._id || null,
      offerTitle: offer.title || "Unknown Position",
      companyId: company._id || null,
      companyName: company.companyName || "Unknown Company",
      internshipOffice: company.internshipOffice || "Unknown Office",
      companyRepresentative: "HR Management", // Using a fallback since there's no representative in Company model
      universityName: admin?.universityName || student.university || "University of Constantine 2",
      universityLogo: admin?.profilePicture || "",
      adminDeptHead: admin?.DeptHead || "",
      adminName: admin?.fullName || "",
      startDate: offer.createdAt ? moment(offer.createdAt).format('MMMM Do, YYYY') : moment().format('MMMM Do, YYYY'),
      endDate: offer.durationMonths ? moment(offer.createdAt).add(offer.durationMonths, 'months').format('MMMM Do, YYYY') : moment().add(6, 'months').format('MMMM Do, YYYY')
    };

    res.status(200).json({ success: true, application: formattedData });
  } catch (err) {
    console.error("Error fetching getAdminApplicationById:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Only allow deletion if student owns it OR it's an admin
    if (req.userType !== 'admin' && application.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Application.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Application deleted successfully' });
  } catch (err) {
    console.error("Error deleting application:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getInboxMessages = async (req, res) => {
  try {
    const userType = req.userType;
    const userId = req.user._id;

    let messages = [];

    if (userType === 'admin') {
      // Admin receives notifications from companies that accepted students
      const applications = await Application.find({ status: 'accepted' })
        .populate({
          path: 'offerId',
          populate: { path: 'companyId', select: 'companyName logo' }
        })
        .populate('studentId', 'name university')
        .lean();

      const adminUni = req.user.universityName ? req.user.universityName.trim().toLowerCase() : '';

      const validApplications = applications.filter(app => {
        if (!app.offerId) return false;
        if (!app.studentId || !app.studentId.university) return false;
        const studentUni = app.studentId.university.trim().toLowerCase();
        return studentUni === adminUni;
      });

      messages = validApplications.map(app => ({
        id: app._id,
        appData: app,
        companyName: app.offerId?.companyId?.companyName || 'Unknown Company',
        logo: app.offerId?.companyId?.logo || null,
        logoText: app.offerId?.companyId?.companyName?.charAt(0) || 'C',
        logoBg: 'bg-slate-900 text-white',
        time: app.statusChangedAt ? moment(app.statusChangedAt).fromNow() : moment(app.updatedAt).fromNow(),
        title: `Internship Placement Accepted - ${app.studentId?.name || 'Student'}`,
        snippet: 'Company has approved the candidate. Awaits your final validation for the agreement.',
        unread: !app.adminRead,
        active: false
      }));

    } else if (userType === 'company') {
      // Company receives notifications from admin for validated/rejected agreements
      const applications = await Application.find({ status: { $in: ['validated', 'admin_rejected'] } })
        .populate({
          path: 'offerId',
          match: { companyId: userId },
          select: 'title companyId',
          populate: { path: 'companyId', select: 'logo' }
        })
        .populate('studentId', 'name profilePicture')
        .lean();

      // Filter out applications where offerId is null (because of match condition above)
      const validApplications = applications.filter(app => app.offerId !== null);

      messages = validApplications.map(app => {
        const isRejected = app.status === 'admin_rejected';
        return {
          id: app._id,
          appData: app,
          companyName: 'University Administration',
          logo: app.studentId?.profilePicture || app.offerId?.companyId?.logo || null,
          logoText: app.studentId?.name?.charAt(0) || 'U',
          logoBg: isRejected ? 'bg-red-600 text-white' : 'bg-blue-600 text-white',
          time: app.statusChangedAt ? moment(app.statusChangedAt).fromNow() : moment(app.updatedAt).fromNow(),
          title: isRejected
            ? `Internship Rejected - ${app.studentId?.name || 'Student'}`
            : `Agreement Ready - ${app.studentId?.name || 'Student'}`,
          snippet: isRejected
            ? `The university has rejected the internship placement for ${app.offerId.title}.`
            : `The university has validated the internship for ${app.offerId.title}. Please review the final agreement.`,
          unread: !app.companyRead,
          active: false
        };
      });

    } else if (userType === 'student') {
      // Student receives notifications from admin for validated/rejected agreements
      const [applications, adminUser] = await Promise.all([
        Application.find({ status: { $in: ['validated', 'admin_rejected', 'company_deleted'] }, studentId: userId })
          .populate({
            path: 'offerId',
            populate: { path: 'companyId', select: 'companyName logo' }
          })
          .lean(),
        Admin.findOne().select('profilePicture').lean()
      ]);

      const validApplications = applications.filter(app => app.offerId || app.status === 'company_deleted');

      messages = validApplications.map(app => {
        if (app.status === 'company_deleted') {
          return {
            id: app._id,
            appData: app,
            companyName: 'System Notification',
            logo: null,
            logoText: 'S',
            logoBg: 'bg-red-600 text-white',
            time: app.statusChangedAt ? moment(app.statusChangedAt).fromNow() : moment(app.updatedAt).fromNow(),
            title: `Offer Deleted - ${app.deletedOfferTitle || 'Position'}`,
            snippet: `The internship offer you applied to has been deleted because the company account (${app.deletedCompanyName || 'Unknown'}) was deleted.`,
            unread: !app.studentRead,
            active: false
          };
        }

        const isRejected = app.status === 'admin_rejected';
        return {
          id: app._id,
          appData: app,
          companyName: 'University Administration',
          logo: adminUser?.profilePicture || null,
          logoText: 'U',
          logoBg: isRejected ? 'bg-red-600 text-white' : 'bg-amber-600 text-white',
          time: app.statusChangedAt ? moment(app.statusChangedAt).fromNow() : moment(app.updatedAt).fromNow(),
          title: isRejected
            ? `Internship Rejected - ${app.offerId?.title || 'Position'}`
            : `Internship Approved - ${app.offerId?.title || 'Position'}`,
          snippet: isRejected
            ? `Your internship application for ${app.offerId?.companyId?.companyName || 'the company'} has been rejected by the administration.`
            : `Your internship with ${app.offerId?.companyId?.companyName || 'the company'} has been fully validated. Your agreement is ready.`,
          unread: !app.studentRead,
          active: false
        };
      });
    }

    res.status(200).json({ success: true, messages });

  } catch (err) {
    console.error('Error fetching inbox messages:', err);
    res.status(500).json({ error: 'Server error fetching inbox.' });
  }
};

const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userType = req.userType;

    let update = {};
    if (userType === 'admin') update = { adminRead: true };
    else if (userType === 'company') update = { companyRead: true };
    else if (userType === 'student') update = { studentRead: true };

    const application = await Application.findByIdAndUpdate(id, update, { returnDocument: 'after' });

    if (!application) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error marking message as read:', err);
    res.status(500).json({ error: 'Server error marking read.' });
  }
};

const getNotificationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userType = req.userType;
    const userId = req.user._id;

    const application = await Application.findById(id)
      .populate('studentId')
      .populate({
        path: 'offerId',
        populate: { path: 'companyId' }
      });

    if (!application) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Security Check
    if (userType === 'student' && application.studentId._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    if (userType === 'company' && application.offerId.companyId._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const student = application.studentId || {};
    const offer = application.offerId || {};
    const company = offer.companyId || {};

    const formattedData = {
      id: application._id,
      studentId: student._id,
      studentName: student.name || "Unknown Student",
      studentEmail: student.email,
      studentProfilePicture: student.profilePicture,
      offerId: offer._id,
      offerTitle: offer.title || "Unknown Position",
      companyName: company.companyName || "Unknown Company",
      companyLogo: company.logo,
      status: application.status,
      adminRejectionReason: application.adminRejectionReason || '',
      receivedAt: application.statusChangedAt || application.updatedAt,
      startDate: offer.createdAt ? moment(offer.createdAt).format('MMMM Do, YYYY') : moment().format('MMMM Do, YYYY'),
      endDate: offer.durationMonths ? moment(offer.createdAt).add(offer.durationMonths, 'months').format('MMMM Do, YYYY') : moment().add(6, 'months').format('MMMM Do, YYYY')
    };

    res.status(200).json({
      success: true,
      notification: formattedData,
      userType: userType
    });
  } catch (err) {
    console.error('Error fetching notification details:', err);
    res.status(500).json({ error: 'Server error fetching notification details' });
  }
};

const getUniversityPlacementStats = async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const universityName = admin.universityName;

    const totalStudents = await Student.countDocuments({ university: universityName });

    const students = await Student.find({ university: universityName }, '_id');
    const studentIds = students.map(s => s._id);

    const validatedApplications = await Application.countDocuments({
      studentId: { $in: studentIds },
      status: 'validated'
    });

    const acceptedApplications = await Application.countDocuments({
      studentId: { $in: studentIds },
      status: 'accepted'
    });

    const placedStudentsList = await Application.distinct('studentId', {
      studentId: { $in: studentIds },
      status: 'validated'
    });

    const placedStudents = placedStudentsList.length;
    const unplacedStudents = totalStudents - placedStudents;
    const placementPercentage = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

    // Monthly Trends (Last N months)
    const trendMonths = parseInt(req.query.months) || 3;
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - (trendMonths - 1));
    pastDate.setDate(1);
    pastDate.setHours(0, 0, 0, 0);

    const trendApps = await Application.find({
      studentId: { $in: studentIds },
      status: { $in: ['accepted', 'validated'] },
      $or: [
        { statusChangedAt: { $gte: pastDate } },
        { updatedAt: { $gte: pastDate } }
      ]
    });

    const monthlyTrends = [];
    if (trendMonths === 1) {
      const bins = [
        { label: '1st', min: 1, max: 10 },
        { label: '10th', min: 10, max: 20 },
        { label: '20th', min: 20, max: 28 },
        { label: 'End', min: 28, max: 32 }
      ];
      const currentMonth = pastDate.getMonth();
      const currentYear = pastDate.getFullYear();

      for (const bin of bins) {
        const count = trendApps.filter(app => {
          const appDate = new Date(app.statusChangedAt || app.updatedAt || app.createdAt);
          return appDate.getMonth() === currentMonth &&
            appDate.getFullYear() === currentYear &&
            appDate.getDate() >= bin.min && appDate.getDate() < bin.max;
        }).length;
        monthlyTrends.push({ month: bin.label, count });
      }
    } else {
      for (let i = trendMonths - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        const monthYear = d.toLocaleString('en-US', { month: 'short' });

        const count = trendApps.filter(app => {
          const appDate = new Date(app.statusChangedAt || app.updatedAt || app.createdAt);
          return appDate.getMonth() === d.getMonth() && appDate.getFullYear() === d.getFullYear();
        }).length;

        monthlyTrends.push({ month: monthYear, count: count });
      }
    }

    // Top Placed Categories logic
    const validatedApps = await Application.find({
      studentId: { $in: studentIds },
      status: 'validated'
    }).populate('offerId');

    const categoryCounts = {};
    validatedApps.forEach(app => {
      let category = 'General';
      if (app.offerId && app.offerId.techStack && app.offerId.techStack.length > 0) {
        category = app.offerId.techStack[0].category || 'General';
      } else if (app.offerId && app.offerId.title) {
        category = app.offerId.title;
      }
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const topCategories = Object.keys(categoryCounts)
      .map(cat => ({ name: cat, count: categoryCounts[cat] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const totalPartners = await Company.countDocuments();
    const wilayas = await Company.distinct('address');
    const totalWilayas = wilayas.filter(w => w && w.trim() !== '').length || 1;

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        validatedApplications,
        acceptedApplications,
        placedStudents,
        unplacedStudents,
        placementPercentage,
        monthlyTrends,
        topCategories,
        totalPartners,
        totalWilayas
      }
    });

  } catch (err) {
    console.error("Error fetching university placement stats:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const superAdminSignup_post = async (req, res) => {
  try {
    const count = await SuperAdmin.countDocuments();
    if (count > 0) {
      return res.status(400).json({ error: 'SuperAdmin already exists in the system. Setup is complete.' });
    }
    const { email, password } = req.body;
    const superAdmin = await SuperAdmin.create({ email, password, role: 'superAdmin' });

    const token = createToken(superAdmin._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: superAdmin._id, role: 'superAdmin' });
  } catch (err) {
    const errors = handelErrors(err);
    res.status(400).json({ errors });
  }
};

const getSuperAdminStats = async (req, res) => {
  try {
    if (req.userType !== 'superAdmin') {
      return res.status(403).json({ error: 'Access denied. SuperAdmin only.' });
    }
    const studentCount = await Student.countDocuments();
    const companyCount = await Company.countDocuments();
    const adminCount = await Admin.countDocuments();
    const offerCount = await Offer.countDocuments();
    const applicationCount = await Application.countDocuments();

    const admins = await Admin.find().sort({ createdAt: -1 });
    const companies = await Company.find().sort({ createdAt: -1 });
    const students = await Student.find().sort({ createdAt: -1 });

    const allUsers = [];
    admins.forEach(u => {
      allUsers.push({
        _id: u._id,
        name: u.fullName || 'N/A',
        email: u.email,
        phone: u.phone || 'N/A',
        profilePicture: u.profilePicture || '',
        role: 'admin',
        details: {
          university: u.universityName || '',
          department: u.DeptHead || ''
        },
        createdAt: u.createdAt
      });
    });
    companies.forEach(u => {
      allUsers.push({
        _id: u._id,
        name: u.companyName || 'N/A',
        email: u.email,
        phone: u.phoneNumber || 'N/A',
        profilePicture: u.logo || '',
        role: 'company',
        details: {
          university: '',
          department: u.internshipOffice || ''
        },
        createdAt: u.createdAt
      });
    });
    students.forEach(u => {
      allUsers.push({
        _id: u._id,
        name: u.name || 'N/A',
        email: u.email,
        phone: u.phoneNumber || 'N/A',
        profilePicture: u.profilePicture || '',
        role: 'student',
        details: {
          university: u.university || '',
          department: u.specialty || ''
        },
        createdAt: u.createdAt
      });
    });

    // Sort combined list by newest first
    allUsers.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.status(200).json({
      stats: {
        students: studentCount,
        companies: companyCount,
        admins: adminCount,
        offers: offerCount,
        applications: applicationCount
      },
      allUsers
    });
  } catch (err) {
    console.error("Error fetching SuperAdmin stats:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUserBySuperAdmin = async (req, res) => {
  try {
    if (req.userType !== 'superAdmin') {
      return res.status(403).json({ error: 'Access denied. SuperAdmin only.' });
    }

    const { role, userId } = req.params;
    let deletedUser = null;

    if (role === 'admin') {
      deletedUser = await Admin.findByIdAndDelete(userId);
    } else if (role === 'company') {
      // For company, let's also delete offers and update application status (same as company self deletion)
      const company = await Company.findById(userId);
      if (company) {
        const companyName = company.companyName;
        const offers = await Offer.find({ companyId: userId });
        for (const offer of offers) {
          await Application.updateMany(
            { offerId: offer._id },
            {
              $set: {
                status: 'company_deleted',
                deletedCompanyName: companyName,
                deletedOfferTitle: offer.title,
                offerId: null,
                statusChangedAt: new Date(),
                studentRead: false
              }
            }
          );
        }
        await Offer.deleteMany({ companyId: userId });
        deletedUser = await Company.findByIdAndDelete(userId);
      }
    } else if (role === 'student') {
      // For student, let's also delete their applications
      await Application.deleteMany({ studentId: userId });
      deletedUser = await Student.findByIdAndDelete(userId);
    } else {
      return res.status(400).json({ error: 'Invalid user role.' });
    }

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ success: true, message: 'User account deleted successfully.' });
  } catch (err) {
    console.error("Error deleting user account by SuperAdmin:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCompanyAccount = async (req, res) => {
  try {
    if (req.userType !== 'company') {
      return res.status(403).json({ error: 'Only companies can perform this action' });
    }

    const companyId = req.user._id;

    // 1. Get the company name for notification
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    const companyName = company.companyName;

    // 2. Find all offers by this company
    const offers = await Offer.find({ companyId });
    const offerIds = offers.map(o => o._id);

    // 3. For each application attached to these offers, update status to 'company_deleted'
    for (const offer of offers) {
      await Application.updateMany(
        { offerId: offer._id },
        {
          $set: {
            status: 'company_deleted',
            deletedCompanyName: companyName,
            deletedOfferTitle: offer.title,
            offerId: null, // Remove reference to soon-to-be-deleted offer
            statusChangedAt: new Date(),
            studentRead: false
          }
        }
      );
    }

    // 4. Delete all offers by this company
    await Offer.deleteMany({ companyId });

    // 5. Delete the company
    await Company.findByIdAndDelete(companyId);

    res.status(200).json({ success: true, message: 'Company account deleted successfully' });
  } catch (err) {
    console.error("Error deleting company account:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  studentSignup_get, studentSignup_post, studentDashboard_get, studentProfile_update, logout_get, login_post, login_get, companySignup_post, companySignup_get, companyProfile_update, adminSignup_post, adminProfile_update, createOffer, getAllOffers, getCompanyOffers, updateOffer, deleteOffer, getOfferById, createApplication, getCompanyApplications, getStudentProfileForRecruiter, getApplicationsByOfferId, updateApplicationStatus, getAdminApplicationsToValidate, getAdminAllApplications, getAdminCompanyProfile, getAdminApplicationById, getCompanyApplicationById, addApplicationFeedback, validateApplicationAdmin, rejectApplicationAdmin, getStudentApplications, deleteApplication, getCompanyDashboardStats, getInboxMessages, markMessageAsRead, getNotificationDetails, getUniversityPlacementStats, deleteCompanyAccount, superAdminSignup_post, getSuperAdminStats, deleteUserBySuperAdmin
};