import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditStudentProfile = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        university: '',
        currentYear: '',
        country: '',
        githubPortfolio: ''
    });
    const [skills, setSkills] = useState([]);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

    const availableSkills = ['JavaScript', 'HTML', 'CSS', 'Docker', 'AWS', 'SQL', 'Git', 'Java', 'C++', 'Next.js', 'PostgreSQL', 'MongoDB', 'Go', 'Rust', 'Python', 'React', 'Node.js', 'TypeScript', 'Flutter', 'Express'];

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
                        currentYear: data.user.currentYear || '',
                        country: data.user.country || '',
                        githubPortfolio: data.user.githubPortfolio || ''
                    });
                    setSkills(data.user.skills || []);
                    if (data.user.profilePicture) {
                        setProfilePicPreview(data.user.profilePicture);
                    }
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

    const handleSave = async () => {
        setIsSaving(true);
        setError('');

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            // Append skills as JSON string
            submitData.append('skills', JSON.stringify(skills));
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
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-40 py-4 bg-white dark:bg-slate-900 sticky top-0 z-50">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
                                <span className="material-symbols-outlined">hub</span>
                            </div>
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">CampusConnect</h2>
                        </div>
                        <div className="flex flex-1 justify-end gap-6 items-center">
                            <nav className="hidden md:flex items-center gap-8">
                                <a className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary pb-1" href="#" onClick={(e) => { e.preventDefault(); navigate('/student-dashboard'); }}>Dashboard</a>
                                <a className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors" href="#">Offer Discovery</a>
                                <a className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors" href="#">Messages</a>
                                <a className="text-primary font-semibold text-sm transition-colors border-b-2 border-primary pb-1" href="#">Profile</a>
                            </nav>
                            <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-6">
                                <button className="flex items-center justify-center rounded-full size-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
                                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                                </button>
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20 overflow-hidden cursor-pointer">
                                    {profilePicPreview ? (
                                        <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary">person</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-10">
                        <div className="max-w-4xl w-full">
                            {/* Page Header */}
                            <div className="mb-8">
                                <h1 className="font-header text-3xl font-bold text-slate-900 dark:text-white mb-2">Edit Student Profile</h1>
                                <p className="text-slate-500 dark:text-slate-400">Update your profile to get better internship matches and stand out to recruiters.</p>
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

                                    {/* Row 2: University and Current Year */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">school</span>
                                                University
                                            </label>
                                            <div className="relative">
                                                <select
                                                    className="form-select appearance-none w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                    name="university"
                                                    value={formData.university}
                                                    onChange={handleChange}
                                                >
                                                    <option disabled value="">Select your institution</option>
                                                    <option value="University of Constantine 1">University of Constantine 1</option>
                                                    <option value="University of Constantine 2">University of Constantine 2</option>
                                                    <option value="University of Constantine 3">University of Constantine 3</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                                                Current Year
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="e.g. 3rd Year"
                                                type="text"
                                                name="currentYear"
                                                value={formData.currentYear}
                                                onChange={handleChange}
                                            />
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

                                    {/* Skills Section */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">psychology</span>
                                                Skills
                                            </label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                                                    className="flex items-center gap-1 px-4 h-9 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-lg">add</span>
                                                    Add Skill
                                                </button>
                                                {showSkillsDropdown && (
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 py-2 max-h-60 overflow-y-auto">
                                                        <ul className="py-1 text-sm text-slate-700 dark:text-slate-300">
                                                            {availableSkills
                                                                .filter(s => !skills.includes(s))
                                                                .map(skill => (
                                                                    <li key={skill}>
                                                                        <button
                                                                            type="button"
                                                                            key={skill}
                                                                            onClick={() => handleAddSkill(skill)}
                                                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors"
                                                                        >
                                                                            {skill}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            <li><hr className="border-slate-200 dark:border-slate-700 my-1" /></li>
                                                            <li>
                                                                <button type="button" className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium text-primary text-sm"
                                                                    onClick={handleCustomSkill}>
                                                                    <span className="material-symbols-outlined text-sm align-middle mr-1">edit</span>Type custom skill
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 min-h-[40px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                            {skills.length === 0 && (
                                                <span className="text-slate-400 text-sm">No skills added yet. Click "Add Skill" to get started.</span>
                                            )}
                                            {skills.map(skill => (
                                                <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium border border-primary/20">
                                                    {skill}
                                                    <button
                                                        onClick={() => handleRemoveSkill(skill)}
                                                        className="ml-1 hover:text-red-500 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">close</span>
                                                    </button>
                                                </span>
                                            ))}
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
                        © 2024 CampusConnect Inc. All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default EditStudentProfile;
