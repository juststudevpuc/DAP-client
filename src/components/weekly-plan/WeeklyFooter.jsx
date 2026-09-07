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
    // 🚨 Adjusted grid proportions to match the template (Left is narrower, Right is wider)
    <div className="grid grid-cols-1 md:grid-cols-[35%_65%] print:grid-cols-[35%_65%] gap-8 print:gap-6 text-sm print:mt-2 print:break-inside-avoid">
      
      {/* Left Side: Summary Statistics */}
      <div className="pt-8 print:pt-4">
        <h3 className="font-bold text-[14px] mb-6 print:mb-4">
          Last week summary/សេចក្តីសង្ខេបកាលពីសប្តាហ៍មុន:
        </h3>

        <div className="space-y-6 print:space-y-4 font-medium text-[12px] print:text-[11px]">
          <div className="flex justify-between items-end">
            <span>ប្រកាស Training/ បានបញ្ចប់</span>
            <div className="border-b border-dotted border-gray-500 w-24 text-center pb-1">
              {planData?.last_week_training_qty || 0} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {planData?.last_week_training_pct || 0}%
            </div>
          </div>
          <div className="flex justify-between items-end">
            <span>ប្រកាស Onboarding/ បានបញ្ចប់</span>
            <div className="border-b border-dotted border-gray-500 w-24 text-center pb-1">
              {planData?.last_week_onboarding_qty || 0} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {planData?.last_week_onboarding_pct || 0}%
            </div>
          </div>
          <div className="flex justify-between items-end">
            <span>ប្រកាស Graduated/ បានបញ្ចប់</span>
            <div className="border-b border-dotted border-gray-500 w-24 text-center pb-1">
              {planData?.last_week_graduated_qty || 0} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {planData?.last_week_graduated_pct || 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Reflections */}
      <div className="flex flex-col gap-4 print:gap-2">
        
        {/* Row 1 */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-gray-800">
            What worked/អ្វីដែលអាចទៅរួច?
          </label>
          <Textarea
            {...register("what_worked")}
            className="w-full h-12 print:h-8 text-[11px] p-1 bg-transparent border-0 border-b border-dotted border-gray-500 rounded-none shadow-none focus-visible:ring-0 resize-none overflow-hidden"
          />
        </div>

        {/* Row 2 */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-gray-800">
            What didn't work/អ្វីដែលមិនអាចទៅរួច?
          </label>
          <Textarea
            {...register("what_didnt_work")}
            className="w-full h-12 print:h-8 text-[11px] p-1 bg-transparent border-0 border-b border-dotted border-gray-500 rounded-none shadow-none focus-visible:ring-0 resize-none overflow-hidden"
          />
        </div>

        {/* Row 3 */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-gray-800">
            What is improve?/ចុះអ្វីដែលពង្រឹងបន្ថែម?
          </label>
          <Textarea
            {...register("what_to_improve")}
            className="w-full h-12 print:h-8 text-[11px] p-1 bg-transparent border-0 border-b border-dotted border-gray-500 rounded-none shadow-none focus-visible:ring-0 resize-none overflow-hidden"
          />
        </div>

        {/* Row 4 */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-gray-800">
            What is next?/ចុះអ្វីដែលត្រូវធ្វើបន្ទាប់?
          </label>
          <Textarea
            {...register("what_is_next")}
            className="w-full h-12 print:h-8 text-[11px] p-1 bg-transparent border-0 border-b border-dotted border-gray-500 rounded-none shadow-none focus-visible:ring-0 resize-none overflow-hidden"
          />
        </div>

        <div className="flex justify-end pt-1 print:hidden">
          <Button
            onClick={handleSubmit(onSubmit)}    
            className="h-6 px-4 text-[10px] font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm"
          >
            Save Reflections
          </Button>
        </div>
      </div>

    </div>
  );
};