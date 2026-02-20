import React from 'react';

export default function Logo({ className = "" }) {
    return (
        <div className={`flex items-center ${className}`}>
            <img
                src="https://raw.githubusercontent.com/ClaveSkaleos/image/5b14e067559ad96988f92a8466dcfd44b27d1522/Capture%20d%E2%80%99e%CC%81cran%202026-02-20%20a%CC%80%2013.52.42-Photoroom.png"
                alt="Skaleos Logo"
                className="h-14 w-auto object-contain"
            />
        </div>
    );
}
