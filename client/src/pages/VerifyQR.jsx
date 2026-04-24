import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyQR = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            // Basic delay for UX
            await new Promise(r => setTimeout(r, 1500));

            if (!id || id === 'DEMO') {
                navigate('/verification-invalid', { replace: true });
                return;
            }

            try {
                const response = await fetch(`/api/public/verify-agreement/${id}`);
                const data = await response.json();
                
                if (response.ok && data.success) {
                    navigate(`/verification-success/${id}`, { replace: true });
                } else {
                    navigate('/verification-invalid', { replace: true });
                }
            } catch (err) {
                navigate('/verification-invalid', { replace: true });
            }
        };

        verify();
    }, [id, navigate]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#121121] flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mb-6"></div>
            <h2 className="text-xl font-bold font-space-grotesk text-slate-800 dark:text-white mb-2">Verifying Agreement</h2>
            <p className="text-slate-500 dark:text-slate-400 font-body text-sm text-center">Please wait while we check this document against the university records...</p>
        </div>
    );
};

export default VerifyQR;
