import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import ThemeToggle from '../components/ThemeToggle';

const Pricing = () => {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState('monthly');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const tiers = [
        {
            name: 'Starter',
            description: 'For students and small club organizers.',
            monthlyPrice: '0',
            yearlyPrice: '0',
            features: [
                'Basic Profile Management',
                'Up to 50 Opportunities',
                'Community Support',
                'Digital Match Verification'
            ],
            buttonText: 'Start for Free',
            highlight: false
        },
        {
            name: 'Pro',
            description: 'For standard placement offices and growing programs.',
            monthlyPrice: '49',
            yearlyPrice: '39',
            features: [
                'Advanced Skill-Matching',
                'Automated Agreements',
                'Unlimited Opportunities',
                'Priority Email Support',
                'Analytics Dashboard'
            ],
            buttonText: 'Get Started with Pro',
            highlight: true
        },
        {
            name: 'Enterprise',
            description: 'For large university systems and major institutions.',
            monthlyPrice: 'Custom',
            yearlyPrice: 'Custom',
            features: [
                'Everything in Pro',
                'Custom Integrations',
                'Dedicated Success Manager',
                'SSO & Advanced Security',
                'SLA Guarantees'
            ],
            buttonText: 'Contact Sales',
            highlight: false
        }
    ];

    const faqs = [
        {
            question: "Can I switch plans later?",
            answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
        },
        {
            question: "Do you offer discounts for non-profits?",
            answer: "Absolutely. Verified non-profit organizations and registered student associations are eligible for a 50% discount on the Pro plan."
        },
        {
            question: "How does the skill-matching work?",
            answer: "Our proprietary algorithm analyzes over 200 data points across student profiles and role requirements to generate a real-time Match Score, ensuring the highest quality placements."
        }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="stage.io logo" className="h-12 w-auto object-contain dark:invert dark:hue-rotate-180 mix-blend-multiply dark:mix-blend-screen" />
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
                        <Link to="/students" className="hover:text-primary transition-colors">Students</Link>
                        <Link to="/companies" className="hover:text-primary transition-colors">Companies</Link>
                        <Link to="/universities" className="hover:text-primary transition-colors">Universities</Link>
                        <Link to="/" className="hover:text-primary transition-colors">Opportunities</Link>
                        <Link to="/" className="hover:text-primary transition-colors">Talent</Link>
                        <Link to="/blog" className="hover:text-primary transition-colors">Resources</Link>
                        <Link to="/pricing" className="text-primary transition-colors">Pricing</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link to="/login" className="text-sm font-bold px-4 py-2 hover:text-primary transition-colors">Log In</Link>
                        <button 
                            onClick={() => navigate('/student-signup')}
                            className="bg-primary text-white text-sm font-bold py-2 px-6 rounded-full hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 px-6 text-center">
                    <div className="container mx-auto max-w-4xl">
                        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Simple, Transparent Pricing</h1>
                        <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
                            Choose the perfect plan to streamline your placement process. No hidden fees, just straightforward tools to connect talent with opportunity.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-16">
                            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Monthly</span>
                            <button 
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                className="relative w-14 h-8 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors"
                            >
                                <div className={`w-6 h-6 bg-primary rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`}></div>
                            </button>
                            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                Yearly <span className="text-primary text-xs ml-1">(Save 20%)</span>
                            </span>
                        </div>

                        {/* Pricing Tiers */}
                        <div className="grid md:grid-cols-3 gap-8 text-left">
                            {tiers.map((tier) => (
                                <div 
                                    key={tier.name}
                                    className={`relative p-8 rounded-3xl border transition-all ${
                                        tier.highlight 
                                        ? 'bg-slate-900 dark:bg-slate-800 border-primary shadow-2xl shadow-primary/20 scale-105 z-10' 
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/50'
                                    }`}
                                >
                                    {tier.highlight && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full">
                                            Most Popular
                                        </div>
                                    )}
                                    <h3 className={`text-2xl font-black mb-2 ${tier.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{tier.name}</h3>
                                    <p className={`text-sm mb-6 font-medium ${tier.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{tier.description}</p>
                                    
                                    <div className="mb-8">
                                        <span className={`text-4xl font-black ${tier.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                            {tier.monthlyPrice === 'Custom' ? 'Custom' : `$${billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}`}
                                        </span>
                                        {tier.monthlyPrice !== 'Custom' && (
                                            <span className={`text-sm font-bold ml-2 ${tier.highlight ? 'text-slate-400' : 'text-slate-500'}`}>/ month</span>
                                        )}
                                    </div>

                                    <ul className="space-y-4 mb-10">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex gap-3 text-sm font-medium items-start">
                                                <span className="material-symbols-outlined text-primary text-lg shrink-0">check_circle</span>
                                                <span className={tier.highlight ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button 
                                        onClick={() => tier.monthlyPrice === 'Custom' ? navigate('/contact-us') : navigate('/student-signup')}
                                        className={`w-full py-4 rounded-2xl font-bold transition-all ${
                                            tier.highlight 
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:opacity-90' 
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-primary hover:text-white'
                                        }`}
                                    >
                                        {tier.buttonText}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/30">
                    <div className="container mx-auto max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-black mb-12 text-center tracking-tight">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <h4 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">{faq.question}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6">
                    <div className="container mx-auto max-w-4xl bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/30">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Ready to transform your<br />talent network?</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button 
                                onClick={() => navigate('/student-signup')}
                                className="bg-white text-primary px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform"
                            >
                                Start for Free
                            </button>
                            <button 
                                onClick={() => navigate('/contact-us')}
                                className="bg-black/20 text-white border border-white/30 px-10 py-4 rounded-full font-black text-lg hover:bg-black/30 transition-all"
                            >
                                Talk to Sales
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Simple Footer for Legal Pages */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
                            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
                            <Link to="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link>
                            <Link to="/students" className="hover:text-primary transition-colors">Students</Link>
                            <Link to="/companies" className="hover:text-primary transition-colors">Companies</Link>
                            <Link to="/universities" className="hover:text-primary transition-colors">Universities</Link>
                            <Link to="/contact-us" className="hover:text-primary transition-colors">Contact</Link>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            © {new Date().getFullYear()} stag.io. Empowering the next generation of talent.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Pricing;
