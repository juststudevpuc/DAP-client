import { DailyRow } from './DailyRow';

export const ActionPlanGrid = ({ dailyMetrics }) => {
    if (!dailyMetrics) return null;

    return (
        <div className="w-full border border-gray-800 mb-8">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#8faadc] text-black text-[10px] text-center">
                    <tr>
                        <th className="p-2 border border-gray-800 font-semibold w-10">Day</th>
                        <th className="p-2 border border-gray-800 font-semibold w-[5%]">Training</th>
                        <th className="p-2 border border-gray-800 font-semibold w-[20%]">Onboarding</th>
                        <th className="p-2 border border-gray-800 font-semibold w-[5%]">Graduated</th>
                        <th className="p-2 border border-gray-800 font-semibold w-[50%]">Comment</th>
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