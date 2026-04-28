import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from '../components/CompanyNavbar';

const EditCompanyProfile = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phoneNumber: '',
        address: '',
        website: '',
        description: '',
        internshipOffice: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const res = await fetch('/api/company/me');
                const data = await res.json();

                if (res.ok && data.user) {
                    setFormData({
                        companyName: data.user.companyName || '',
                        email: data.user.email || '',
                        phoneNumber: data.user.phoneNumber || '',
                        address: data.user.address || '',
                        website: data.user.website || '',
                        description: data.user.description || '',
                        internshipOffice: data.user.internshipOffice || '',
                    });
                    if (data.user.logo) {
                        setLogoPreview(data.user.logo);
                    }
                } else {
                    setError('Failed to load profile data.');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Connection error updating profile.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
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
            if (logoFile) {
                submitData.append('logo', logoFile);
            }

            const res = await fetch('/api/company/profile', {
                method: 'PUT',
                body: submitData
            });

            const data = await res.json();

            if (res.ok) {
                navigate('/company-dashboard');
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
                <div className="w-10 h-10 border-4 border-primary border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <CompanyNavbar />

                    <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-10">
                        <div className="max-w-4xl w-full">
                            {/* Page Header */}
                            <div className="mb-8">
                                <h1 className="font-header text-3xl font-bold text-slate-900 dark:text-white mb-2">Edit Company Profile</h1>
                                <p className="text-slate-500 dark:text-slate-400">Manage your company's public identity and digital presence across the platform.</p>
                            </div>

                            {/* Main Form Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                {error && (
                                    <div className="mx-8 mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </div>
                                )}

                                {/* Logo Section */}
                                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="relative group overflow-hidden">
                                                <div className="bg-primary/5 dark:bg-primary/10 bg-center overflow-hidden bg-no-repeat aspect-square bg-cover rounded-2xl size-32 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                                                    {logoPreview ? (
                                                        <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-4xl text-slate-400">corporate_fare</span>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="font-header text-slate-900 dark:text-white text-xl font-bold">Company Logo</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Recommended: 800x800px. PNG, JPG or SVG.</p>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Max size of 5MB.</p>
                                            </div>
                                        </div>
                                        <label className="flex items-center justify-center gap-2 px-6 h-11 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer">
                                            <span className="material-symbols-outlined text-lg">upload_file</span>
                                            <span>Change Logo</span>
                                            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="p-8 space-y-8">
                                    {/* Row 1: Name, Email and Phone */}
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">business</span>
                                                Company Name
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="e.g. Acme Corp"
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">business</span>
                                                Internship Office
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="e.g. Acme Corp"
                                                type="text"
                                                name="internshipOffice"
                                                value={formData.internshipOffice}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">mail</span>
                                                Business Email
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="contact@company.com"
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
                                                placeholder="+1 (555) 000-0000"
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2: Website and Address */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">language</span>
                                                Website URL
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="https://www.example.com"
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                                Address
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder="Main St, City Country"
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 3: Description */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-lg">description</span>
                                            Company Description
                                        </label>
                                        <textarea
                                            className="form-textarea w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all resize-none"
                                            placeholder="Tell candidates what makes your company special..."
                                            rows="6"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        ></textarea>
                                        <div className="flex justify-end">
                                            <span className="text-xs text-slate-400">Character count: {formData.description.length}/2000</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse justify-end gap-4 md:flex-row">
                                    <button
                                        onClick={() => navigate('/company-dashboard')}
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
                                    <h4 className="font-header text-primary font-bold">Public Profile Preview</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Changes made here will be visible to all candidates viewing your job postings. It may take up to 5 minutes for your public profile to refresh across all search results.</p>
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

export default EditCompanyProfile;
