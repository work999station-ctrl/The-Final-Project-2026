const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const companySchema = mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'Please enter a company name']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    description: {
        type: String,
        default: ''
    },
    logo: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'company'
    },
    // offers: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Offer'
    // }]
}, {
    timestamps: true
});

// Hash password before saving
companySchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
});

// Static method to login company
companySchema.statics.login = async function (email, password) {
    const company = await this.findOne({ email });
    if (company) {
        const auth = await bcrypt.compare(password, company.password);
        if (auth) {
            return company;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const Company = mongoose.model('company', companySchema);
module.exports = Company;