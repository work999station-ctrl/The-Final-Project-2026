import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CompanyNavbar from '../components/CompanyNavbar';
import Footer from '../components/Footer';
import { useLang } from '../contexts/LanguageContext';

const CreateInternshipOffer = () => {
    const navigate = useNavigate();
    const { t, lang, setLang } = useLang();

    // UI States
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null); // 'front', 'back', 'mobile', 'database'
    const [selectedSkills, setSelectedSkills] = useState([]);

    // Form States
    const [formData, setFormData] = useState({
        title: '',
        durationMonths: '',
        internshipType: 'PFE',
        wilaya: '',
        description: '',
        slotsAvailable: 1,
        salary: '',
        endDateOfApplay: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            setErrors({});
            setIsLoading(true);

            let newErrors = {};
            if (!formData.title) newErrors.title = t('createOffer.errorTitle');
            if (!formData.durationMonths) newErrors.durationMonths = t('createOffer.errorDuration');
            if (!formData.wilaya) newErrors.wilaya = t('createOffer.errorLocation');
            if (!formData.description) newErrors.description = t('createOffer.errorDescription');
            if (!formData.salary) newErrors.salary = t('createOffer.errorSalary');
            if (!formData.endDateOfApplay) newErrors.endDateOfApplay = t('createOffer.errorDeadline');

            // Validation: Ensure every selected category has at least one selected skill
            const selectedCategories = selectedSkills.filter(s => s.type === 'category');
            for (let cat of selectedCategories) {
                const rawCatId = cat.id.replace('cat-', '');
                const hasSkills = selectedSkills.some(s => s.type === 'skill' && s.id.startsWith(`${rawCatId}-`));
                if (!hasSkills) {
                    newErrors.techStack = `${t('createOffer.errorCategorySkill')} ${cat.label}`;
                    break;
                }
            }

            // Tech Stack format processing from selectedSkills
            const techStackMap = {};
            selectedSkills.forEach(skill => {
                if (skill.type === 'skill') {
                    const catId = skill.id.split('-')[0];
                    const categoryObj = categories.find(c => c.id === catId);
                    if (categoryObj) {
                        const catName = categoryObj.name;
                        if (!techStackMap[catName]) techStackMap[catName] = [];
                        techStackMap[catName].push(skill.label);
                    }
                }
            });
            console.log(selectedSkills);
            console.log(techStackMap);
            const techStack = Object.keys(techStackMap).map(categoryName => ({
                category: categoryName,
                tags: techStackMap[categoryName]
            }));

            if (!newErrors.techStack && techStack.length === 0) {
                newErrors.techStack = t('createOffer.errorTechStack');
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setIsLoading(false);
                return;
            }

            const offerData = {
                title: formData.title,
                durationMonths: Number(formData.durationMonths),
                internshipType: formData.internshipType,
                wilaya: formData.wilaya,
                description: formData.description,
                techStack,
                slotsAvailable: Number(formData.slotsAvailable),
                salary: formData.salary,
                endDateOfApplay: formData.endDateOfApplay
            };

            const response = await fetch('/api/offers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(offerData)
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setErrors({ general: data.error || 'Failed to create offer' });
                }
                return;
            }

            // Success, navigate back to dashboard
            navigate('/company-dashboard');

        } catch { // err swallowed
            setErrors({ general: t('createOffer.somethingWrong') });
        } finally {
            setIsLoading(false);
        }
    };

    const itCategories = [
        { id: 'front', name: 'Front-end', skills: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS'] },
        { id: 'back', name: 'Back-end', skills: ['Node.js', 'Express', 'Python', 'Go'] },
        { id: 'mobile', name: 'Mobile', skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'] },
        { id: 'database', name: 'Database', skills: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'] }
    ];

    const ecommerceCategories = [
        { id: 'ecommerce1', name: 'E-commerce & Digital Business', skills: ['Shopify', 'WooCommerce', 'PrestaShop', 'Magento', 'Supply Chain', 'Dropshipping', 'Inventory Management', 'Payment Gateways'] },
        { id: 'ecommerce2', name: 'Digital Marketing & SEO', skills: ['SEO', 'Google Analytics', 'Social Media Management', 'Facebook Ads', 'Google Ads', 'Copywriting', 'Email Marketing', 'Content Strategy'] },
        { id: 'ecommerce3', name: 'Management & Business Analysis', skills: ['Project Management', 'Agile/Scrum', 'Business Analysis', 'CRM (Salesforce, HubSpot)', 'Market Research', 'Data Entry'] },
        { id: 'ecommerce4', name: 'Graphic Design & Multimedia', skills: ['Adobe Photoshop', 'Illustrator', 'Premiere Pro', 'Video Editing', 'Brand Identity', 'Graphic Design', 'Product Photography'] }
    ];

    const psychologyCategories = [
        { id: 'psychology1', name: 'HR & Organizational Psychology', skills: ['Recruitment', 'Talent Acquisition', 'Organizational Behavior', 'Employee Well-being', 'Conflict Resolution', 'Training & Development', 'Psychometric Testing'] },
        { id: 'psychology2', name: 'Clinical Psychology & Healthcare', skills: ['Clinical Assessment', 'Cognitive Behavioral Therapy (CBT)', 'Patient Counseling', 'Child Psychology', 'Neuropsychology', 'Group Therapy', 'Case Management'] },
        { id: 'psychology3', name: 'Educational & Social Psychology', skills: ['Career Guidance', 'Special Education', 'Developmental Psychology', 'Speech Therapy (Orthophony)', 'Behavioral Intervention', 'Student Counseling'] }
    ];

    const sportCategories = [
        { id: 'sport1', name: 'Coaching & Fitness', skills: ['Sports Coaching', 'Personal Training', 'Fitness Assessment', 'Strength & Conditioning'] },
        { id: 'sport2', name: 'Health & Therapy', skills: ['Biomechanics', 'Athletic Therapy', 'Exercise Physiology', 'Kinesiology', 'Rehabilitation', 'First Aid', 'CPR'] },
        { id: 'sport3', name: 'Management & Business', skills: ['Sports Management', 'Event Planning', 'Sports Psychology', 'Sports Nutrition'] }
    ];

    const categories = [
        ...itCategories,
        ...ecommerceCategories,
        ...psychologyCategories,
        ...sportCategories
    ];

    const toggleSkill = (skill, categoryId) => {
        const skillId = `${categoryId}-${skill}`.toLowerCase();
        const catId = `cat-${categoryId}`;
        const category = categories.find(c => c.id === categoryId);

        if (selectedSkills.find(s => s.id === skillId)) {
            // Remove skill
            const updatedSkills = selectedSkills.filter(s => s.id !== skillId);

            // If No more skills from this category, remove the category too
            const otherSkillsInCat = updatedSkills.some(s => s.id.startsWith(`${categoryId}-`));
            if (!otherSkillsInCat) {
                setSelectedSkills(updatedSkills.filter(s => s.id !== catId));
            } else {
                setSelectedSkills(updatedSkills);
            }
        } else {
            // Add skill AND check if category needs to be added
            const isCategorySelected = selectedSkills.some(s => s.id === catId);
            const newSkill = { id: skillId, label: skill, type: 'skill' };

            if (!isCategorySelected && category) {
                const newCategory = { id: catId, label: category.name, type: 'category' };
                setSelectedSkills([...selectedSkills, newCategory, newSkill]);
            } else {
                setSelectedSkills([...selectedSkills, newSkill]);
            }
        }
    };

    const toggleCategory = (category) => {
        const catId = `cat-${category.id}`;
        if (selectedSkills.find(s => s.id === catId)) {
            // Uncheck Category -> Remove it + all its sub-skills
            setSelectedSkills(selectedSkills.filter(s =>
                s.id !== catId && !s.id.startsWith(`${category.id}-`)
            ));
        } else {
            // Check Category -> Just add the category tag
            setSelectedSkills([...selectedSkills, { id: catId, label: category.name, type: 'category' }]);
        }
    };

    const removeTag = (id) => {
        if (id.startsWith('cat-')) {
            const catPrefix = id.replace('cat-', '');
            // Removing category tag -> remove all sub-skills too
            setSelectedSkills(selectedSkills.filter(s =>
                s.id !== id && !s.id.startsWith(`${catPrefix}-`)
            ));
        } else {
            // Removing a skill tag -> Check if it was the last one
            const updated = selectedSkills.filter(s => s.id !== id);
            const catIdParts = id.split('-');
            const categoryId = catIdParts[0];

            const otherSkillsInCat = updated.some(s => s.id.startsWith(`${categoryId}-`));
            if (!otherSkillsInCat) {
                setSelectedSkills(updated.filter(s => s.id !== `cat-${categoryId}`));
            } else {
                setSelectedSkills(updated);
            }
        }
    };

    return (
        <div className="bg-[#f6f6f8] dark:bg-[#121121] font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen">
            <CompanyNavbar />
            {/* Background Dashboard (Blurred) */}
            <div className="fixed inset-0 z-0 overflow-hidden filter blur-sm grayscale-[0.2] opacity-50 pointer-events-none">
                <div className="flex h-full grow flex-col">
                    <header className="flex items-center justify-between border-b border-[#4f46e5]/10 px-10 py-4 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-[#4f46e5] rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined">work</span>
                            </div>
                            <h2 className="text-xl font-bold font-heading">Recruiter Hub</h2>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                        </div>
                    </header>
                    <main className="p-10 grid grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-6">
                            <div className="h-40 bg-white dark:bg-slate-800 rounded-xl shadow-sm"></div>
                            <div className="h-96 bg-white dark:bg-slate-800 rounded-xl shadow-sm"></div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-64 bg-white dark:bg-slate-800 rounded-xl shadow-sm"></div>
                            <div className="h-64 bg-white dark:bg-slate-800 rounded-xl shadow-sm"></div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Modal Overlay */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                {/* Modal Content */}
                <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative">
                    {/* Modal Header */}
                    <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-heading font-semibold text-slate-900 dark:text-white">{t('createOffer.title')}</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('createOffer.subtitle')}</p>
                        </div>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer" onClick={() => navigate(-1)}>
                            <span className="material-symbols-outlined text-slate-400">close</span>
                        </button>
                    </div>

                    {errors.general && (
                        <div className="px-8 mt-2">
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm font-medium border border-red-200 dark:border-red-800/30">
                                {errors.general}
                            </div>
                        </div>
                    )}

                    {/* Modal Body (Scrollable) */}
                    <div className="px-8 py-4 overflow-y-auto space-y-6 custom-scrollbar flex-1 text-left">
                        {/* Internship Title */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('createOffer.fieldTitle')}</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'} focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white`}
                                placeholder={t('createOffer.fieldTitlePlaceholder')}
                                type="text"
                            />
                            {errors.title && <span className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.title}</span>}
                        </div>



                        {/* Hierarchical Skills and Categories Selector */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('createOffer.fieldTechStack')}</label>
                            <div className="relative w-full">
                                {/* Select Trigger */}
                                <div
                                    className={`min-h-[48px] w-full px-4 py-2 flex items-center justify-between rounded-xl border ${errors.techStack ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'} hover:border-[#4f46e5]/50 cursor-pointer transition-all`}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSkills.length > 0 ? (
                                            selectedSkills.map(tag => (
                                                <div
                                                    key={tag.id}
                                                    className={`flex items-center gap-1 px-2.5 py-1 ${tag.type === 'category' ? 'bg-[#4f46e5] text-white shadow-sm' : 'bg-[#4f46e5]/10 text-[#4f46e5] border border-[#4f46e5]/20'} text-xs font-semibold rounded-lg animate-in fade-in zoom-in-95 duration-200`}
                                                >
                                                    {tag.label}
                                                    <button
                                                        className="hover:opacity-70 transition-opacity"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeTag(tag.id);
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined text-sm leading-none">close</span>
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-400 self-center">{t('createOffer.fieldTechStackPlaceholder')}</span>
                                        )}
                                    </div>
                                    <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                </div>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('createOffer.fieldTechStack')}</span>
                                            <button onClick={() => setIsDropdownOpen(false)} className="material-symbols-outlined text-slate-400 text-lg hover:text-slate-600 dark:hover:text-slate-200 transition-colors">close</button>
                                        </div>
                                        <div className="max-h-[320px] overflow-y-auto py-2 custom-scrollbar">
                                            {categories.map((cat) => (
                                                <div key={cat.id} className="group/category border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                                                    <div
                                                        className={`flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${expandedCategory === cat.id ? 'bg-slate-50/50 dark:bg-slate-800/50' : ''}`}
                                                        onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                                                    >
                                                        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={(e) => e.stopPropagation()}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedSkills.some(s => s.id === `cat-${cat.id}`)}
                                                                onChange={() => toggleCategory(cat)}
                                                                className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-[#4f46e5] focus:ring-[#4f46e5] transition-all cursor-pointer"
                                                            />
                                                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">{cat.name}</span>
                                                        </div>
                                                        <span className={`material-symbols-outlined text-slate-400 text-xl transition-all duration-300 ${expandedCategory === cat.id ? 'rotate-180 text-[#4f46e5]' : ''}`}>expand_more</span>
                                                    </div>

                                                    {expandedCategory === cat.id && (
                                                        <div className="ml-10 space-y-1 mb-2 pr-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                                            {cat.skills.map(skill => {
                                                                const skillId = `${cat.id}-${skill}`.toLowerCase();
                                                                return (
                                                                    <label key={skillId} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedSkills.some(s => s.id === skillId)}
                                                                            onChange={() => toggleSkill(skill, cat.id)}
                                                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#4f46e5] focus:ring-[#4f46e5] transition-all cursor-pointer"
                                                                        />
                                                                        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{skill}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {errors.techStack && <span className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.techStack}</span>}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2 text-left">
                            {/* Duration */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('createOffer.fieldDuration')}</label>
                                <input
                                    name="durationMonths"
                                    value={formData.durationMonths}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.durationMonths ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'} focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white`}
                                    placeholder={t('createOffer.fieldDurationPlaceholder')}
                                    type="number"
                                    min="1"
                                />
                                {errors.durationMonths && <span className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.durationMonths}</span>}
                            </div>

                            {/* Slots */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('createOffer.fieldSlots')}</label>
                                <input
                                    name="slotsAvailable"
                                    value={formData.slotsAvailable}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                                    type="number"
                                    min="1"
                                />
                            </div>

                            {/* Salary */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('createOffer.fieldSalary')}</label>
                                <input
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.salary ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'} focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white`}
                                    placeholder={t('createOffer.fieldSalaryPlaceholder')}
                                    type="text"
                                />
                                {errors.salary && <span className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.salary}</span>}
                            </div>

                            {/* Type */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('createOffer.fieldWorkType')}</label>
                                <div className="relative">
                                    <select
                                        name="internshipType"
                                        value={formData.internshipType}
                                        onChange={handleInputChange}
                                        className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all text-slate-600 dark:text-slate-300"
                                    >
                                        <option value="PFE">PFE</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Perfectionnement">Perfectionnement</option>
                                        <option value="Observation">Observation</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                                </div>
                            </div>

                            {/* Deadline */}
                            <div className="flex flex-col gap-2 col-span-2 md:col-span-4">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('createOffer.fieldDeadline')}</label>
                                <input
                                    name="endDateOfApplay"
                                    value={formData.endDateOfApplay}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.endDateOfApplay ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'} focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all text-slate-600 dark:text-slate-300 cursor-pointer`}
                                    type="date"
                                    min={new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                                />
                                {errors.endDateOfApplay && <span className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.endDateOfApplay}</span>}
                            </div>
                        </div>

                        {/* Location (Back to standard size) */}
                        <div className="flex flex-col gap-2 text-left">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('createOffer.fieldLocation')}</label>
                            <div className="relative">
                                <select
                                    name="wilaya"
                                    value={formData.wilaya}
                                    onChange={handleInputChange}
                                    className={`w-full appearance-none pl-10 pr-4 py-3 rounded-xl border ${errors.wilaya ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'} focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all text-slate-600 dark:text-slate-300 cursor-pointer`}
                                >
                                    <option value="" disabled>{t('createOffer.fieldLocationPlaceholder')}</option>
                                    <option>01 - Adrar</option>
                                    <option>02 - Chlef</option>
                                    <option>03 - Laghouat</option>
                                    <option>04 - Oum El Bouaghi</option>
                                    <option>05 - Batna</option>
                                    <option>06 - Béjaïa</option>
                                    <option>07 - Biskra</option>
                                    <option>08 - Béchar</option>
                                    <option>09 - Blida</option>
                                    <option>10 - Bouira</option>
                                    <option>11 - Tamanrasset</option>
                                    <option>12 - Tébessa</option>
                                    <option>13 - Tlemcen</option>
                                    <option>14 - Tiaret</option>
                                    <option>15 - Tizi Ouzou</option>
                                    <option>16 - Alger</option>
                                    <option>17 - Djelfa</option>
                                    <option>18 - Jijel</option>
                                    <option>19 - Sétif</option>
                                    <option>20 - Saïda</option>
                                    <option>21 - Skikda</option>
                                    <option>22 - Sidi Bel Abbès</option>
                                    <option>23 - Annaba</option>
                                    <option>24 - Guelma</option>
                                    <option>25 - Constantine</option>
                                    <option>26 - Médéa</option>
                                    <option>27 - Mostaganem</option>
                                    <option>28 - M'Sila</option>
                                    <option>29 - Mascara</option>
                                    <option>30 - Ouargla</option>
                                    <option>31 - Oran</option>
                                    <option>32 - El Bayadh</option>
                                    <option>33 - Illizi</option>
                                    <option>34 - Bordj Bou Arréridj</option>
                                    <option>35 - Boumerdès</option>
                                    <option>36 - El Tarf</option>
                                    <option>37 - Tindouf</option>
                                    <option>38 - Tissemsilt</option>
                                    <option>39 - El Oued</option>
                                    <option>40 - Khenchela</option>
                                    <option>41 - Souk Ahras</option>
                                    <option>42 - Tipaza</option>
                                    <option>43 - Mila</option>
                                    <option>44 - Aïn Defla</option>
                                    <option>45 - Naâma</option>
                                    <option>46 - Aïn Témouchent</option>
                                    <option>47 - Ghardaïa</option>
                                    <option>48 - Relizane</option>
                                    <option>49 - El M'Ghair</option>
                                    <option>50 - El Meniaa</option>
                                    <option>51 - Ouled Djellal</option>
                                    <option>52 - Bordj Badji Mokhtar</option>
                                    <option>53 - Béni Abbès</option>
                                    <option>54 - Timimoun</option>
                                    <option>55 - Touggourt</option>
                                    <option>56 - Djanet</option>
                                    <option>57 - In Salah</option>
                                    <option>58 - In Guezzam</option>
                                </select>
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">location_on</span>
                            </div>
                            {errors.wilaya && <span className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.wilaya}</span>}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-2 text-left">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('createOffer.fieldDescription')}</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'} focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white resize-none`}
                                placeholder={t('createOffer.fieldDescriptionPlaceholder')}
                                rows="4"
                            ></textarea>
                            {errors.description && <span className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.description}</span>}
                        </div>




                    </div>

                    {/* Modal Footer */}
                    <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-4 bg-slate-50/50 dark:bg-slate-800/50">
                        <button className="px-6 py-2.5 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => navigate(-1)}>
                            {t('createOffer.cancel')}
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-8 py-2.5 rounded-full ${isLoading ? 'bg-[#4f46e5]/70 cursor-not-allowed' : 'bg-[#4f46e5] hover:bg-[#4f46e5]/90 cursor-pointer shadow-lg shadow-[#4f46e5]/20 active:scale-[0.98]'} text-white text-sm font-semibold transition-all`}
                        >
                            {isLoading ? t('createOffer.posting') : t('createOffer.postOffer')}
                            {!isLoading && <span className="material-symbols-outlined text-lg">send</span>}
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CreateInternshipOffer;
