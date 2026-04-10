import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const [studentRes, companyRes, adminRes] = await Promise.all([
                    fetch('/api/student/me').catch(() => ({ ok: false })),
                    fetch('/api/company/me').catch(() => ({ ok: false })),
                    fetch('/api/admin/me').catch(() => ({ ok: false }))
                ]);

                if (studentRes.ok) {
                    const data = await studentRes.json();
                    setUser({ ...data.user, role: data.user.role || 'student' });
                } else if (companyRes.ok) {
                    const data = await companyRes.json();
                    setUser({ ...data.user, role: data.user.role || 'company' });
                } else if (adminRes.ok) {
                    const data = await adminRes.json();
                    setUser({ ...data.user, role: data.user.role || 'admin' });
                }
            } catch (err) {
                console.error("Auth check failed:", err);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();

        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        const smoothScroll = function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust for sticky header height
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        };

        navLinks.forEach(link => {
            link.addEventListener('click', smoothScroll);
        });

        // Add scroll effect to header
        const header = document.querySelector('header');

        const scrollEffect = () => {
            if (header) {
                if (window.scrollY > 10) {
                    header.classList.add('shadow-md');
                } else {
                    header.classList.remove('shadow-md');
                }
            }
        };

        window.addEventListener('scroll', scrollEffect);

        return () => {
            navLinks.forEach(link => {
                link.removeEventListener('click', smoothScroll);
            });
            window.removeEventListener('scroll', scrollEffect);
        }
    }, []);

    const handleDashboardClick = () => {
        if (!user) return;

        const role = user.role?.toLowerCase();
        if (role === 'admin') {
            navigate('/admin-dashboard');
        } else if (role === 'company') {
            navigate('/company-dashboard');
        } else {
            // Default to student dashboard
            navigate('/student-dashboard');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display relative flex min-h-screen flex-col overflow-x-hidden">
            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
                            <span className="material-symbols-outlined">hub</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">stage.io</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-semibold hover:text-primary transition-colors" href="#students">Students</a>
                        <a className="text-sm font-semibold hover:text-primary transition-colors" href="#companies">Companies</a>
                        <a className="text-sm font-semibold hover:text-primary transition-colors" href="#universities">Universities</a>
                        <a className="text-sm font-semibold hover:text-primary transition-colors" href="#features">Features</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        {!loading && (
                            user ? (
                                <div className="flex items-center gap-4">
                                    <button onClick={handleDashboardClick} className="text-sm font-bold text-primary hover:underline">Dashboard</button>
                                    <div
                                        className="size-10 rounded-full border-2 border-primary bg-cover bg-center cursor-pointer shadow-sm"
                                        style={{ backgroundImage: `url('${user.profilePicture || user.logo || '/images/default-avatar.png'}')` }}
                                        onClick={handleDashboardClick}
                                        title="View Profile"
                                    ></div>
                                </div>
                            ) : (
                                <>
                                    <button className="hidden sm:block text-sm font-bold px-4 py-2 hover:text-primary" onClick={() => navigate('/login')}>Log In</button>
                                    <button className="bg-primary text-white text-sm font-bold py-2.5 px-6 rounded-full hover:opacity-90 transition-all shadow-lg shadow-primary/20" onClick={() => navigate('/student-signup')}>
                                        Get Started
                                    </button>
                                </>
                            )
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative px-6 py-16 md:py-24 lg:py-32 overflow-hidden">
                    <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col gap-8">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full w-fit">
                                <span className="material-symbols-outlined text-sm">verified</span>
                                <span className="text-xs font-bold uppercase tracking-wider">The Digital Bridge is Here</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                                Bridge the gap between <span className="text-primary">graduation</span> and career.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                                Streamline internship agreements and connect top academic talent with industry leaders
                                through our high-speed digital bridge.
                            </p>
                            {!user && (
                                <div className="flex flex-wrap gap-4">
                                    <button className="bg-primary text-white font-bold py-4 px-8 rounded-full hover:scale-105 transition-transform shadow-xl shadow-primary/25">
                                        <a href="/student-signup">Join as a Student</a>
                                    </button>
                                    <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold py-4 px-8 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        <a href="/company-Signup">Partner as a Company</a>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl"></div>
                            <img className="w-full h-auto object-cover aspect-[4/3]"
                                alt="Group of students and professionals working together in a modern tech office"
                                src="/images/hero-image.jpg" />
                        </div>
                    </div>
                </section>

                {/* Trust Logos */}
                <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                    <div className="container mx-auto px-6">
                        <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Trusted by World-Class Institutions &amp; Tech Giants</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all">
                            <div className="text-2xl font-black text-slate-900 dark:text-white">MIT</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">GOOGLE</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">STANFORD</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">MICROSOFT</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">ETH</div>
                        </div>
                    </div>
                </section>

                {/* Capabilities Section */}
                <section className="py-24 bg-background-light dark:bg-background-dark" id="features">
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl mb-16">
                            <h2 className="text-primary font-bold text-sm uppercase tracking-widest mb-4">Our Capabilities</h2>
                            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Powerful tools designed for the modern transition.</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-400">We’ve automated the friction out of the internship and hiring lifecycle, allowing talent to shine and companies to scale.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="group p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">handshake</span>
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Match</h4>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Skill-forward matching algorithms that bypass traditional bias to find the perfect professional fit.</p>
                            </div>
                            <div className="group p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">bolt</span>
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Automate</h4>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Completely paperless internship agreements and automated legal workflows for legal compliance.</p>
                            </div>
                            <div className="group p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">monitoring</span>
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Track</h4>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Real-time progress tracking, feedback loops, and performance analytics for all stakeholders.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stakeholder Values */}
                <section className="py-24 bg-slate-100 dark:bg-slate-900/50">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 text-slate-900 dark:text-white">Value for Every Stakeholder</h2>
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Students */}
                            <div className="flex flex-col bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                                <div className="h-48 overflow-hidden">
                                    <img className="w-full h-full object-cover" alt="Happy university students in a study lounge environment" src="/images/students.jpg" />
                                </div>
                                <div className="p-8">
                                    <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">For Students</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                            <span>Showcase skills, not just degrees</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                            <span>Direct access to global tech leaders</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                            <span>One-click internship contracting</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* Companies */}
                            <div className="flex flex-col bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                                <div className="h-48 overflow-hidden">
                                    <img className="w-full h-full object-cover" alt="Modern high-tech corporate office interior" src="/images/office.jpg" />
                                </div>
                                <div className="p-8">
                                    <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">For Companies</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                            <span>Pre-vetted top-tier tech talent</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                            <span>Reduced hiring cycle time by 60%</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                            <span>Centralized internship management</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* Universities */}
                            <div className="flex flex-col bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                                <div className="h-48 overflow-hidden">
                                    <img className="w-full h-full object-cover" alt="Academic administrative staff using digital dashboard" src="/images/admin.jpg" />
                                </div>
                                <div className="p-8">
                                    <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">For Universities</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                            <span>100% paperless approval workflows</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                            <span>Employer partnership tracking</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                            <span>Alumni career outcome data</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Stepper */}
                <section className="py-24 bg-background-light dark:bg-background-dark">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">How It Works</h2>
                            <p className="text-slate-600 dark:text-slate-400">The fastest path from campus to corporate.</p>
                        </div>
                        <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 max-w-5xl mx-auto">
                            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-xl mb-6 shadow-lg shadow-primary/40">1</div>
                                <h5 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Digital Onboarding</h5>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Students and companies create skill-rich profiles.</p>
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-xl mb-6 shadow-lg shadow-primary/40">2</div>
                                <h5 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Smart Matching</h5>
                                <p className="text-sm text-slate-500 dark:text-slate-400">AI suggests partnerships based on skill and culture fit.</p>
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-xl mb-6 shadow-lg shadow-primary/40">3</div>
                                <h5 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Auto-Contracting</h5>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Generate and sign agreements instantly online.</p>
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-xl mb-6 shadow-lg shadow-primary/40">4</div>
                                <h5 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Career Launch</h5>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Seamless transition into full-time roles.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="relative bg-primary rounded-[3rem] p-12 md:p-20 text-center overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                            </div>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to build the future of work?</h2>
                                <p className="text-white/80 text-lg mb-12">Whether you're a student seeking opportunity or a company seeking talent, the bridge is ready for you.</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button className="bg-white text-primary font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform shadow-xl">
                                        Get Started Free
                                    </button>
                                    <button className="bg-transparent border-2 border-white/30 text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 transition-colors">
                                        Book a Demo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-16">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-3 text-white mb-6">
                                <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
                                    <span className="material-symbols-outlined">hub</span>
                                </div>
                                <h2 className="text-xl font-bold tracking-tight">stage.io</h2>
                            </div>
                            <p className="text-sm leading-relaxed mb-6">The premier platform for connecting academic brilliance with industrial innovation.</p>
                            <div className="flex gap-4">
                                <a className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                                    <span className="material-symbols-outlined text-sm">public</span>
                                </a>
                                <a className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                                    <span className="material-symbols-outlined text-sm">alternate_email</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h6 className="text-white font-bold mb-6">Platform</h6>
                            <ul className="space-y-4 text-sm">
                                <li><a className="hover:text-white transition-colors" href="#">Students</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Companies</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Universities</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h6 className="text-white font-bold mb-6">Company</h6>
                            <ul className="space-y-4 text-sm">
                                <li><a className="hover:text-white transition-colors" href="#">About Us</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Careers</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Blog</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h6 className="text-white font-bold mb-6">Legal</h6>
                            <ul className="space-y-4 text-sm">
                                <li><a className="hover:text-white transition-colors" href="#">Privacy Policy</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Terms of Service</a></li>
                                <li><a className="hover:text-white transition-colors" href="#">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <p>© 2024 stage.io Inc. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a className="hover:text-white transition-colors" href="#">Facebook</a>
                            <a className="hover:text-white transition-colors" href="#">Twitter</a>
                            <a className="hover:text-white transition-colors" href="#">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
