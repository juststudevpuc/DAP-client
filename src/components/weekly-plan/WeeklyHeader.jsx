export const WeeklyHeader = ({ planData }) => {
    // Helper function to format Laravel timestamps into clean "DD / MM / YYYY" text
    const formatDate = (dateString) => {
        if (!dateString) return '...';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, ' / ');
    };

    return (
        <div className="mb-8">
            {/* Top Title Section */}
            <div className="flex items-center justify-center mb-8 relative">
                {/* CheckinMe Logo Placeholder */}
                <div className="absolute left-0 text-blue-600 font-bold text-xl flex items-center gap-2">
                    <div className="bg-blue-600 text-white rounded p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                    </div>
                    <div>
                        <div className="leading-none text-lg">CheckinMe</div>
                        <div className="text-[9px] font-normal text-gray-500">Automate Workplace</div>
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-center text-gray-900 tracking-tight">
                    Weekly Action Plan
                </h1>
            </div>

            {/* Information Rows */}
            <div className="flex flex-col gap-6 text-sm font-semibold text-gray-800 px-2">
                
                {/* Row 1: Employee, Dates, Week */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-left">
                        Name/ ឈ្មោះ: Tep Panhasak
                    </div>
                    <div className="text-center">
                        Date.: {formatDate(planData?.start_date)} to {formatDate(planData?.end_date)}
                    </div>
                    <div className="text-right">
                        Week/ សប្តាហ៍: {planData?.week_number?.toString().padStart(2, '0') || '01'}
                    </div>
                </div>

                {/* Row 2: Target Metrics (Now using fixed values) */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-left">
                        ប្រកាស Completed Training: <span className="ml-1 font-normal">10</span>
                    </div>
                    <div className="text-center">
                        ប្រកាស Completed Onboarding: <span className="ml-1 font-normal">9</span>
                    </div>
                    <div className="text-right">
                        ប្រកាស Graduated: <span className="ml-1 font-normal">9</span>
                    </div>
                </div>
                
            </div>
        </div>
    );
};