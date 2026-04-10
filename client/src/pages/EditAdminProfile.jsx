import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

const EditAdminProfile = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        universityName: '',
        role: ''
    });
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const res = await fetch('/api/admin/me');
                const data = await res.json();

                if (res.ok && data.user) {
                    setFormData({
                        fullName: data.user.fullName || '',
                        email: data.user.email || '',
                        phone: data.user.phone || '',
                        universityName: data.user.universityName || '',
                        role: data.user.role || ''
                    });
                    if (data.user.profilePicture) {
                        setProfilePicPreview(data.user.profilePicture);
                    }
                } else {
                    setError('Failed to load admin profile data.');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Connection error loading profile.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminProfile();
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

    const handleSave = async () => {
        setIsSaving(true);
        setError('');

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            if (profilePicFile) {
                submitData.append('profilePicture', profilePicFile);
            }

            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                body: submitData
            });

            const data = await res.json();

            if (res.ok) {
                navigate('/admin-dashboard');
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
                        <AdminNavbar />

                    <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-10">
                        <div className="max-w-4xl w-full">
                            {/* Page Header */}
                            <div className="mb-8">
                                <h1 className="font-header text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center md:text-left">Admin Profile Management</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-center md:text-left">Update your administrative credentials and university information.</p>
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
                                                        <img src={profilePicPreview} alt="Admin Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-4xl text-slate-400">admin_panel_settings</span>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="font-header text-slate-900 dark:text-white text-xl font-bold">Administrative Photo</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Recommended: 800x800px. PNG or JPG.</p>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Max size of 5MB.</p>
                                            </div>
                                        </div>
                                        <label className="flex items-center justify-center gap-2 px-6 h-11 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer w-full sm:w-auto">
                                            <span className="material-symbols-outlined text-lg">upload_file</span>
                                            <span>Upload New Photo</span>
                                            <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="p-8 space-y-8">
                                    {/* Row 1: Full Name and Email */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">person</span>
                                                Full Name
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="e.g. Dr. Jane Doe"
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">mail</span>
                                                Administrative Email
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="admin@university.edu"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2: Phone and Admin Role */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">call</span>
                                                Direct Phone Number
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="+213 000 000 000"
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {/* <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">badge</span>
                                                Administrative Role
                                            </label>
                                            <select 
                                                name="role"
                                                className="form-select w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all appearance-none"
                                                value={formData.role}
                                                onChange={handleChange}
                                            >
                                                <option value="Admin">System Administrator</option>
                                                <option value="Dept_Head">Department Head</option>
                                                <option value="Internship_Office_Staff">Internship Office Staff</option>
                                            </select>
                                        </div> */}
                                    </div>

                                    {/* Row 3: University Name */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-lg">school</span>
                                            University / Institution Name
                                        </label>
                                        <input
                                            className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                            placeholder="University of Constantine 2 (IFA)"
                                            type="text"
                                            name="universityName"
                                            value={formData.universityName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse justify-end gap-4 md:flex-row">
                                    <button
                                        onClick={() => navigate('/admin-dashboard')}
                                        className="px-8 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-sm"
                                        disabled={isSaving}
                                    >
                                        Discard Changes
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
                                                <span className="material-symbols-outlined text-lg">verified_user</span>
                                                Commit Updates
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Additional Security Section */}
                            <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-4">
                                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">lock</span>
                                <div>
                                    <h4 className="font-header text-amber-800 dark:text-amber-400 font-bold">Security Notice</h4>
                                    <p className="text-amber-700 dark:text-amber-500/80 text-sm mt-1">Modifying administrative credentials may prompt a re-authentication request. Ensure all university records match your updated institutional identity.</p>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="py-10 text-center text-slate-400 text-sm">
                        © 2024 stage.io Inc. All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default EditAdminProfile;
