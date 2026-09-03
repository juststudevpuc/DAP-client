import { useForm } from "react-hook-form";
import { apiService } from "../../services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// 1. Field stays outside for performance
const Field = ({ label, name, register }) => (
  <div className="flex justify-between items-center text-[10px] my-1">
    <span className="text-gray-700 truncate mr-2">{label}:</span>
    <Input
      type="number"
      {...register(name)}
      className="h-3 w-6 px-0 py-0 text-center text-[8px] font-medium bg-transparent border-0 border-b border-gray-300 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  </div>
);

export const DailyRow = ({ dayData }) => {
  // 2. Destructure 'formState: { isDirty }' to track changes, and 'reset' to clear the dirty state after saving
  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues: {
      train_expected: dayData.train_expected,
      train_completed: dayData.train_completed,
      train_cancel_delay: dayData.train_cancel_delay,
      onboard_company_info: dayData.onboard_company_info,
      onboard_system_analysis: dayData.onboard_system_analysis,
      onboard_configure_hr: dayData.onboard_configure_hr,
      onboard_provide_lesson: dayData.onboard_provide_lesson,
      onboard_success: dayData.onboard_success,
      grad_certificate: dayData.grad_certificate,
      grad_hr_policy: dayData.grad_hr_policy,
      grad_book: dayData.grad_book,
      comment: dayData.comment || "",
    },
  });

  const onSubmit = async (formData) => {
    const cleanedData = {};
    for (const key in formData) {
      if (key === "comment") {
        cleanedData[key] = formData[key];
      } else {
        cleanedData[key] = formData[key] === "" ? 0 : Number(formData[key]);
      }
    }
    try {
      await apiService.updateDailyMetric(dayData.id, cleanedData);
      alert(`${dayData.day_name} saved successfully!`);

      // 3. Reset the form with the new data. This turns 'isDirty' back to false and hides the button!
      reset(formData);
    } catch (error) {
      console.error(`Failed to save:`, error);
      alert("Error saving data.");
    }
  };

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-50 transition-colors">
      {/* Day Column - Kept very narrow */}
      <td className="p-1 border-r border-gray-800 text-center font-semibold text-[10px] align-middle w-[3%]">
        {dayData.day_name}
      </td>

      {/* Training Column - Reduced padding (px-1 py-0.5) to save vertical space */}
      {/* Training Column - Fixed Width */}
      <td className="px-1 py-0.5 border-r border-gray-800 align-top w-[18px]">
        <Field
          label="Expected Training"
          name="train_expected"
          register={register}
        />
        <Field
          label="Completed Training"
          name="train_completed"
          register={register}
        />
        <Field
          label="Cancel/Delay"
          name="train_cancel_delay"
          register={register}
        />
      </td>

      {/* Onboarding Column - Fixed Width */}
      <td className="px-1 py-0.5 border-r border-gray-800 align-top w-[280px]">
        <Field
          label="Company's Information"
          name="onboard_company_info"
          register={register}
        />
        <Field
          label="System Analysis(All 80%)"
          name="onboard_system_analysis"
          register={register}
        />
        <Field
          label="Configure HR"
          name="onboard_configure_hr"
          register={register}
        />
        <Field
          label="Provide Lesson(Path)"
          name="onboard_provide_lesson"
          register={register}
        />
        <Field
          label="Success Onboarding"
          name="onboard_success"
          register={register}
        />
      </td>

      {/* Graduated Column - Fixed Width */}
      <td className="px-1 py-0.5 border-r border-gray-800 align-top w-[220px]">
        <Field
          label="Provided Certificate"
          name="grad_certificate"
          register={register}
        />
        <Field
          label="Provided HR Policy"
          name="grad_hr_policy"
          register={register}
        />
        <Field label="Provided Book" name="grad_book" register={register} />
      </td>

      {/* Comment Column - Fixed Width & Strictly Fixed Height */}
      <td className="p-1 text-center align-middle relative w-[320px]">
        <div className="flex flex-col h-full w-full relative group">
          <Textarea
            {...register("comment")}
            wrap="soft"
            // We kept the 90px height, break-all, and scrolling...
            // But swapped the border/focus styling to match your minimal aesthetic!
            className="h-[90px] min-h-[90px] max-h-[90px] w-full p-1 text-[9px] text-left align-top break-all overflow-y-auto overflow-x-hidden resize-none bg-transparent border-0 border-b border-gray-300 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-blue-500"
            placeholder="Notes..."
          />

          {isDirty && (
            <Button
              onClick={handleSubmit(onSubmit)}
              className="absolute bottom-2 right-2 h-6 px-3 text-[10px] font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md hover:shadow-lg transition-all print:hidden z-10 flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};
