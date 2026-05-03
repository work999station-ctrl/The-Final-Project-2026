import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import CompanyNavbar from '../components/CompanyNavbar';
import Footer from '../components/Footer';

const CandidateTrackingJobSpecific = () => {
    const { t, lang, setLang } = useLang();
    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-screen">
            <CompanyNavbar />

            <div className="flex">
                {/* SideNavBar */}
                <aside className="bg-slate-50 dark:bg-slate-950 font-sans text-sm h-[calc(100vh-56px)] w-64 sticky left-0 top-[56px] border-r border-slate-200 dark:border-slate-800 flex flex-col p-4">
                    <div className="mb-8 px-2">
                        <div className="flex items-center gap-3 mb-6 text-left">
                            <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic">MC</div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-tight">Senior UI Dev</h3>
                                <p className="text-xs text-slate-500">{t('jobTracking.sidebarOffer')}</p>
                            </div>
                        </div>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">add</span>
                            {t('jobTracking.addCandidate')}
                        </button>
                    </div>
                    <nav className="flex-1 space-y-1 text-left">
                        <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" href="#">
                            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                            {t('jobTracking.overview')}
                        </a>
                        <a className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 rounded-lg px-3 py-2 font-bold transition-transform active:scale-[0.98]" href="#">
                            <span className="material-symbols-outlined" data-icon="view_kanban">view_kanban</span>
                            {t('jobTracking.pipeline')}
                        </a>
                        <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" href="#">
                            <span className="material-symbols-outlined" data-icon="mail">mail</span>
                            {t('jobTracking.messages')}
                        </a>
                        <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" href="#">
                            <span className="material-symbols-outlined" data-icon="event_available">event_available</span>
                            {t('jobTracking.interviews')}
                        </a>
                        <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" href="#">
                            <span className="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
                            {t('jobTracking.archive')}
                        </a>
                    </nav>
                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 text-left">
                        <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" href="#">
                            <span className="material-symbols-outlined" data-icon="help">help</span>
                            {t('jobTracking.help')}
                        </a>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-8 overflow-y-auto bg-slate-50">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <nav className="flex text-xs text-slate-500 gap-2 mb-2 text-left">
                                    <span>{t('jobTracking.breadcrumbJobs')}</span>
                                    <span>/</span>
                                    <span>Engineering</span>
                                    <span>/</span>
                                    <span className="text-indigo-600 font-medium">Senior UI Developer</span>
                                </nav>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight text-left">{t('jobTracking.title')} - Senior UI Developer</h1>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium bg-white hover:bg-slate-50 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">filter_list</span>
                                    {t('jobTracking.filter')}
                                </button>
                                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium bg-white hover:bg-slate-50 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">share</span>
                                    {t('jobTracking.share')}
                                </button>
                            </div>
                        </div>

                        {/* Summary Bar */}
                        <div className="bg-indigo-600 text-white px-6 py-4 rounded-xl shadow-lg shadow-indigo-200/50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined">group</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-lg leading-none">{t('jobTracking.reviewing').replace('{count}', '48')}</p>
                                    <p className="text-indigo-100 text-xs mt-1">{t('jobTracking.newApplicants').replace('{count}', '12')}</p>
                                </div>
                            </div>
                            <div className="flex gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-wider text-indigo-200">{t('jobTracking.totalApplicants')}</p>
                                    <p className="text-xl font-bold">152</p>
                                </div>
                                <div className="text-right border-l border-white/20 pl-8">
                                    <p className="text-[10px] uppercase tracking-wider text-indigo-200">{t('jobTracking.averageMatch')}</p>
                                    <p className="text-xl font-bold">84%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Candidate List Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('jobTracking.tableCandidate')}</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('jobTracking.tableUniversity')}</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('jobTracking.tableSkills')}</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('jobTracking.tableMatch')}</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('jobTracking.tableDate')}</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('jobTracking.tableStatus')}</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{t('jobTracking.tableActions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {/* Candidate Row 1 */}
                                    <tr className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img alt="Marcus Thorne" className="h-10 w-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiMHb5I24hRxrzRAfYzGb-AKNB5ZJAQcDGcuB1xsWtPgGW0X0k6ho-Rgs-E8DtVPBKWAivS9M95CNaZTqcR_oveEkDd0icl66aBSAUDC9ddqjNFkGZ63MZrCkUq0EcA1jSp84j7etn_WMszPJEmz5ymAJ6PCZlwQAWp6DBJz9AkFnc_TIFqS_reMphJmKFMaWfRQD88BIuFs3IC9lzadmdKFcOVKtry9cKc4CcUioC2E_S1NiiuvDERrmVlt82SwLW7Kl-biusUXc" />
                                                <div>
                                                    <p className="font-bold text-slate-900">Marcus Thorne</p>
                                                    <p className="text-xs text-slate-500">London, UK</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">Stanford University</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 flex-wrap max-w-[200px]">
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">React</span>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">Tailwind</span>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">TypeScript</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-indigo-600 h-full w-[96%]"></div>
                                                </div>
                                                <span className="text-sm font-bold text-indigo-600">96%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">Oct 12, 2023</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                                {t('jobTracking.statusInterviewing')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 transition-opacity">
                                                <button className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">check_circle</span>{t('jobTracking.btnAccept')}
                                                </button>
                                                <button className="px-3 py-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">cancel</span>{t('jobTracking.btnRefuse')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Candidate Row 2 */}
                                    <tr className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img alt="Sarah Jenkins" className="h-10 w-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSz1ZnXPq9HdCLWsofnWxRLTQunGJvIeRGo0ppCt0GcmtVzpAAsPBwp2bwDT35F3wWVPZeFXEUMs1z0T4-E6IIwFGKuDvqmdwNnH0ZY37xlLj7oKbttxtcyqB2I25FT03XBFcdQRiL_bGcQdeSHa8dHldKdzb-vvJRtcO5xmFeHBUn05-x8Qfdyqr830rCl_yqsQ56tPFVVlpRNWTl14OBiznlTHXowIor1krbVi7eDT7-ulsBC8T31Q-1H6pMzoe1mPVrC0Qs8RY" />
                                                <div>
                                                    <p className="font-bold text-slate-900">Sarah Jenkins</p>
                                                    <p className="text-xs text-slate-500">Toronto, CAN</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">MIT</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 flex-wrap max-w-[200px]">
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">Vue.js</span>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">Figma</span>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">Node.js</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-indigo-600 h-full w-[89%]"></div>
                                                </div>
                                                <span className="text-sm font-bold text-indigo-600">89%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">Oct 14, 2023</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                {t('jobTracking.statusInReview')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 transition-opacity">
                                                <button className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">check_circle</span>{t('jobTracking.btnAccept')}
                                                </button>
                                                <button className="px-3 py-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">cancel</span>{t('jobTracking.btnRefuse')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Candidate Row 3 */}
                                    <tr className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img alt="Arjun Mehta" className="h-10 w-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHBYCHEuXPa-8gDFG3z9uY6ULY78lmDh5I1r_20oSZEfolAOW4Yy0dlXcwckuBi9iQO-QzhvF8_0xB1Wmtk8nrYtDlPoFzuMzCMRxXhXAJ3eP-1rPvl2Ayu_QMbv4evag3w_rGPCZz6a3RxNsXe7L00KjOdNWIwt0RwvhOLrkGiHPSP6svyfbN7rJqQe-wI1S14mnMGnwYxtEHS4_uNau1BnOe3e7hT_5D0xk4UBjm2Ncw0E_xvULOunuI8_iilHf4-3tvlHfWHhI" />
                                                <div>
                                                    <p className="font-bold text-slate-900">Arjun Mehta</p>
                                                    <p className="text-xs text-slate-500">New York, USA</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">Georgia Tech</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 flex-wrap max-w-[200px]">
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">Svelte</span>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">AWS</span>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">Jest</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-indigo-600 h-full w-[92%]"></div>
                                                </div>
                                                <span className="text-sm font-bold text-indigo-600">92%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">Oct 15, 2023</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                {t('jobTracking.statusOfferSent')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 transition-opacity">
                                                <button className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">check_circle</span>{t('jobTracking.btnAccept')}
                                                </button>
                                                <button className="px-3 py-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">cancel</span>{t('jobTracking.btnRefuse')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between">
                            <p className="text-xs text-slate-500 font-medium">{t('jobTracking.showingCandidates').replace('{start}', '1').replace('{end}', '10').replace('{total}', '48')}</p>
                            <div className="flex gap-1">
                                <button className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50" disabled>
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                <button className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Role-specific Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stat Card 1 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 opacity-5 text-indigo-900 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-8xl">schedule</span>
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-left">{t('jobTracking.statTimeFill')}</p>
                            <div className="flex items-baseline gap-2">
                                <h4 className="text-3xl font-black text-slate-900">18 Days</h4>
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-xs">trending_down</span>
                                    12%
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 text-left">{t('jobTracking.statVsAvg').replace('{days}', '24')}</p>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 opacity-5 text-indigo-900 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-8xl">person_add</span>
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-left">{t('jobTracking.statAccepted')}</p>
                            <div className="flex items-baseline gap-2">
                                <h4 className="text-3xl font-black text-slate-900">12</h4>
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-xs">arrow_upward</span>
                                    3%
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 text-left">{t('jobTracking.statAcceptedDesc')}</p>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 opacity-5 text-indigo-900 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-8xl">handshake</span>
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-left">{t('jobTracking.statAcceptRate')}</p>
                            <div className="flex items-baseline gap-2">
                                <h4 className="text-3xl font-black text-slate-900">92%</h4>
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-xs">arrow_upward</span>
                                    5%
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 text-left">{t('jobTracking.statHistorical')}</p>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default CandidateTrackingJobSpecific;
