import { useForm } from "react-hook-form";
import { apiService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const WeeklyFooter = ({ planData }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      what_worked: planData?.what_worked || "",
      what_didnt_work: planData?.what_didnt_work || "",
      what_to_improve: planData?.what_to_improve || "",
      what_is_next: planData?.what_is_next || "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await apiService.updateWeeklyPlan(planData.id, formData);
      alert("Weekly reflections saved successfully!");
    } catch (error) {
      console.error("Failed to save reflections:", error);
      alert("Error saving reflections.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
      {/* Left Side: Summary Statistics */}
      <div>
        <h3 className="font-bold text-base mb-4">
          Last week summary/សេចក្តីសង្ខេបកាលពីសប្តាហ៍មុន:
        </h3>

        <div className="space-y-4 font-medium">
          <div className="flex justify-between items-center">
            <span>Training/ បានបញ្ចប់</span>
            <div className="border-b border-dotted border-gray-400 w-32 text-center text-gray-600">
              {planData?.last_week_training_qty || 0} (
              {planData?.last_week_training_pct || 0}%)
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Onboarding/ បានបញ្ចប់</span>
            <div className="border-b border-dotted border-gray-400 w-32 text-center text-gray-600">
              {planData?.last_week_onboarding_qty || 0} (
              {planData?.last_week_onboarding_pct || 0}%)
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Graduated/ បានបញ្ចប់</span>
            <div className="border-b border-dotted border-gray-400 w-32 text-center text-gray-600">
              {planData?.last_week_graduated_qty || 0} (
              {planData?.last_week_graduated_pct || 0}%)
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Reflections */}
      <div className="space-y-2">
        {/* Row 1 */}
        <div className="grid grid-cols-[130px_1fr] items-end gap-2">
          <label className="text-[10px] font-semibold text-gray-700 pb-1">
            អ្វីដែលអាចទៅរួច?
          </label>
          <Textarea
            {...register("what_worked")}
            className="w-full h-8 text-[10px] p-0 bg-transparent border-0 border-b border-gray-300 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-blue-500 resize-none overflow-y-auto break-words"
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-[130px_1fr] items-end gap-2">
          <label className="text-[10px] font-semibold text-gray-700 pb-1">
            អ្វីដែលមិនអាចទៅរួច?
          </label>
          <Textarea
            {...register("what_didnt_work")}
            className="w-full h-8 text-[10px] p-0 bg-transparent border-0 border-b border-gray-300 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-blue-500 resize-none overflow-y-auto break-words"
          />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-[130px_1fr] items-end gap-2">
          <label className="text-[10px] font-semibold text-gray-700 pb-1">
            ចុះអ្វីដែលពង្រឹងបន្ថែម?
          </label>
          <Textarea
            {...register("what_to_improve")}
            className="w-full h-8 text-[10px] p-0 bg-transparent border-0 border-b border-gray-300 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-blue-500 resize-none overflow-y-auto break-words"
          />
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-[130px_1fr] items-end gap-2">
          <label className="text-[10px] font-semibold text-gray-700 pb-1">
            ចុះអ្វីដែលត្រូវធ្វើបន្ទាប់?
          </label>
          <Textarea
            {...register("what_is_next")}
            className="w-full h-8 text-[10px] p-0 bg-transparent border-0 border-b border-gray-300 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-blue-500 resize-none overflow-y-auto break-words"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSubmit(onSubmit)}    
            className="h-6 px-4 text-[10px] font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm print:hidden"
          >
            Save Reflections
          </Button>
        </div>
      </div>
    </div>
  );
};
