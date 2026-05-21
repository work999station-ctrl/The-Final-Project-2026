import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CompanyNavbar from '../components/CompanyNavbar';
import { useLang } from '../contexts/LanguageContext';

const EditCompanyOffer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useLang();

    // UI States
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Logo States
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        title: '',
        durationMonths: '',
        internshipType: 'PFE',
        wilaya: '',
        description: '',
        slotsAvailable: 1,
        salary: ''
    });

    const categories = [
        { id: 'front', name: 'Front-end', skills: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Angular', 'HTML/CSS', 'TypeScript', 'JavaScript', 'Svelte', 'Bootstrap', 'Sass', 'jQuery'] },
        { id: 'back', name: 'Back-end', skills: ['Node.js', 'Express', 'Python', 'Django', 'Go', 'PHP', 'Java', 'C++', 'Rust', 'C#', '.NET', 'Ruby', 'Laravel', 'Flask', 'FastAPI', 'Spring Boot', 'Scala', 'R'] },
        { id: 'mobile', name: 'Mobile', skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Dart', 'Ionic'] },
        { id: 'database', name: 'Database', skills: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Firebase', 'SQL', 'SQLite', 'Oracle', 'Supabase'] },
        { id: 'devops', name: 'DevOps', skills: ['Docker', 'AWS', 'CI/CD', 'Linux', 'Git', 'Kubernetes', 'Terraform', 'Jenkins', 'Nginx', 'Azure', 'Google Cloud', 'Ansible'] },
        { id: 'ai', name: 'AI & Data Science', skills: ['TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Jupyter', 'OpenCV', 'Matlab', 'Keras'] },
        { id: 'ecommerce1', name: 'E-commerce & Digital Business', skills: ['Shopify', 'WooCommerce', 'PrestaShop', 'Magento', 'Supply Chain', 'Dropshipping', 'Inventory Management', 'Payment Gateways'] },
        { id: 'ecommerce2', name: 'Digital Marketing & SEO', skills: ['SEO', 'Google Analytics', 'Social Media Management', 'Facebook Ads', 'Google Ads', 'Copywriting', 'Email Marketing', 'Content Strategy'] },
        { id: 'ecommerce3', name: 'Management & Business Analysis', skills: ['Project Management', 'Agile/Scrum', 'Business Analysis', 'CRM (Salesforce, HubSpot)', 'Market Research', 'Data Entry'] },
        { id: 'ecommerce4', name: 'Design & Multimedia', skills: ['Adobe Photoshop', 'Illustrator', 'Premiere Pro', 'Figma', 'Canva', 'Blender', 'After Effects', 'Video Editing', 'Brand Identity', 'Graphic Design', 'Product Photography'] },
        { id: 'psychology1', name: 'HR & Organizational Psychology', skills: ['Recruitment', 'Talent Acquisition', 'Organizational Behavior', 'Employee Well-being', 'Conflict Resolution', 'Training & Development', 'Psychometric Testing'] },
        { id: 'psychology2', name: 'Clinical Psychology & Healthcare', skills: ['Clinical Assessment', 'Cognitive Behavioral Therapy (CBT)', 'Patient Counseling', 'Child Psychology', 'Neuropsychology', 'Group Therapy', 'Case Management'] },
        { id: 'psychology3', name: 'Educational & Social Psychology', skills: ['Career Guidance', 'Special Education', 'Developmental Psychology', 'Speech Therapy (Orthophony)', 'Behavioral Intervention', 'Student Counseling'] },
        { id: 'sport1', name: 'Coaching & Fitness', skills: ['Sports Coaching', 'Personal Training', 'Fitness Assessment', 'Strength & Conditioning'] },
        { id: 'sport2', name: 'Health & Therapy', skills: ['Biomechanics', 'Athletic Therapy', 'Exercise Physiology', 'Kinesiology', 'Rehabilitation', 'First Aid', 'CPR'] },
        { id: 'sport3', name: 'Sports Management & Business', skills: ['Sports Management', 'Event Planning', 'Sports Psychology', 'Sports Nutrition'] }
    ];

    // Real logos for programming/tech skills (Devicon CDN)
    const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
    const skillLogos = {
        'React': `${DI}/react/react-original.svg`,
        'Next.js': `${DI}/nextjs/nextjs-original.svg`,
        'Vue.js': `${DI}/vuejs/vuejs-original.svg`,
        'Tailwind CSS': `${DI}/tailwindcss/tailwindcss-original.svg`,
        'Angular': `${DI}/angularjs/angularjs-original.svg`,
        'HTML/CSS': `${DI}/html5/html5-original.svg`,
        'TypeScript': `${DI}/typescript/typescript-original.svg`,
        'JavaScript': `${DI}/javascript/javascript-original.svg`,
        'Svelte': `${DI}/svelte/svelte-original.svg`,
        'Bootstrap': `${DI}/bootstrap/bootstrap-original.svg`,
        'Sass': `${DI}/sass/sass-original.svg`,
        'jQuery': `${DI}/jquery/jquery-original.svg`,
        'Node.js': `${DI}/nodejs/nodejs-original.svg`,
        'Express': `${DI}/express/express-original.svg`,
        'Python': `${DI}/python/python-original.svg`,
        'Django': `${DI}/django/django-plain.svg`,
        'Go': `${DI}/go/go-original.svg`,
        'PHP': `${DI}/php/php-original.svg`,
        'Java': `${DI}/java/java-original.svg`,
        'C++': `${DI}/cplusplus/cplusplus-original.svg`,
        'Rust': `${DI}/rust/rust-original.svg`,
        'C#': `${DI}/csharp/csharp-original.svg`,
        '.NET': `${DI}/dotnetcore/dotnetcore-original.svg`,
        'Ruby': `${DI}/ruby/ruby-original.svg`,
        'Laravel': `${DI}/laravel/laravel-original.svg`,
        'Flask': `${DI}/flask/flask-original.svg`,
        'FastAPI': `${DI}/fastapi/fastapi-original.svg`,
        'Spring Boot': `${DI}/spring/spring-original.svg`,
        'Scala': `${DI}/scala/scala-original.svg`,
        'R': `${DI}/r/r-original.svg`,
        'React Native': `${DI}/react/react-original.svg`,
        'Flutter': `${DI}/flutter/flutter-original.svg`,
        'Swift': `${DI}/swift/swift-original.svg`,
        'Kotlin': `${DI}/kotlin/kotlin-original.svg`,
        'Dart': `${DI}/dart/dart-original.svg`,
        'Ionic': `${DI}/ionic/ionic-original.svg`,
        'PostgreSQL': `${DI}/postgresql/postgresql-original.svg`,
        'MongoDB': `${DI}/mongodb/mongodb-original.svg`,
        'Redis': `${DI}/redis/redis-original.svg`,
        'MySQL': `${DI}/mysql/mysql-original.svg`,
        'Firebase': `${DI}/firebase/firebase-original.svg`,
        'SQL': `${DI}/azuresqldatabase/azuresqldatabase-original.svg`,
        'SQLite': `${DI}/sqlite/sqlite-original.svg`,
        'Oracle': `${DI}/oracle/oracle-original.svg`,
        'Supabase': `${DI}/supabase/supabase-original.svg`,
        'Docker': `${DI}/docker/docker-original.svg`,
        'AWS': `${DI}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
        'CI/CD': `${DI}/githubactions/githubactions-original.svg`,
        'Linux': `${DI}/linux/linux-original.svg`,
        'Git': `${DI}/git/git-original.svg`,
        'Kubernetes': `${DI}/kubernetes/kubernetes-original.svg`,
        'Terraform': `${DI}/terraform/terraform-original.svg`,
        'Jenkins': `${DI}/jenkins/jenkins-original.svg`,
        'Nginx': `${DI}/nginx/nginx-original.svg`,
        'Azure': `${DI}/azure/azure-original.svg`,
        'Google Cloud': `${DI}/googlecloud/googlecloud-original.svg`,
        'Ansible': `${DI}/ansible/ansible-original.svg`,
        'TensorFlow': `${DI}/tensorflow/tensorflow-original.svg`,
        'PyTorch': `${DI}/pytorch/pytorch-original.svg`,
        'Pandas': `${DI}/pandas/pandas-original.svg`,
        'NumPy': `${DI}/numpy/numpy-original.svg`,
        'Jupyter': `${DI}/jupyter/jupyter-original.svg`,
        'OpenCV': `${DI}/opencv/opencv-original.svg`,
        'Matlab': `${DI}/matlab/matlab-original.svg`,
        'Keras': `${DI}/keras/keras-original.svg`,
        'Figma': `${DI}/figma/figma-original.svg`,
        'Canva': `${DI}/canva/canva-original.svg`,
        'Blender': `${DI}/blender/blender-original.svg`,
        'After Effects': `${DI}/aftereffects/aftereffects-original.svg`,
        'Adobe Photoshop': `${DI}/photoshop/photoshop-original.svg`,
        'Illustrator': `${DI}/illustrator/illustrator-plain.svg`,
        'Premiere Pro': `${DI}/premierepro/premierepro-original.svg`,
    };

    // Material icons for non-tech skills
    const skillIcons = {
        'Shopify': 'storefront', 'WooCommerce': 'shopping_cart', 'PrestaShop': 'store', 'Magento': 'shopping_bag',
        'Supply Chain': 'local_shipping', 'Dropshipping': 'package_2', 'Inventory Management': 'inventory',
        'Payment Gateways': 'payment', 'SEO': 'travel_explore', 'Google Analytics': 'monitoring',
        'Social Media Management': 'share', 'Facebook Ads': 'campaign', 'Google Ads': 'ads_click',
        'Copywriting': 'edit_note', 'Email Marketing': 'mail', 'Content Strategy': 'article',
        'Project Management': 'assignment', 'Agile/Scrum': 'sprint', 'Business Analysis': 'analytics',
        'CRM (Salesforce, HubSpot)': 'contacts', 'Market Research': 'search_insights', 'Data Entry': 'keyboard',
        'Video Editing': 'movie_edit', 'Brand Identity': 'branding_watermark',
        'Graphic Design': 'palette', 'Product Photography': 'photo_camera',
        'Recruitment': 'person_search', 'Talent Acquisition': 'star', 'Organizational Behavior': 'groups',
        'Employee Well-being': 'favorite', 'Conflict Resolution': 'handshake',
        'Training & Development': 'school', 'Psychometric Testing': 'psychology',
        'Clinical Assessment': 'fact_check', 'Cognitive Behavioral Therapy (CBT)': 'psychology',
        'Patient Counseling': 'support_agent', 'Child Psychology': 'child_care',
        'Neuropsychology': 'neurology', 'Group Therapy': 'diversity_3', 'Case Management': 'folder_shared',
        'Career Guidance': 'signpost', 'Special Education': 'school', 'Developmental Psychology': 'child_friendly',
        'Speech Therapy (Orthophony)': 'record_voice_over', 'Behavioral Intervention': 'psychology',
        'Student Counseling': 'support',
        'Sports Coaching': 'sports', 'Personal Training': 'fitness_center',
        'Fitness Assessment': 'monitoring', 'Strength & Conditioning': 'exercise',
        'Biomechanics': 'settings_accessibility', 'Athletic Therapy': 'physical_therapy',
        'Exercise Physiology': 'cardiology', 'Kinesiology': 'directions_run',
        'Rehabilitation': 'healing', 'First Aid': 'medical_services', 'CPR': 'emergency',
        'Sports Management': 'manage_accounts', 'Event Planning': 'event',
        'Sports Psychology': 'psychology', 'Sports Nutrition': 'restaurant',
    };

    useEffect(() => {
        const fetchOfferData = async () => {
            try {
                const res = await fetch(`/api/offers/${id}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    const offer = data.offer;
                    const company = data.company;

                    setFormData({
                        title: offer.title || '',
                        durationMonths: offer.durationMonths || '',
                        internshipType: offer.internshipType || 'PFE',
                        wilaya: offer.wilaya || '',
                        description: offer.description || '',
                        slotsAvailable: offer.slotsAvailable || 1,
                        salary: offer.salary || ''
                    });

                    if (offer && offer.photo) {
                        setLogoPreview(offer.photo);
                    } else if (company && company.logo) {
                        setLogoPreview(company.logo);
                    }

                    // Reconstruct selectedSkills from techStack
                    if (offer.techStack && Array.isArray(offer.techStack)) {
                        const reconstructed = [];
                        offer.techStack.forEach(stack => {
                            const categoryObj = categories.find(c => c.name === stack.category);
                            if (categoryObj) {
                                reconstructed.push({ id: `cat-${categoryObj.id}`, label: categoryObj.name, type: 'category' });
                                if (stack.tags && Array.isArray(stack.tags)) {
                                    stack.tags.forEach(tag => {
                                        reconstructed.push({ id: `${categoryObj.id}-${tag.toLowerCase()}`, label: tag, type: 'skill' });
                                    });
                                }
                            }
                        });
                        setSelectedSkills(reconstructed);
                    }
                } else {
                    setError(data.error || t('editOffer.errorLoad'));
                }
            } catch (err) {
                console.error('Error fetching offer:', err);
                setError(t('editOffer.errorConn'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchOfferData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

    const toggleSkill = (skill, categoryId) => {
        const skillId = `${categoryId}-${skill}`.toLowerCase();
        const catId = `cat-${categoryId}`;
        const category = categories.find(c => c.id === categoryId);

        if (selectedSkills.find(s => s.id === skillId)) {
            const updatedSkills = selectedSkills.filter(s => s.id !== skillId);
            const otherSkillsInCat = updatedSkills.some(s => s.id.startsWith(`${categoryId}-`));
            if (!otherSkillsInCat) {
                setSelectedSkills(updatedSkills.filter(s => s.id !== catId));
            } else {
                setSelectedSkills(updatedSkills);
            }
        } else {
            const isCategorySelected = selectedSkills.some(s => s.id === catId);
            const newSkill = { id: skillId, label: skill, type: 'skill' };
            if (!isCategorySelected && category) {
                setSelectedSkills([...selectedSkills, { id: catId, label: category.name, type: 'category' }, newSkill]);
            } else {
                setSelectedSkills([...selectedSkills, newSkill]);
            }
        }
    };

    const toggleCategory = (category) => {
        const catId = `cat-${category.id}`;
        if (selectedSkills.find(s => s.id === catId)) {
            setSelectedSkills(selectedSkills.filter(s => s.id !== catId && !s.id.startsWith(`${category.id}-`)));
        } else {
            setSelectedSkills([...selectedSkills, { id: catId, label: category.name, type: 'category' }]);
        }
    };

    const removeTag = (tagId) => {
        if (tagId.startsWith('cat-')) {
            const catPrefix = tagId.replace('cat-', '');
            setSelectedSkills(selectedSkills.filter(s => s.id !== tagId && !s.id.startsWith(`${catPrefix}-`)));
        } else {
            const updated = selectedSkills.filter(s => s.id !== tagId);
            const catIdParts = tagId.split('-');
            const categoryId = catIdParts[0];
            const otherSkillsInCat = updated.some(s => s.id.startsWith(`${categoryId}-`));
            if (!otherSkillsInCat) {
                setSelectedSkills(updated.filter(s => s.id !== `cat-${categoryId}`));
            } else {
                setSelectedSkills(updated);
            }
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            // Process techStack
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

            const techStack = Object.keys(techStackMap).map(categoryName => ({
                category: categoryName,
                tags: techStackMap[categoryName]
            }));

            // Use FormData to support logo upload
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            submitData.append('techStack', JSON.stringify(techStack));
            if (logoFile) {
                submitData.append('photo', logoFile);
            }

            const res = await fetch(`/api/offers/${id}`, {
                method: 'PUT',
                body: submitData
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(t('editOffer.success'));
                setTimeout(() => navigate(`/offer-details/${id}`), 1500);
            } else {
                setError(data.error || t('editOffer.errorSave'));
            }
        } catch (err) {
            console.error('Save error:', err);
            setError(t('editOffer.errorSave'));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex items-center justify-center font-sans">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
            <CompanyNavbar />
            <div className="max-w-4xl mx-auto py-12 px-6">
                {/* Header */}
                <div className="mb-8 text-left">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 text-sm font-medium">
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        {t('editOffer.back')}
                    </button>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t('editOffer.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{t('editOffer.subtitle')}</p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Logo Section */}
                    <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="relative group overflow-hidden">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/30 bg-center overflow-hidden bg-no-repeat aspect-square bg-cover rounded-2xl size-32 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600">
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
                                    <h3 className="text-slate-900 dark:text-white text-xl font-bold">Offer Cover Photo</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Upload a custom photo for this offer. If left empty, the company logo is used.</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">PNG, JPG or WEBP · Max 5MB · Recommended 800×600</p>
                                </div>
                            </div>
                            <label className="flex items-center justify-center gap-2 px-6 h-11 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 cursor-pointer">
                                <span className="material-symbols-outlined text-lg">upload_file</span>
                                <span>Change Photo</span>
                                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="m-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold flex items-center gap-3">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="m-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-3">
                            <span className="material-symbols-outlined">check_circle</span>
                            {success}
                        </div>
                    )}

                    <div className="p-8 space-y-6">
                        {/* Title */}
                        <div className="space-y-2 text-left">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('createOffer.fieldTitle')}</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                placeholder={t('createOffer.fieldTitlePlaceholder')}
                            />
                        </div>

                        {/* Tech Stack */}
                        <div className="space-y-2 relative text-left">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('createOffer.fieldTechStack')}</label>
                            <div
                                className="min-h-[52px] w-full px-4 py-2 flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-indigo-500/50 cursor-pointer transition-all"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <div className="flex flex-wrap gap-2">
                                    {selectedSkills.length > 0 ? (
                                        selectedSkills.map(tag => (
                                            <div key={tag.id} className={`flex items-center gap-1.5 px-3 py-1 ${tag.type === 'category' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800'} text-xs font-bold rounded-lg transition-all`}>
                                                {tag.label}
                                                <button onClick={(e) => { e.stopPropagation(); removeTag(tag.id); }} className="hover:opacity-70">
                                                    <span className="material-symbols-outlined text-[14px] leading-none">close</span>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-400">{t('createOffer.fieldTechStackPlaceholder')}</span>
                                    )}
                                </div>
                                <span className={`material-symbols-outlined text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                                        {categories.map(cat => (
                                            <div key={cat.id} className="rounded-lg overflow-hidden">
                                                <div
                                                    className={`flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors ${expandedCategory === cat.id ? 'bg-slate-50 dark:bg-slate-700' : ''}`}
                                                    onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                                                >
                                                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedSkills.some(s => s.id === `cat-${cat.id}`)}
                                                            onChange={() => toggleCategory(cat)}
                                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">{cat.name}</span>
                                                    </div>
                                                    <span className={`material-symbols-outlined text-slate-400 text-lg transition-transform ${expandedCategory === cat.id ? 'rotate-180' : ''}`}>expand_more</span>
                                                </div>
                                                {expandedCategory === cat.id && (
                                                    <div className="bg-slate-50/50 dark:bg-slate-900/20 px-4 py-2 space-y-1 border-t border-slate-100 dark:border-slate-700">
                                                        {cat.skills.map(skill => {
                                                            const skillId = `${cat.id}-${skill}`.toLowerCase();
                                                            return (
                                                                <label key={skillId} className="flex items-center gap-3 py-1.5 hover:text-indigo-600 cursor-pointer transition-colors group">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedSkills.some(s => s.id === skillId)}
                                                                        onChange={() => toggleSkill(skill, cat.id)}
                                                                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                                                                    />
                                                                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 flex items-center gap-2">
                                                                            {skillLogos[skill] ? (
                                                                                <img src={skillLogos[skill]} alt="" className="w-4 h-4 object-contain" />
                                                                            ) : skillIcons[skill] ? (
                                                                                <span className="material-symbols-outlined text-[14px]">{skillIcons[skill]}</span>
                                                                            ) : null}
                                                                            {skill}
                                                                        </span>
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

                        {/* Grid: Duration, Slots, Salary, Type */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('createOffer.fieldDuration')}</label>
                                <input
                                    name="durationMonths"
                                    type="number"
                                    min="1"
                                    value={formData.durationMonths}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('createOffer.fieldSlots')}</label>
                                <input
                                    name="slotsAvailable"
                                    type="number"
                                    min="1"
                                    value={formData.slotsAvailable}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('createOffer.fieldSalary')}</label>
                                <input
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    placeholder={t('createOffer.fieldSalaryPlaceholder')}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('createOffer.fieldWorkType')}</label>
                                <div className="relative">
                                    <select
                                        name="internshipType"
                                        value={formData.internshipType}
                                        onChange={handleInputChange}
                                        className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-700 dark:text-slate-300"
                                    >
                                        <option value="PFE">PFE</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Perfectionnement">Perfectionnement</option>
                                        <option value="Observation">Observation</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* Location (Wilaya) */}
                        <div className="space-y-2 text-left">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('createOffer.fieldLocation')}</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
                                <input
                                    name="wilaya"
                                    value={formData.wilaya}
                                    onChange={handleInputChange}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    placeholder={t('createOffer.fieldLocationPlaceholder')}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 text-left">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('createOffer.fieldDescription')}</label>
                            <textarea
                                name="description"
                                rows="6"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                                placeholder={t('createOffer.fieldDescriptionPlaceholder')}
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-end gap-4 mt-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
                            disabled={isSaving}
                        >
                            {t('createOffer.cancel')}
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>{t('editOffer.updating')}</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    {t('editOffer.updateOffer')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCompanyOffer;
