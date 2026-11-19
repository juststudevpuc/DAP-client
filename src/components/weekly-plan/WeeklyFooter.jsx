import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SUMMARY_STATS = [
  {
    label: "ប្រកាស Training/ បានបញ្ចប់",
    qtyKey: "last_week_training_qty",
    pctKey: "last_week_training_pct",
  },
  {
    label: "ប្រកាស Onboarding/ បានបញ្ចប់",
    qtyKey: "last_week_onboarding_qty",
    pctKey: "last_week_onboarding_pct",
  },
  {
    label: "ប្រកាស Graduated/ បានបញ្ចប់",
    qtyKey: "last_week_graduated_qty",
    pctKey: "last_week_graduated_pct",
  },
];

const REFLECTION_FIELDS = [
  { name: "what_worked", label: "What worked/អ្វីដែលអាចទៅរួច?" },
  { name: "what_didnt_work", label: "What didn't work/អ្វីដែលមិនអាចទៅរួច?" },
  { name: "what_to_improve", label: "What is improve?/ចុះអ្វីដែលពង្រឹងបន្ថែម?" },
  { name: "what_is_next", label: "What is next?/ចុះអ្វីដែលត្រូវធ្វើបន្ទាប់?" },
];

const getDefaultValues = (planData) => ({
  what_worked: planData?.what_worked || "",
  what_didnt_work: planData?.what_didnt_work || "",
  what_to_improve: planData?.what_to_improve || "",
  what_is_next: planData?.what_is_next || "",
});

export const WeeklyFooter = ({ planData, onComplete, currentWeekNumber }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm({
    defaultValues: getDefaultValues(planData),
  });

  useEffect(() => {
    reset({
      what_worked: planData?.what_worked || "",
      what_didnt_work: planData?.what_didnt_work || "",
      what_to_improve: planData?.what_to_improve || "",
      what_is_next: planData?.what_is_next || "",
    });
  }, [
    planData?.what_worked,
    planData?.what_didnt_work,
    planData?.what_to_improve,
    planData?.what_is_next,
    currentWeekNumber,
    reset,
  ]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        week_number: currentWeekNumber || planData?.week_number || 1,
      };

      if (onComplete) {
        await onComplete(payload);
      }

      // Update form baseline so saved text stays visible and Save button hides
      reset(formData);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Reflections saved successfully.",
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (error) {
      console.error("Failed to save reflections:", error);

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Error saving reflections. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[35%_65%] print:grid-cols-[35%_65%] gap-8 print:gap-6 text-sm print:mt-2 print:break-inside-avoid">
      {/* Left Side: Summary Statistics */}
      <div className="pt-8 print:pt-4">
        <h3 className="font-bold text-[14px] mb-6 print:mb-4">
          Last week summary/សេចក្តីសង្ខេបកាលពីសប្តាហ៍មុន:
        </h3>

        <div className="space-y-6 print:space-y-4 font-medium text-[12px] print:text-[11px]">
          {SUMMARY_STATS.map(({ label, qtyKey, pctKey }) => (
            <div key={qtyKey} className="flex justify-between items-end">
              <span>{label}</span>
              <div className="border-b border-dotted border-gray-500 w-24 flex justify-between px-2 pb-1 tabular-nums">
                <span>{planData?.[qtyKey] || 0}</span>
                <span>{planData?.[pctKey] || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Reflections */}
      <div className="flex flex-col gap-4 print:gap-2 pt-8 print:pt-4">
        {REFLECTION_FIELDS.map(({ name, label }) => (
          <div key={name} className="flex flex-col gap-1">
            <label
              htmlFor={name}
              className="text-[12px] font-semibold text-gray-800"
            >
              {label}
            </label>
            <Textarea
              id={name}
              {...register(name)}
              className="w-full h-12 print:h-8 text-[10px] p-1 bg-transparent border-0 border-b border-dotted border-gray-500 rounded-none shadow-none focus-visible:ring-0 resize-none overflow-hidden"
            />
          </div>
        ))}

        {isDirty && (
          <div className="flex justify-end pt-1 print:hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="h-6 px-4 text-[10px] font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm disabled:opacity-60 transition-all"
            >
              {isSubmitting ? "Saving..." : "Save summary"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};