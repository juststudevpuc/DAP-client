import { DailyRow } from './DailyRow';

export const ActionPlanGrid = ({ dailyMetrics }) => {
    if (!dailyMetrics) return null;

    return (
        <div className="w-full border border-gray-800 mb-8">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#8faadc] text-black text-sm text-center">
                    <tr>
                        <th className="p-2 border border-gray-800 font-semibold w-16">Day</th>
                        <th className="p-2 border border-gray-800 font-semibold w-[25%]">Training</th>
                        <th className="p-2 border border-gray-800 font-semibold w-[25%]">Onboarding</th>
                        <th className="p-2 border border-gray-800 font-semibold w-[25%]">Graduated</th>
                        <th className="p-2 border border-gray-800 font-semibold">Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {dailyMetrics.map((dayData) => (
                        <DailyRow key={dayData.id} dayData={dayData} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};