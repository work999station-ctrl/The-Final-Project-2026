import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../assets/logo.png';


const AgreementPreview = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const agreementRef = useRef(null);

    useEffect(() => {
        const fetchApplicationInfo = async () => {
            try {
                const response = await fetch(`/api/admin/application/${applicationId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setApplication(data.application);
                } else {
                    console.error('Failed to load agreement data:', data.error);
                }
            } catch (err) {
                console.error('Failed to fetch application for agreement', err);
            } finally {
                setLoading(false);
            }
        };

        if (applicationId) {
            fetchApplicationInfo();
        } else {
            setLoading(false);
        }
    }, [applicationId]);

    const handleDownloadPDF = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    // Default Fallback Data if ID not found
    const data = application || {
        studentName: "Amine Benali",
        studentYear: "Master 2 Software Engineering",
        offerTitle: "Frontend Development",
        companyName: "TechCorp Solutions Inc.",
        companyRepresentative: "Sarah Jenkins, Senior Engineering Manager",
        universityName: "University of Constantine 2",
        startDate: "October 1st, 2023",
        endDate: "March 31st, 2024",
    };

    return (
        <div className="bg-[#F8FAFC] print:bg-white text-[#0F172A] font-['Inter'] antialiased min-h-screen flex flex-col overflow-hidden print:block print:h-auto">
            {/* Header / Navigation */}
            <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-20 relative print:hidden">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                    <img src={logo} alt="Stag.io Logo" className="h-10 w-auto object-contain" />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-slate-50 relative print:p-0 print:bg-white print:block">
                <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none print:hidden"></div>

                {/* Agreement Preview Modal Container */}
                <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden z-10 print:h-auto print:shadow-none print:border-none print:rounded-none">

                    {/* Modal Header */}
                    <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 print:hidden">
                        <div className="flex flex-col">
                            <h1 className="font-['Space_Grotesk'] font-bold text-xl text-slate-900">Agreement Preview</h1>
                            <p className="text-xs text-slate-500">Review finalized contract terms before signing or exporting.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold tracking-widest rounded-md border border-amber-200 uppercase">Ready For Print</span>
                            <button
                                onClick={handleDownloadPDF}
                                className="ml-2 flex flex-row items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-full text-sm font-bold shadow-sm transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px]">download</span> PDF
                            </button>
                        </div>
                    </div>

                    {/* Modal Body: Centered Preview */}
                    <div className="flex flex-1 overflow-hidden bg-slate-100/50 justify-center overflow-y-auto p-4 sm:p-8 print:p-0 print:bg-white print:block print:overflow-visible">

                        {/* Paper Document Container (Target for PDF) */}
                        <style>{`
                            @media print {
                                @page { margin: 0; size: auto; }
                                body { margin: 1cm; padding: 0 !important; }
                            }
                        `}</style>
                        <div
                            ref={agreementRef}
                            className="bg-white w-[816px] min-w-[816px] min-h-[1056px] shrink-0 shadow-sm ring-1 ring-slate-900/5 p-12 sm:p-16 text-sm leading-relaxed text-slate-800 relative mx-auto print:shadow-none print:ring-0 print:min-h-0 print:h-auto print:w-full print:min-w-0 print:p-4 print:m-0"
                            style={{ backgroundImage: 'radial-gradient(#f1f5f9 0.5px, transparent 0.5px), radial-gradient(#f1f5f9 0.5px, #ffffff 0.5px)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}
                        >
                            {/* Watermark (PDF visibility issue fixed by opacity) */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none z-0">
                                <span className="font-['Space_Grotesk'] font-bold text-[100px] sm:text-[120px] -rotate-45 text-slate-900">FINAL COPY</span>
                            </div>

                            <div className="relative z-10">
                                {/* Header of Doc */}
                                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                                    <div className="flex items-center gap-3">
                                        <img src={logo} alt="University Logo" className="h-16 w-16 object-contain rounded filter grayscale" />
                                        <div>
                                            <h2 className="font-['Space_Grotesk'] font-bold text-xl uppercase tracking-tight text-slate-900">{data.universityName}</h2>
                                            <p className="font-mono text-xs text-slate-500">Department of {data.studentDept || 'Technology'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-['Space_Grotesk'] font-bold text-slate-900">INTERNSHIP AGREEMENT</h3>
                                        <p className="font-mono text-xs text-slate-500">Ref: 2026-INT-{Math.floor(Math.random() * 900) + 100}</p>
                                    </div>
                                </div>

                                {/* Doc Content */}
                                <div className="space-y-6 font-serif text-[15px]">
                                    <p>This Tripartite Internship Agreement ("Agreement") is made and entered into on <strong className="bg-amber-50 px-1">{data.startDate}</strong>, by and between:</p>

                                    <ol className="list-decimal list-inside space-y-4 ml-2">
                                        <li className="pl-2">
                                            <strong>The Student:</strong><br />
                                            <span className="ml-6 block">{data.studentName}, enrolled in {data.studentYear}.</span>
                                        </li>
                                        <li className="pl-2">
                                            <strong>The Host Company:</strong><br />
                                            <span className="ml-6 block">{data.internshipOffice}, represented by <strong className="bg-amber-50 px-1">{data.companyRepresentative || 'HR Management'}</strong>.</span>
                                        </li>
                                        <li className="pl-2">
                                            <strong>The Educational Institution:</strong><br />
                                            <span className="ml-6 block">{data.adminName}, represented by the Dean of {data.adminDeptHead}.</span>
                                        </li>
                                    </ol>

                                    <div className="mt-8">
                                        <h4 className="font-bold uppercase text-xs tracking-wider border-b border-slate-200 pb-1 mb-3 text-slate-500">Article 1: Purpose & Scope</h4>
                                        <p>The purpose of this internship is to provide the Student with practical professional experience in the field of <strong>{data.offerTitle}</strong>. The Student will be integrated into the Host Organization's team to acquire critical skills and modern architectures related to the role.</p>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="font-bold uppercase text-xs tracking-wider border-b border-slate-200 pb-1 mb-3 text-slate-500">Article 2: Duration</h4>
                                        <p>The internship shall commence on <strong className="bg-amber-50 px-1">{data.startDate}</strong> and shall terminate on <strong className="bg-amber-50 px-1">{data.endDate}</strong>. The weekly schedule will be full-time (40 hours/week) unless otherwise agreed upon in standard legal provisions.</p>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="font-bold uppercase text-xs tracking-wider border-b border-slate-200 pb-1 mb-3 text-slate-500">Article 3: Insurance & Liability</h4>
                                        <p>During the internship, the Student remains affiliated with the University for social security purposes. Civil liability is covered under Policy Number <strong className="bg-amber-50 px-1 font-mono text-xs">UNIV-INS-2026-8892</strong>.</p>
                                    </div>
                                    <div className="mt-6">
                                        <h4 className="font-bold uppercase text-xs tracking-wider border-b border-slate-200 pb-1 mb-3 text-slate-500">Article 8: Official Digital Documents & Legal Validity</h4>
                                        <p className="text-sm">This document is digitally issued and legally binding under Ministry of Higher Education standards.<br />Authenticity is verified via the unique QR code, superseding physical signatures and stamps.</p>
                                    </div>
                                </div>

                                {/* QR Code Section */}
                                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-6 print:mt-4 print:pt-4">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Document Authenticity</p>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Scan this QR code or visit the link to verify the authenticity of this internship agreement.
                                            Each code is uniquely generated for <strong className="text-slate-700">{data.studentName}</strong> and encodes
                                            all critical agreement identifiers.
                                        </p>
                                        <p className="font-mono text-[9px] text-slate-400 mt-2 break-all">
                                            ID: AGR-{applicationId || 'DEMO'}-{data.studentName?.replace(/\s+/g, '').toUpperCase().slice(0, 6)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 shrink-0">
                                        <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                                            <QRCodeSVG
                                                value={`${window.location.origin}/verify-qr/${applicationId || 'DEMO'}`}
                                                size={100}
                                                level="M"
                                                includeMargin={false}
                                                fgColor="#0f172a"
                                                bgColor="#ffffff"
                                            />
                                        </div>
                                        <p className="text-[8px] text-slate-400 uppercase tracking-widest font-medium mb-0 pb-0">Scan to Verify</p>
                                        <a 
                                            href={`${window.location.origin}/verify-qr/${applicationId || 'DEMO'}`}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[8px] font-mono text-blue-500 hover:text-blue-600 hover:underline break-all text-center"
                                        >
                                            {window.location.origin}/verify-qr/{applicationId || 'DEMO'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <div className="print:hidden">
            </div>
        </div>
    );
};

export default AgreementPreview;
