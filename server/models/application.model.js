const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    status: {
        type: String,
        enum: ['applied', 'accepted', 'rejected', 'validated', 'admin_rejected', 'on hold'],
        default: 'applied'
    },
    adminRejectionReason: {
        type: String,
        default: ''
    },
    statusChangedAt: {
        type: Date
    },
    adminRead: {
        type: Boolean,
        default: false
    },
    companyRead: {
        type: Boolean,
        default: false
    },
    studentRead: {
        type: Boolean,
        default: false
    },
    feedback: [{
        text: String,
        authorName: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;