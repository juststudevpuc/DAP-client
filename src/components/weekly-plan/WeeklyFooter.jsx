import { useForm } from 'react-hook-form';
import { apiService } from '../../services/api';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const WeeklyFooter = ({ planData }) => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            what_worked: planData?.what_worked || '',
            what_didnt_work: planData?.what_didnt_work || '',
            what_to_improve: planData?.what_to_improve || '',
            what_is_next: planData?.what_is_next || ''
        }
    });

    const onSubmit = async (formData) => {
        try {
            await apiService.updateWeeklyPlan(planData.id, formData);
            alert('Weekly reflections saved successfully!');
        } catch (error) {
            console.error("Failed to save reflections:", error);
            alert("Error saving reflections.");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* Left Side: Summary Statistics */}
            <div>
                <h3 className="font-bold text-base mb-4">Last week summary/សេចក្តីសង្ខេបកាលពីសប្តាហ៍មុន:</h3>
                
                <div className="space-y-4 font-medium">
                    <div className="flex justify-between items-center">
                        <span>ប្រកាស Training/ បានបញ្ចប់</span>
                        <div className="border-b border-dotted border-gray-400 w-32 text-center text-gray-600">
                            {planData?.last_week_training_qty || 0} ({planData?.last_week_training_pct || 0}%)
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>ប្រកាស Onboarding/ បានបញ្ចប់</span>
                        <div className="border-b border-dotted border-gray-400 w-32 text-center text-gray-600">
                            {planData?.last_week_onboarding_qty || 0} ({planData?.last_week_onboarding_pct || 0}%)
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>ប្រកាស Graduated/ បានបញ្ចប់</span>
                        <div className="border-b border-dotted border-gray-400 w-32 text-center text-gray-600">
                            {planData?.last_week_graduated_qty || 0} ({planData?.last_week_graduated_pct || 0}%)
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Reflections */}
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 text-gray-700">What worked/អ្វីដែលអាចទៅរួច?</label>
                    <Textarea {...register('what_worked')} className="h-16 text-sm border-dashed" />
                </div>
                <div>
                    <label className="block mb-1 text-gray-700">What didn't work/អ្វីដែលមិនអាចទៅរួច?</label>
                    <Textarea {...register('what_didnt_work')} className="h-16 text-sm border-dashed" />
                </div>
                <div>
                    <label className="block mb-1 text-gray-700">What is improve?/ចុះអ្វីដែលពង្រឹងបន្ថែម?</label>
                    <Textarea {...register('what_to_improve')} className="h-16 text-sm border-dashed" />
                </div>
                <div>
                    <label className="block mb-1 text-gray-700">What is next?/ចុះអ្វីដែលត្រូវធ្វើបន្ទាប់?</label>
                    <Textarea {...register('what_is_next')} className="h-16 text-sm border-dashed" />
                </div>
                
                <div className="flex justify-end pt-2">
                    <Button onClick={handleSubmit(onSubmit)}>Save Reflections</Button>
                </div>
            </div>
        </div>
    );
};