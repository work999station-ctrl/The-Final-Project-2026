const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
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
    phone: {
        type: String,
        required: true
    },
    universityName: {
        type: String,
        required: true,
        default: "University of Constantine 2" // Based on your document header [cite: 4]
    },

    // Role & Permissions
    role: {
        type: String,

        default: 'admin'
    },

    // Relations
    // This array tracks which internship validations this admin has handled
    //   managedPlacements: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Placement' // Reference to the matching/internship record
    //   }],

    profilePicture: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

adminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
});

//static method to login user
adminSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

module.exports = mongoose.model('Admin', adminSchema);
