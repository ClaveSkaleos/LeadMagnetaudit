import React from 'react';

export default function Logo({ className = "" }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <img
                src="https://raw.githubusercontent.com/ClaveSkaleos/image/436082018401bbe325b37be873da1d5a5431dbdc/logo%20Skaleos%20vert.png"
                alt="Skaleos Logo"
                className="h-14 w-auto object-contain"
            />
            <span className="text-3xl font-bold tracking-tighter text-[#064E3B] font-display lowercase">
                skaleos
            </span>
        </div>
    );
}
