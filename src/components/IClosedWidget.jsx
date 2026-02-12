import React, { useEffect } from 'react';

export default function IClosedWidget() {
    useEffect(() => {
        // Load the iClosed widget script
        const script = document.createElement('script');
        script.src = 'https://app.iclosed.io/assets/widget.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup: remove script when component unmounts
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="w-full max-w-3xl">
            <div
                className="iclosed-widget"
                data-url="https://app.iclosed.io/e/skaleos/audit-strategique-corentin"
                title="Audit Stratégique - Corentin"
                style={{ width: '100%', height: '620px' }}
            ></div>
        </div>
    );
}
