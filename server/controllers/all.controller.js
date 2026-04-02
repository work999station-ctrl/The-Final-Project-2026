const Student = require('../models/Student.model');
const Company = require('../models/Company.model');
const Admin = require('../models/Admin.model');
const Offer = require('../models/Offer.model');
const Application = require('../models/application.model');
const moment = require('moment');
const jwt = require('jsonwebtoken');



const handelErrors = (err) => {
  console.log(err, err.code);
  let errors = { name: '', email: '', password: '' };

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
  res.render('studentSignup');
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
  res.render('studentDashboard', { moment: moment });
}


const studentProfile_update = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Parse skills if it's a JSON string (from FormData)
    if (typeof updateData.skills === 'string') {
      try {
        updateData.skills = JSON.parse(updateData.skills);
      } catch (e) {
        // If it's not valid JSON, keep as-is
      }
    }

    // If a file was uploaded, add its path to updateData
    if (req.file) {
      // Store the web-accessible path (e.g., /uploads/student/filename.jpg)
      updateData.profilePicture = `/uploads/student/${req.file.filename}`;
    }

    const result = await Student.findByIdAndUpdate(req.user._id, updateData, { new: true });
    console.log('Profile updated:', result);
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
      // If student login fails, try company login
      try {
        user = await Company.login(email, password);
        role = 'company';
      } catch (companyErr) {
        // If company login fails, try admin login
        user = await Admin.login(email, password);
        role = 'admin';
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
  res.render('login');
}

const companySignup_post = async (req, res) => {
  try {
    console.log(req.body);
    let companyData = { ...req.body };
    if (req.file) {
      companyData.logo = `/uploads/company/${req.file.filename}`;
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
  res.render('companySignup');
}

const companyProfile_update = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If a file was uploaded, add its path to updateData
    if (req.file) {
      updateData.logo = `/uploads/company/${req.file.filename}`;
    }

    const company = await Company.findById(req.user._id);

    // Only allow updates to defined fields
    const allowedUpdates = ['companyName', 'email', 'phoneNumber', 'address', 'website', 'description'];
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
    res.status(200).json({ success: true, user: company });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update company profile' });
  }
};

const adminProfile_update = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If a file was uploaded, add its path to updateData
    if (req.file) {
      updateData.profilePicture = `/uploads/admin/${req.file.filename}`;
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
      adminData.profilePicture = `/uploads/admin/${req.file.filename}`;
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

    const newOffer = await Offer.create({
      ...req.body,
      companyId: req.user._id
    });

    res.status(201).json({ success: true, offer: newOffer });
  } catch (err) {
    const errors = handelErrors(err);
    res.status(400).json({ errors });
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
    res.status(500).json({ error: 'Failed to fetch offers' });
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
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
}

const getCompanyDashboardStats = async (req, res) => {
  try {
    if (req.userType !== 'company') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const companyId = req.user._id;

    // 1. Active Offers: Not manually closed AND deadline not passed
    const activeOffers = await Offer.countDocuments({
      companyId,
      status: 'Open',
      endDateOfApplay: { $gte: new Date() }
    });

    // Get all offer IDs for this company to count related applications
    const companyOffers = await Offer.find({ companyId }, '_id');
    const offerIds = companyOffers.map(o => o._id);

    // 2. New Applicants (Last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newApplicants = await Application.countDocuments({
      offerId: { $in: offerIds },
      createdAt: { $gte: sevenDaysAgo }
    });

    // 3. Total Validated (Hired)
    const hiredCount = await Application.countDocuments({
      offerId: { $in: offerIds },
      status: 'validated'
    });

    // 4. Pending Reviews
    const pendingReviews = await Application.countDocuments({
      offerId: { $in: offerIds },
      status: 'applied'
    });

    res.status(200).json({
      success: true,
      stats: {
        activeOffers,
        newApplicants,
        hiredCount,
        pendingReviews
      }
    });
  } catch (err) {
    console.error("Error fetching company dashboard stats:", err);
    res.status(500).json({ error: 'Internal server error' });
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
      { new: true, runValidators: true }
    );

    // If a logo was uploaded, update the associated company logo
    if (req.file) {
      const company = await Company.findById(req.user._id);
      if (company) {
        company.logo = `/uploads/company/${req.file.filename}`;
        await company.save();
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
    res.status(500).json({ error: 'Failed to fetch offer' });
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
    if (req.userType !== 'company' && req.userType !== 'admin') {
      return res.status(403).json({ error: 'Only companies and admins can view detailed student profiles' });
    }

    const studentId = req.params.id;
    const student = await Student.findById(studentId).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Find all offers by the requesting company
    const companyOffers = await Offer.find({ companyId: req.user._id });
    const offerIds = companyOffers.map(o => o._id);

    // Find student's applications for these company offers
    const applications = await Application.find({
      studentId,
      offerId: { $in: offerIds }
    }).populate('offerId').sort({ createdAt: -1 });

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
const updateApplicationStatus = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { status } = req.body;

    if (req.userType !== 'company') {
      return res.status(403).json({ error: 'Only companies can update application statuses' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be accepted or rejected' });
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

    // 3. Update the status
    application.status = status;
    application.statusChangedAt = new Date();
    await application.save();

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

    res.status(200).json({ success: true, application });
  } catch (err) {
    console.error("Error validating application (admin):", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAdminApplicationsToValidate = async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view these applications' });
    }

    // Fetch accepted and validated applications
    let applications = await Application.find({ status: { $in: ['accepted', 'validated'] } })
      .populate('studentId')
      .populate({
        path: 'offerId',
        populate: { path: 'companyId', select: 'companyName logo' }
      })
      .sort({ updatedAt: -1 });
    // Filter manually to ensure case-insensitive matching in case of data inconsistencies
    const adminUni = req.user.universityName ? req.user.universityName.trim().toLowerCase() : '';

    applications = applications.filter(app => {
      if (!app.offerId || app.offerId.status !== 'Open') return false;
      if (!app.studentId || !app.studentId.university) return false;
      const studentUni = app.studentId.university.trim().toLowerCase();
      return studentUni === adminUni;
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
    if (req.userType !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view company profiles' });
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

    // Filter applications down to the admin's university matches
    const adminUni = req.user.universityName ? req.user.universityName.trim().toLowerCase() : '';
    const universityApplications = applications.filter(app => {
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
        industry: "Technology", // Mocked Fallback since schema doesn't have it
        location: company.address || "Location Unknown",
        size: "N/A", // Mocked Fallback
        website: company.website || "No website provided",
        websiteUrl: company.website ? (company.website.startsWith('http') ? company.website : `https://${company.website}`) : '#',
        tagline: company.companyName + " Profile", // Mock fallback
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

    const formattedData = {
      studentId: student._id || null,
      studentProfilePicture: student.profilePicture || "",
      studentName: student.name || "Unknown Student",
      studentYear: student.currentYear || "Unknown Year",
      offerId: offer._id || null,
      offerTitle: offer.title || "Unknown Position",
      companyId: company._id || null,
      companyName: company.companyName || "Unknown Company",
      companyRepresentative: "HR Management", // Using a fallback since there's no representative in Company model
      universityName: student.university || "University of Constantine 2",
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
        .populate('studentId', 'name')
        .lean();

      const validApplications = applications.filter(app => app.offerId);

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
      // Company receives notifications from admin for validated agreements
      const applications = await Application.find({ status: 'validated' })
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

      messages = validApplications.map(app => ({
        id: app._id,
        appData: app,
        companyName: 'University Administration',
        logo: app.studentId?.profilePicture || app.offerId?.companyId?.logo || null,
        logoText: app.studentId?.name?.charAt(0) || 'U',
        logoBg: 'bg-blue-600 text-white',
        time: app.statusChangedAt ? moment(app.statusChangedAt).fromNow() : moment(app.updatedAt).fromNow(),
        title: `Agreement Ready - ${app.studentId?.name || 'Student'}`,
        snippet: `The university has validated the internship for ${app.offerId.title}. Please review the final agreement.`,
        unread: !app.companyRead,
        active: false
      }));

    } else if (userType === 'student') {
      // Student receives notifications from admin for validated agreements
      const [applications, adminUser] = await Promise.all([
        Application.find({ status: 'validated', studentId: userId })
          .populate({
            path: 'offerId',
            populate: { path: 'companyId', select: 'companyName logo' }
          })
          .lean(),
        Admin.findOne().select('profilePicture').lean()
      ]);

      const validApplications = applications.filter(app => app.offerId);

      messages = validApplications.map(app => ({
        id: app._id,
        appData: app,
        companyName: 'University Administration',
        logo: adminUser?.profilePicture || null,
        logoText: 'U',
        logoBg: 'bg-amber-600 text-white',
        time: app.statusChangedAt ? moment(app.statusChangedAt).fromNow() : moment(app.updatedAt).fromNow(),
        title: `Internship Approved - ${app.offerId?.title || 'Position'}`,
        snippet: `Your internship with ${app.offerId?.companyId?.companyName || 'the company'} has been fully validated. Your agreement is ready.`,
        unread: !app.studentRead,
        active: false
      }));
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

module.exports = {
  studentSignup_get, studentSignup_post, studentDashboard_get, studentProfile_update, logout_get, login_post, login_get, companySignup_post, companySignup_get, companyProfile_update, adminSignup_post, adminProfile_update, createOffer, getAllOffers, getCompanyOffers, updateOffer, deleteOffer, getOfferById, createApplication, getCompanyApplications, getStudentProfileForRecruiter, getApplicationsByOfferId, updateApplicationStatus, getAdminApplicationsToValidate, getAdminAllApplications, getAdminCompanyProfile, getAdminApplicationById, validateApplicationAdmin, getStudentApplications, deleteApplication, getCompanyDashboardStats, getInboxMessages, markMessageAsRead, getNotificationDetails
};