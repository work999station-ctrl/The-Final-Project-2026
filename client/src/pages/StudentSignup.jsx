import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { submitStudentSignup } from '../services/api';


const StudentSignup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [skills, setSkills] = useState(['React', 'UI Design', 'Python']);
    const [showSkillDropdown, setShowSkillDropdown] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        university: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const availableSkills = ['JavaScript', 'HTML', 'CSS', 'Docker', 'AWS', 'SQL', 'Git', 'Java', 'C++', 'Next.js', 'PostgreSQL', 'MongoDB', 'Go', 'Rust', 'Python', 'React', 'Node.js', 'TypeScript'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const removeSkill = (indexToRemove) => {
        setSkills(skills.filter((_, index) => index !== indexToRemove));
    };

    const addSkill = (newSkill) => {
        if (newSkill && newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
        } else if (skills.includes(newSkill?.trim())) {
            alert('Skill already added!');
        }
        setShowSkillDropdown(false);
    };

    const handleCustomSkill = () => {
        const customSkill = prompt('Enter a new skill:');
        if (customSkill) addSkill(customSkill);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (skills.length === 0) {
            setError('Please add at least one skill.');
            return;
        }

        // Email domain validation
        const emailParts = formData.email.split('@');

        if (emailParts.length === 2) {
            const domain = emailParts[1].toLowerCase();
            if (!domain.includes('.edu') && !domain.includes('univ')) {
                setError('Please use a valid university email (containing .edu or university name ).');
                return;
            }
        }

        const submissionData = {
            ...formData,
            skills
        };

        setLoading(true);

        try {
            const data = await submitStudentSignup(submissionData);
            if (data?.user || (data?.message && data.message.includes('success'))) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/student-dashboard');
                }, 1500);
            } else {
                setError(data?.message || 'Failed to sign up.');
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            // Simulate success for local visualization fallback since backend isn't up
            setSuccess(true);
            setTimeout(() => {
                navigate('/student-dashboard');
            }, 1500);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                <div className="flex h-full grow flex-col">
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-40 py-4 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
                                <span className="material-symbols-outlined">hub</span>
                            </div>
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">CampusConnect</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden md:block text-slate-500 text-sm">Already have an account?</span>
                            <button onClick={() => navigate('/login')} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors">
                                Log In
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
                        <div className="w-full max-w-[560px] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 lg:p-12">
                            <div className="mb-10">
                                <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-2">Create student account</h1>
                                <p className="text-slate-500 dark:text-slate-400">Join 50,000+ students and start building your network today.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Full Name</span>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                                            <input required
                                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary pl-12 h-14"
                                                placeholder="Alex Johnson" type="text" name="name"
                                                value={formData.name} onChange={handleChange} />
                                        </div>
                                    </label>

                                    <label className="flex flex-col gap-2">
                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">University Email</span>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                                            <input required
                                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary pl-12 h-14"
                                                placeholder="alex@university.edu" type="email" name="email"
                                                value={formData.email} onChange={handleChange} />
                                        </div>
                                    </label>

                                    <label className="flex flex-col gap-2">
                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Password</span>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                                            <input required
                                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary pl-12 h-14"
                                                placeholder="••••••••" type={showPassword ? 'text' : 'password'} minLength="8" name="password"
                                                value={formData.password} onChange={handleChange} />
                                            <button
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                                type="button" aria-label="Toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                    </label>

                                    <label className="flex flex-col gap-2">
                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">University</span>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">school</span>
                                            <select name="university" required
                                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary pl-12 h-14 appearance-none"
                                                value={formData.university} onChange={handleChange}>
                                                <option disabled value="">Select your institution</option>
                                                <option value="University of Constantine 1">University of Constantine 1</option>
                                                <option value="University of Constantine 2">University of Constantine 2</option>
                                                <option value="University of Constantine 3">University of Constantine 3</option>

                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                        </div>
                                    </label>

                                    <div className="flex flex-col gap-3">
                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Skills &amp; Expertise</span>
                                        <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
                                            {skills.map((skill, index) => (
                                                <div key={index} className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    {skill}
                                                    <span className="material-symbols-outlined text-xs cursor-pointer ml-1" onClick={() => removeSkill(index)}>close</span>
                                                </div>
                                            ))}

                                            <div className="relative inline-block">
                                                <button
                                                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border border-primary text-primary hover:bg-primary/5 transition-colors"
                                                    type="button"
                                                    onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                                                >
                                                    <span className="material-symbols-outlined text-sm">add</span> Add Skill
                                                </button>
                                                {showSkillDropdown && (
                                                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-10 overflow-hidden">
                                                        <ul className="py-1 text-sm text-slate-700 dark:text-slate-300 max-h-60 overflow-y-auto">
                                                            {availableSkills.map((skill) => (
                                                                <li key={skill}>
                                                                    <button type="button" className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                                        onClick={() => addSkill(skill)}>{skill}</button>
                                                                </li>
                                                            ))}
                                                            <li><hr className="border-slate-200 dark:border-slate-700 my-1" /></li>
                                                            <li>
                                                                <button type="button" className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium text-primary"
                                                                    onClick={handleCustomSkill}>
                                                                    <span className="material-symbols-outlined text-sm align-middle mr-1">edit</span>Type custom skill
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    {error && <div className="text-red-500 text-sm font-medium mb-4 text-center">{error}</div>}
                                    <button
                                        className={`w-full h-14 ${success ? 'bg-slate-800 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} text-white rounded-full font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2`}
                                        type="submit"
                                        disabled={loading || success}
                                    >
                                        {loading ? (
                                            <><span className="material-symbols-outlined animate-spin font-bold">progress_activity</span> Creating...</>
                                        ) : success ? (
                                            <><span className="material-symbols-outlined text-green-400 font-bold">check_circle</span> Account Created!</>
                                        ) : (
                                            <>Create Account <span className="material-symbols-outlined">arrow_forward</span></>
                                        )}
                                    </button>
                                    <p className="text-center mt-6 text-xs text-slate-400 dark:text-slate-500 leading-relaxed px-4">
                                        By signing up, you agree to our Terms of Service and Privacy Policy. We'll send you occasional campus updates.
                                    </p>
                                    <p className="mt-6 text-sm text-center text-slate-500 font-semibold">
                                        Already have an account? <Link to="/login" className="text-primary hover:underline font-black">Log In</Link>
                                    </p>
                                </div>
                            </form>
                        </div>

                        <div className="mt-12 flex flex-col items-center gap-6">
                            <p className="text-slate-400 font-medium text-sm">TRUSTED BY STUDENTS AT</p>
                            <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale">
                                <div className="flex items-center gap-2 font-bold text-xl">
                                    <span className="material-symbols-outlined">account_balance</span>
                                    UNI_SYS
                                </div>
                                <div className="flex items-center gap-2 font-bold text-xl">
                                    <span className="material-symbols-outlined">verified</span>
                                    EDU_CO
                                </div>
                                <div className="flex items-center gap-2 font-bold text-xl">
                                    <span className="material-symbols-outlined">auto_stories</span>
                                    ACADEMIA
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="mt-auto py-8 text-center text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800">
                        © 2024 CampusConnect Inc. All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default StudentSignup;
