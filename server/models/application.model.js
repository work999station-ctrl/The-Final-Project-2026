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
        enum: ['applied', 'accepted', 'rejected', 'validated'],
        default: 'applied'
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
    }
}, {
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;