const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        require: [true, 'Please enter an password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    specialty: {
        type: String,
        default: ''
    },
    university: {
        type: String,
        default: ''
    },
    githubPortfolio: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    currentYear: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: '',
    },

    baccalaureate: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    skills: {
        type: [String],
        default: []
    },
    degreeName: { type: String, default: '' },

    expectedGraduationDate: { type: String, default: '' },
    technicalSkills: {
        programmingLanguages: { type: [String], default: [] },
        frameworksTools: { type: [String], default: [] },
        design: { type: [String], default: [] },
        languages: { type: [String], default: [] }
    },
    academicProjects: [{
        title: { type: String, default: '' },
        role: { type: String, default: '' },
        technologies: { type: String, default: '' },
        result: { type: String, default: '' },
        link: { type: String, required: true, default: '' }
    }],
    experience: [{
        type: { type: String, default: '' },
        role: { type: String, default: '' },
        description: { type: String, default: '' }
    }],
    profilePicture: {
        type: String,
        default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjBPPlZgqCxXn4rLkoiUfFHy3MP2QaQAbHzCF--6xNTr52Hop8mjrnlAeaIN-fCEshDEM6yUsNXF0GTpdEmLd_HxUV25KKAkcvhbYOTiZ2-t2MXeOexxuRZ3AXjdAYkGHQZkSS_KBwH14mHdxTRwTuzl_hmkabWkPMyWilyA5bApTa4vFXFuW7MjFwQCE6XUlleuLy2M-TUhBAaD_-MM92RVVtnN6fSGGoH-coRgTEIZdsXtrPeNx8JRpzFeGPOkfqcyWdRU8ZdBo'
    },
    role: {
        type: String,
        default: 'student'
    },
    // applications: [{
    // type: Schema.Types.ObjectId,
    // ref: 'Application' // This assumes you will have an 'Application' model
    // }]
}, {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true
})

studentSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
});

//static method to login user
studentSchema.statics.login = async function (email, password) {
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

const Student = mongoose.model('student', studentSchema);
module.exports = Student;