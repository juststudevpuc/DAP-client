import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// 1. Updated Field: Now a 3x4 Numpad with 2-digit limit and Delete!
const Field = ({ label, name, register, watch, setValue }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 'watch' reads the current value dynamically from react-hook-form
  const currentValue = watch(name);

  // LOGIC 1: Combine numbers together, limit to 2 digits max
  const handleDigitClick = (digit) => {
    const prevStr = !currentValue || currentValue === 0 ? "" : String(currentValue);
    
    // Stop adding if it's already 2 digits!
    if (prevStr.length >= 2) return;

    const newNumber = Number(prevStr + digit);
    setValue(name, newNumber, { shouldDirty: true });
  };

  // LOGIC 2: Delete the last number (Backspace)
  const handleDelete = () => {
    const prevStr = !currentValue || currentValue === 0 ? "" : String(currentValue);
    
    if (prevStr.length <= 1) {
      // If it's 1 digit (or empty), just reset to 0
      setValue(name, 0, { shouldDirty: true });
    } else {
      // Slice off the last character
      const newNumber = Number(prevStr.slice(0, -1));
      setValue(name, newNumber, { shouldDirty: true });
    }
  };

  return (
    <div className="flex justify-between items-center text-[10px] my-1 relative">
      <span className="text-black font-medium truncate mr-2">{label}:</span>

      {/* Hidden input keeps react-hook-form working perfectly in the background */}
      <input type="hidden" {...register(name)} />

      {/* Trigger: Looks exactly like your minimal printed line */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="h-3 w-6 px-0 py-0 text-center text-[8px] font-bold bg-transparent border-0 border-b border-gray-300 cursor-pointer flex items-center justify-center hover:border-blue-500 transition-colors"
      >
        {currentValue !== undefined ? currentValue : 0}
      </div>

      {/* Numpad Popover */}
      {isOpen && (
        <>
          {/* Invisible overlay: clicking anywhere outside closes the grid */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-4 z-50 bg-white border border-gray-200 shadow-xl p-1.5 rounded-md print:hidden">
            
            {/* Tailwind's CSS Grid: 3 columns for a standard Numpad */}
            <div className="grid grid-cols-3 gap-1 w-[90px]">
              
              {/* Digits 1-9 */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div
                  key={num}
                  onClick={() => handleDigitClick(num)}
                  className="flex items-center justify-center text-[10px] h-6 w-6 bg-gray-50 hover:bg-blue-600 hover:text-white cursor-pointer rounded-sm transition-colors border border-gray-100 font-medium select-none"
                >
                  {num}
                </div>
              ))}

              {/* Bottom Row: Delete, 0, OK */}
              <div
                onClick={handleDelete}
                className="flex items-center justify-center text-[9px] h-6 w-6 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 cursor-pointer rounded-sm transition-colors border border-red-100 font-medium select-none"
              >
                Del
              </div>

              <div
                onClick={() => handleDigitClick(0)}
                className="flex items-center justify-center text-[10px] h-6 w-6 bg-gray-50 hover:bg-blue-600 hover:text-white cursor-pointer rounded-sm transition-colors border border-gray-100 font-medium select-none"
              >
                0
              </div>

              <div
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center text-[9px] h-6 w-6 bg-green-50 hover:bg-green-500 hover:text-white text-green-600 cursor-pointer rounded-sm transition-colors border border-green-100 font-bold select-none"
              >
                OK
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const DailyRow = ({ dayData }) => {
  // 2. Added 'watch' and 'setValue' to the destructuring
  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
    watch,
    setValue,
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
      {/* Day Column */}
      <td className="p-1 border-r border-gray-800 text-center font-semibold text-[10px] align-middle w-[3%]">
        {dayData.day_name}
      </td>

      {/* Training Column */}
      <td className="px-1 border-r border-gray-800  w-[18px] text-blue-600 ">
        {/* Passed watch and setValue to every field */}
        <Field
          label="Expected Training"
          name="train_expected"
          register={register}
          watch={watch}
          setValue={setValue}
        />
        <Field
          label="Completed Training"
          name="train_completed"
          register={register}
          watch={watch}
          setValue={setValue}
        />
        <Field
          label="Cancel/Delay"
          name="train_cancel_delay"
          register={register}
          watch={watch}
          setValue={setValue}
        />
      </td>

      {/* Onboarding Column */}
      <td className="px-1  border-r border-gray-800 align-top w-[280px] text-blue-500">
        <Field
          label="Company's Information"
          name="onboard_company_info"
          register={register}
          watch={watch}
          setValue={setValue}
        />
        <Field
          label="System Analysis(All 80%)"
          name="onboard_system_analysis"
          register={register}
          watch={watch}
          setValue={setValue}
        />
        <Field
          label="Configure HR"
          name="onboard_configure_hr"
          register={register}
          watch={watch}
          setValue={setValue}
        />
        <Field
          label="Provide Lesson(Path)"
          name="onboard_provide_lesson"
          register={register}
          watch={watch}
          setValue={setValue}
        />
        <Field
          label="Success Onboarding"
          name="onboard_success"
          register={register}
          watch={watch}
          setValue={setValue}
        />
      </td>

      {/* Graduated Column */}
      <td className="px-1  border-r border-gray-800 w-[220px] text-blue-500">
        <Field
          label="Provided Certificate"
          name="grad_certificate"
          register={register}
          watch={watch}
          setValue={setValue}
        />
        <Field
          label="Provided HR Policy"
          name="grad_hr_policy"
          register={register}
          watch={watch}
          setValue={setValue}
        />
        <Field
          label="Provided Book"
          name="grad_book"
          register={register}
          watch={watch}
          setValue={setValue}
        />
      </td>

      {/* Comment Column */}
      <td className="p-1 text-center align-middle relative w-[320px]">
        <div className="flex flex-col h-full w-full relative group">
          <Textarea
            {...register("comment")}
            wrap="soft"
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