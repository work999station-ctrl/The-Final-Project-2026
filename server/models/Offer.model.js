const mongoose = require('mongoose');

const OfferSchema = mongoose.Schema({
    // 1. Ownership & Identity
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company', // Reference to your Company model
        required: true
    },
    title: {
        type: String,
        required: true, // e.g., "Full-stack Web Developer Intern"
        trim: true
    },
    description: {
        type: String,
        required: true,
        minLength: 30 // Ensures quality postings
    },

    // 2. Matching & Filtering Logic
    wilaya: {
        type: String,
        required: true, // Crucial for your filter: By Wilaya [cite: 24]
        index: true // Indexed for faster search performance
    },


    // Allows selecting multiple categories (Frontend, Backend) and multiple tags
    techStack: [{
        category: {
            type: String,
            required: true
        },
        tags: [{
            type: String, // e.g., ["React", "Node.js", "MongoDB"]
            trim: true
        }]
    }],

    internshipType: {
        type: String,
        required: true
    },

    // 3. Logistics & Dates
    durationMonths: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    endDateOfApplay: {
        type: Date,
        required: true
    },
    slotsAvailable: {
        type: Number,
        default: 1
    },
    salary: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: ''
    },

    // 4. Status & Tracking
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },

    // Relationships: List of students who applied [cite: 27]
    // applications: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Application'
    // }],

    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Offer', OfferSchema);