import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import StudentSidebar from '../components/StudentSidebar';

const EditStudentProfile = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        university: '',
        specialty: '',
        currentYear: '',
        country: '',
        githubPortfolio: '',
        baccalaureate: '',
        bio: '',
        degreeName: '',
        universityCity: '',
        expectedGraduationDate: ''
    });
    const [skills, setSkills] = useState([]);
    const [technicalSkills, setTechnicalSkills] = useState({
        programmingLanguages: [],
        frameworksTools: [],
        design: [],
        languages: []
    });
    const [academicProjects, setAcademicProjects] = useState([]);
    const [experience, setExperience] = useState([]);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
    const [student, setStudent] = useState(null);
    const [isExtractingCV, setIsExtractingCV] = useState(false);

    const skillCategories = [
        { name: 'Front-end', skills: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Angular', 'HTML/CSS'] },
        { name: 'Back-end', skills: ['Node.js', 'Express', 'Python', 'Django', 'Go', 'PHP', 'Java', 'C++', 'Rust'] },
        { name: 'Mobile', skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'] },
        { name: 'Database', skills: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Firebase', 'SQL'] },
        { name: 'DevOps', skills: ['Docker', 'AWS', 'CI/CD', 'Linux', 'Git'] },
        { name: 'E-commerce & Marketing', skills: ['Shopify', 'WooCommerce', 'SEO', 'Google Analytics', 'Social Media Management', 'Email Marketing', 'Copywriting'] },
        { name: 'Design & Media', skills: ['Adobe Photoshop', 'Illustrator', 'Premiere Pro', 'UI/UX Design', 'Graphic Design'] },
        { name: 'Business & Management', skills: ['Project Management', 'Agile/Scrum', 'Business Analysis', 'CRM'] },
        { name: 'Psychology & HR', skills: ['Recruitment', 'Talent Acquisition', 'Training & Development', 'Conflict Resolution'] },
        { name: 'Sport & Health', skills: ['Sports Coaching', 'Personal Training', 'Sports Nutrition', 'First Aid'] }
    ];

    const toggleSkill = (skill) => {
        if (skills.includes(skill)) {
            setSkills(skills.filter(s => s !== skill));
        } else {
            setSkills([...skills, skill]);
        }
    };

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const res = await fetch('/api/student/me');
                const data = await res.json();

                if (res.ok && data.user) {
                    setFormData({
                        name: data.user.name || '',
                        email: data.user.email || '',
                        phoneNumber: data.user.phoneNumber || '',
                        university: data.user.university || '',
                        specialty: data.user.specialty || '',
                        currentYear: data.user.currentYear || '',
                        country: data.user.country || '',
                        githubPortfolio: data.user.githubPortfolio || '',
                        baccalaureate: data.user.baccalaureate || '',
                        bio: data.user.bio || '',
                        degreeName: data.user.degreeName || '',
                        universityCity: data.user.universityCity || '',
                        expectedGraduationDate: data.user.expectedGraduationDate || ''
                    });
                    setSkills(data.user.skills || []);
                    setTechnicalSkills(data.user.technicalSkills || { programmingLanguages: [], frameworksTools: [], design: [], languages: [] });
                    setAcademicProjects(data.user.academicProjects || []);
                    setExperience(data.user.experience || []);
                    if (data.user.profilePicture) {
                        setProfilePicPreview(data.user.profilePicture);
                    }
                    setStudent(data.user);
                } else {
                    setError('Failed to load profile data.');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Connection error loading profile.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setProfilePicPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAddSkill = (skill) => {
        if (skill && skill.trim() && !skills.includes(skill.trim())) {
            setSkills([...skills, skill.trim()]);
            setShowSkillsDropdown(false);
        } else if (skills.includes(skill?.trim())) {
            alert('Skill already added!');
        }
    };

    const handleCustomSkill = () => {
        const customSkill = prompt('Enter a new skill:');
        if (customSkill) handleAddSkill(customSkill);
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleCVUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsExtractingCV(true);
        const form = new FormData();
        form.append('cv', file);

        try {
            const response = await fetch('/api/student/parse-cv', {
                method: 'POST',
                body: form
            });
            const result = await response.json();

            if (result.success && result.data) {
                const data = result.data;
                
                setFormData(prev => ({
                    ...prev,
                    baccalaureate: prev.baccalaureate || data.baccalaureate || '',
                    githubPortfolio: prev.githubPortfolio || data.githubPortfolio || '',
                    phoneNumber: prev.phoneNumber || data.phoneNumber || '',
                    bio: prev.bio || data.bio || '',
                    expectedGraduationDate: prev.expectedGraduationDate || data.expectedGraduationDate || ''
                }));
                
                if (data.skills && Array.isArray(data.skills)) {
                    setSkills(prev => Array.from(new Set([...prev, ...data.skills])));
                }

                if (data.academicProjects && Array.isArray(data.academicProjects)) {
                    setAcademicProjects(prev => [...prev, ...data.academicProjects]);
                }

                if (data.experience && Array.isArray(data.experience)) {
                    setExperience(prev => [...prev, ...data.experience]);
                }

                alert('CV Successfully Parsed! Extracted information has been filled.');
            } else {
                alert(result.error || 'Failed to parse CV.');
            }
        } catch (error) {
            console.error('Error uploading CV:', error);
            alert('An error occurred while parsing the CV.');
        } finally {
            setIsExtractingCV(false);
            // Clear the input so the same file can be uploaded again if needed
            e.target.value = null;
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError('');

        if (formData.githubPortfolio && !/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+/.test(formData.githubPortfolio)) {
            setError('Please enter a valid GitHub profile link.');
            setIsSaving(false);
            return;
        }

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            // Append skills as JSON string
            submitData.append('skills', JSON.stringify(skills));
            submitData.append('technicalSkills', JSON.stringify(technicalSkills));
            submitData.append('academicProjects', JSON.stringify(academicProjects));
            submitData.append('experience', JSON.stringify(experience));
            if (profilePicFile) {
                submitData.append('profile_picture', profilePicFile);
            }

            const res = await fetch('/api/student/profile', {
                method: 'PUT',
                body: submitData
            });

            const data = await res.json();

            if (res.ok) {
                navigate('/student-dashboard');
            } else {
                setError(data.error || 'Failed to save changes.');
            }
        } catch (err) {
            console.error('Save error:', err);
            setError('Connection error saving profile.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <StudentNavbar student={student} />
                    <StudentSidebar student={student} activePage="settings" />

                    <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-10 md:ml-64 transition-all duration-300">
                        <div className="max-w-4xl w-full">
                            {/* Page Header */}
                            <div className="mb-8">
                                <h1 className="font-header text-3xl font-bold text-slate-900 dark:text-white mb-2">Edit Student Profile</h1>
                                <p className="text-slate-500 dark:text-slate-400">Update your CV to get better internship matches and stand out to recruiters.</p>
                            </div>

                            {/* Main Form Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                {error && (
                                    <div className="mx-8 mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </div>
                                )}

                                {/* Profile Picture Section */}
                                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="relative group overflow-hidden">
                                                <div className="bg-primary/5 dark:bg-primary/10 bg-center overflow-hidden bg-no-repeat aspect-square bg-cover rounded-2xl size-32 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                                                    {profilePicPreview ? (
                                                        <img src={profilePicPreview} alt="Profile Picture" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="font-header text-slate-900 dark:text-white text-xl font-bold">Profile Picture</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Recommended: 800x800px. PNG or JPG.</p>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Max size of 5MB.</p>
                                            </div>
                                        </div>
                                        <label className="flex items-center justify-center gap-2 px-6 h-11 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer">
                                            <span className="material-symbols-outlined text-lg">upload_file</span>
                                            <span>Change Photo</span>
                                            <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="p-8 space-y-8">
                                    {/* Row 1: Name, Email and Phone */}
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">person</span>
                                                Full Name
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="Your full name"
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">mail</span>
                                                Email Address
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="student@university.edu"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">call</span>
                                                Phone Number
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="+213 555 00 00 00"
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Education Row: Degree, University City, Expected Graduation */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">workspace_premium</span>
                                                Degree Name
                                            </label>
                                            <select
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                name="degreeName"
                                                value={formData.degreeName}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select a degree</option>
                                                <option value="Licence (LMD)">Licence (LMD)</option>
                                                <option value="Master">Master</option>
                                                <option value="Doctorat">Doctorat</option>
                                                <option value="Ingénieur d'État">Ingénieur d'État</option>
                                                <option value="Technicien Supérieur (BTS/DTS)">Technicien Supérieur (BTS/DTS)</option>
                                                <option value="Bachelor of Science">Bachelor of Science</option>
                                                <option value="Bachelor of Arts">Bachelor of Arts</option>
                                                <option value="MBA">MBA</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">event</span>
                                                Expected Graduation Date
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="e.g. June 2026"
                                                type="text"
                                                name="expectedGraduationDate"
                                                value={formData.expectedGraduationDate}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Legacy University, Specialty, and Current Year */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">school</span>
                                                University
                                            </label>
                                            <div className="relative">
                                                <input
                                                    className="form-input appearance-none w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-4 py-3 transition-all opacity-70 cursor-not-allowed"
                                                    type="text"
                                                    name="university"
                                                    value={formData.university || 'Not specified'}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">workspace_premium</span>
                                                Specialty
                                            </label>
                                            <div className="relative">
                                                <input
                                                    className="form-input appearance-none w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-4 py-3 transition-all opacity-70 cursor-not-allowed"
                                                    type="text"
                                                    name="specialty"
                                                    value={formData.specialty || 'Not specified'}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                                                Current Year
                                            </label>
                                            <div className="relative">
                                                <select
                                                    className="form-select appearance-none w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                    name="currentYear"
                                                    value={formData.currentYear}
                                                    onChange={handleChange}
                                                >
                                                    <option disabled value="">Select your year</option>
                                                    <option value="L3">L3</option>
                                                    <option value="Master 1">Master 1</option>
                                                    <option value="Master 2">Master 2</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 3: Country and GitHub */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                                Country / Location
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="Algeria"
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">code</span>
                                                GitHub / Portfolio
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="https://github.com/username"
                                                type="url"
                                                name="githubPortfolio"
                                                value={formData.githubPortfolio}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 4: Baccalaureate */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">workspace_premium</span>
                                                Baccalaureate Graduation Year
                                            </label>
                                            <select
                                                className="form-select w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                name="baccalaureate"
                                                value={formData.baccalaureate}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Year</option>
                                                {Array.from({ length: 2026 - 1980 + 1 }, (_, i) => 2026 - i).map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Row 5: Bio */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-lg">article</span>
                                            Bio / About Me
                                        </label>
                                        <textarea
                                            className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all min-h-[120px] resize-y"
                                            placeholder="Write a short bio about yourself, your goals, and what makes you unique..."
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    {/* Skills Section */}
                                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center justify-between mt-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5 border-none">
                                                <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                                                <span className="font-header text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">Skills &amp; Expertise</span>
                                            </label>
                                        </div>

                                        <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 min-h-[72px]">
                                            {skills.map((skill, index) => (
                                                <div key={index} className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-medium">
                                                    {skill}
                                                    <span className="material-symbols-outlined text-[14px] cursor-pointer ml-1 hover:text-white/80 transition-colors" onClick={() => toggleSkill(skill)}>close</span>
                                                </div>
                                            ))}

                                            <div className="relative inline-block w-full">
                                                {!showSkillsDropdown && (
                                                    <button
                                                        className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium border border-primary text-primary hover:bg-primary/5 transition-colors mt-1"
                                                        type="button"
                                                        onClick={() => setShowSkillsDropdown(true)}
                                                    >
                                                        <span className="material-symbols-outlined text-sm">add</span> Add Skill
                                                    </button>
                                                )}
                                                
                                                {showSkillsDropdown && (
                                                    <div className="mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                                                        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 z-10 sticky top-0">
                                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Skills</span>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setShowSkillsDropdown(false)}
                                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center justify-center p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                                                            >
                                                                <span className="material-symbols-outlined text-lg">close</span>
                                                            </button>
                                                        </div>
                                                        <div className="max-h-60 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-800/30">
                                                            {skillCategories.map((cat) => (
                                                                <div key={cat.name} className="mb-4 last:mb-0">
                                                                    <div className="px-1 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{cat.name}</div>
                                                                    <div className="flex flex-wrap gap-2 px-1">
                                                                        {cat.skills.map((skill) => (
                                                                            <button
                                                                                type="button"
                                                                                key={skill}
                                                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${skills.includes(skill)
                                                                                    ? 'border-[#4F46E5] text-[#4F46E5] bg-[#4F46E5]/10 shadow-sm'
                                                                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5'
                                                                                    }`}
                                                                                onClick={() => toggleSkill(skill)}
                                                                            >
                                                                                {skill}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Academic Projects Section */}
                                    <div className="flex flex-col gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="font-header text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary">terminal</span>
                                                    Academic Projects
                                                </h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">This is where you prove you can code. Describe 2–3 projects.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setAcademicProjects([...academicProjects, { title: '', role: '', technologies: '', result: '', link: '' }])}
                                                className="flex items-center justify-center gap-1 px-4 h-10 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 transition-all shrink-0"
                                            >
                                                <span className="material-symbols-outlined text-lg">add</span>
                                                Add Project
                                            </button>
                                        </div>

                                        {academicProjects.map((proj, idx) => (
                                            <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col gap-5 relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setAcademicProjects(academicProjects.filter((_, i) => i !== idx))}
                                                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Project Title</label>
                                                        <input type="text" value={proj.title} onChange={(e) => { const newP = [...academicProjects]; newP[idx].title = e.target.value; setAcademicProjects(newP); }} className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2" placeholder="e.g. E-commerce App using Flutter" />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Your Role</label>
                                                        <input type="text" value={proj.role} onChange={(e) => { const newP = [...academicProjects]; newP[idx].role = e.target.value; setAcademicProjects(newP); }} className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2" placeholder="Briefly explain what you built" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Technologies Used</label>
                                                        <input type="text" value={proj.technologies} onChange={(e) => { const newP = [...academicProjects]; newP[idx].technologies = e.target.value; setAcademicProjects(newP); }} className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2" placeholder="e.g. Used MongoDB for the backend and Flutter for the UI" />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Project Link (Optional)</label>
                                                        <input type="url" value={proj.link || ''} onChange={(e) => { const newP = [...academicProjects]; newP[idx].link = e.target.value; setAcademicProjects(newP); }} className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2" placeholder="e.g. https://github.com/my-project" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Result</label>
                                                    <textarea value={proj.result} onChange={(e) => { const newP = [...academicProjects]; newP[idx].result = e.target.value; setAcademicProjects(newP); }} className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2 min-h-[80px]" placeholder="e.g. Successfully implemented a real-time payment notification system." />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Experience Section */}
                                    <div className="flex flex-col gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="font-header text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary">work</span>
                                                    Experience (Work or Volunteer)
                                                </h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Include part-time jobs, volunteering, or club involvement.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setExperience([...experience, { type: 'Part-time jobs', role: '', description: '' }])}
                                                className="flex items-center gap-1 px-4 h-10 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 transition-all shrink-0 justify-center"
                                            >
                                                <span className="material-symbols-outlined text-lg">add</span>
                                                Add Experience
                                            </button>
                                        </div>

                                        {experience.map((exp, idx) => (
                                            <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col gap-5 relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setExperience(experience.filter((_, i) => i !== idx))}
                                                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Experience Type</label>
                                                        <select value={exp.type} onChange={(e) => { const newE = [...experience]; newE[idx].type = e.target.value; setExperience(newE); }} className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2 h-11">
                                                            <option>Part-time jobs</option>
                                                            <option>Volunteering</option>
                                                            <option>Club involvement</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Role or Title</label>
                                                        <input type="text" value={exp.role} onChange={(e) => { const newE = [...experience]; newE[idx].role = e.target.value; setExperience(newE); }} className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2" placeholder="e.g. Member of Tech Club" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Description</label>
                                                    <textarea value={exp.description} onChange={(e) => { const newE = [...experience]; newE[idx].description = e.target.value; setExperience(newE); }} className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2 min-h-[80px]" placeholder="Briefly explain what you did and the skills you gained" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="flex items-center gap-4 py-2">
                                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap">Or — Upload your CV</span>
                                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                                    </div>

                                    {/* CV Upload Section */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-slate-200 dark:border-slate-800">
                                        <div>
                                            <h3 className="font-header text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">description</span>
                                                Auto-fill with CV
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Upload your resume to automatically extract and fill your profile details.</p>
                                        </div>
                                        <div className="relative shrink-0">
                                            <input 
                                                type="file" 
                                                accept=".pdf,.doc,.docx" 
                                                onChange={handleCVUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                                disabled={isExtractingCV}
                                                title="Upload CV"
                                            />
                                            <button
                                                type="button"
                                                disabled={isExtractingCV}
                                                className={`flex items-center gap-2 px-6 h-12 rounded-full text-sm font-bold transition-all ${
                                                    isExtractingCV 
                                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                                                    : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                                                }`}
                                            >
                                                {isExtractingCV ? (
                                                    <><span className="material-symbols-outlined text-lg animate-spin">progress_activity</span> Extracting...</>
                                                ) : (
                                                    <><span className="material-symbols-outlined text-lg">upload_file</span> Upload CV</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse justify-end gap-4 md:flex-row">
                                    <button
                                        onClick={() => navigate('/student-dashboard')}
                                        className="px-8 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-sm"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-10 h-12 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 text-sm flex items-center justify-center gap-2"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Additional Help Section */}
                            <div className="mt-8 p-6 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-4">
                                <span className="material-symbols-outlined text-primary">info</span>
                                <div>
                                    <h4 className="font-header text-primary font-bold">Complete Your Profile</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">A complete profile helps recruiters find you faster. Students with complete profiles receive 3x more internship offers.</p>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="py-10 text-center text-slate-400 text-sm">
                        © 2026 stage.io Inc. All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default EditStudentProfile;
