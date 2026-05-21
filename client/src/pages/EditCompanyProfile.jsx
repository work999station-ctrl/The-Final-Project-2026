import { useState, useEffect } from 'react';
oblv
import { useNavigate, Link } from 'react-router-dom';
=======
import { useNavigate } from 'react-router-dom';
 main
import { useLang } from '../contexts/LanguageContext';
import CompanyNavbar from '../components/CompanyNavbar';
import CompanyDeleteAlert from '../components/CompanyDeleteAlert';

const EditCompanyProfile = () => {
    const navigate = useNavigate();
    const { t } = useLang();

    const [formData, setFormData] = useState({
        companyName: '',
        companyRole: '',
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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const res = await fetch('/api/company/me');
                const data = await res.json();

                if (res.ok && data.user) {
                    setFormData({
                        companyName: data.user.companyName || '',
                        companyRole: data.user.companyRole || '',
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
                    setError(t('editProfile.errorLoad'));
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(t('editProfile.errorUpdate'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // Reset so re-selecting the same file still triggers onChange
        e.target.value = '';
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
                setError(data.error || t('editProfile.errorSave'));
            }
        } catch (err) {
            console.error('Save error:', err);
            setError(t('editProfile.errorConnSave'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const res = await fetch('/api/company', {
                method: 'DELETE'
            });

            if (res.ok) {
                // Account deleted, clear cookie/storage and redirect
                // Usually logout clears cookie
                await fetch('/api/logout', { method: 'POST' });
                navigate('/');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to delete account.');
                setIsDeleteModalOpen(false);
            }
        } catch (err) {
            console.error('Delete error:', err);
            setError('Connection error deleting account.');
            setIsDeleteModalOpen(false);
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
                            <div className="mb-8 text-left">
                                <h1 className="font-header text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('editProfile.title')}</h1>
                                <p className="text-slate-500 dark:text-slate-400">{t('editProfile.subtitle')}</p>
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
                                                        <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" onError={() => setLogoPreview(null)} />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-4xl text-slate-400">corporate_fare</span>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <h3 className="font-header text-slate-900 dark:text-white text-xl font-bold">{t('editOffer.logoTitle')}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('editProfile.logoSpecs')}</p>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{t('editProfile.logoMaxSize')}</p>
                                            </div>
                                        </div>
                                        <label className="flex items-center justify-center gap-2 px-6 h-11 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer">
                                            <span className="material-symbols-outlined text-lg">upload_file</span>
                                            <span>{t('editOffer.changeLogo')}</span>
                                            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="p-8 space-y-8">
                                    {/* Row 1: Name, Role and Office */}
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                        <div className="flex flex-col gap-2 text-left">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">business</span>
                                                {t('editProfile.fieldCompanyName')}
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder={t('editProfile.fieldCompanyNamePlaceholder')}
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 text-left">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">label</span>
                                                {t('editProfile.fieldCompanyRole')}
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder={t('editProfile.fieldCompanyRolePlaceholder')}
                                                type="text"
                                                name="companyRole"
                                                value={formData.companyRole}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 text-left">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">work</span>
                                                {t('editProfile.fieldInternshipOffice')}
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder={t('editProfile.fieldCompanyNamePlaceholder')}
                                                type="text"
                                                name="internshipOffice"
                                                value={formData.internshipOffice}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2: Email, Phone and Website */}
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                        <div className="flex flex-col gap-2 text-left">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">mail</span>
                                                {t('editProfile.fieldEmail')}
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder={t('editProfile.fieldEmailPlaceholder')}
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 text-left">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">call</span>
                                                {t('editProfile.fieldPhone')}
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder={t('editProfile.fieldPhonePlaceholder')}
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 text-left">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">language</span>
                                                {t('editProfile.fieldWebsite')}
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder={t('editProfile.fieldWebsitePlaceholder')}
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 3: Address */}
                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="flex flex-col gap-2 text-left">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                                {t('editProfile.fieldAddress')}
                                            </label>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all"
                                                placeholder={t('editProfile.fieldAddressPlaceholder')}
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 3: Description */}
                                    <div className="flex flex-col gap-2 text-left">
                                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-lg">description</span>
                                            {t('editProfile.fieldDescription')}
                                        </label>
                                        <textarea
                                            className="form-textarea w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary px-4 py-3 transition-all resize-none"
                                            placeholder={t('editProfile.fieldDescriptionPlaceholder')}
                                            rows="6"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        ></textarea>
                                        <div className="flex justify-end">
                                            <span className="text-xs text-slate-400">{t('editProfile.charCount')} {formData.description.length}/2000</span>
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
                                        {t('createOffer.cancel')}
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
                                                {t('editProfile.saveChanges')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                             {/* Additional Help Section */}
                            <div className="mt-8 p-6 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-4 text-left">
                                <span className="material-symbols-outlined text-primary">info</span>
                                <div>
                                    <h4 className="font-header text-primary font-bold">{t('editProfile.helpTitle')}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('editProfile.helpDesc')}</p>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="mt-8 p-6 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div>
                                    <h4 className="font-header text-red-600 dark:text-red-400 font-bold">Danger Zone</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Permanently delete your company account and all associated internship offers.</p>
                                </div>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="px-6 h-11 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-full font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-all text-sm whitespace-nowrap"
                                >
                                    Delete Account
                                </button>
                            </div>

                        </div>
                    </main>
                </div>
            </div>

            <CompanyDeleteAlert
                isOpen={isDeleteModalOpen}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
};

export default EditCompanyProfile;
