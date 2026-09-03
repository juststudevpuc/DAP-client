import { useForm } from 'react-hook-form';
import { apiService } from '../../services/api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// 1. Move Field OUTSIDE the main component so React only creates it once!
const Field = ({ label, name, register }) => (
    <div className="flex justify-between items-center text-[11px] my-1">
        <span className="text-gray-700 truncate mr-2">{label}:</span>
        <Input type="number" {...register(name)} className="h-5 w-12 px-1 py-0 text-right text-[11px] rounded-sm border-gray-400" />
    </div>
);

export const DailyRow = ({ dayData }) => {
    const { register, handleSubmit } = useForm({
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
            comment: dayData.comment || ''
        }
    });

    const onSubmit = async (formData) => {
        const cleanedData = {};
        for (const key in formData) {
            if (key === 'comment') {
                cleanedData[key] = formData[key];
            } else {
                cleanedData[key] = formData[key] === "" ? 0 : Number(formData[key]);
            }
        }
        try {
            await apiService.updateDailyMetric(dayData.id, cleanedData);
            alert(`${dayData.day_name} saved successfully!`);
        } catch (error) {
            console.error(`Failed to save:`, error);
            alert("Error saving data.");
        }
    };

    return (
        <tr className="border-b border-gray-800 hover:bg-gray-50 transition-colors">
            <td className="p-2 border-r border-gray-800 text-center font-medium text-sm align-middle">{dayData.day_name}</td>
            
            {/* 2. Notice we are now passing register={register} to each Field */}
            <td className="p-2 border-r border-gray-800 align-top">
                <Field label="Expected Training" name="train_expected" register={register} />
                <Field label="Completed Training" name="train_completed" register={register} />
                <Field label="Cancel/Delay" name="train_cancel_delay" register={register} />
            </td>
            
            <td className="p-2 border-r border-gray-800 align-top">
                <Field label="Company's Information" name="onboard_company_info" register={register} />
                <Field label="System Analysis(All 80%)" name="onboard_system_analysis" register={register} />
                <Field label="Configure HR" name="onboard_configure_hr" register={register} />
                <Field label="Provide Lesson(Path)" name="onboard_provide_lesson" register={register} />
                <Field label="Success Onboarding" name="onboard_success" register={register} />
            </td>

            <td className="p-2 border-r border-gray-800 align-top">
                <Field label="Provided Certificate" name="grad_certificate" register={register} />
                <Field label="Provided HR Policy" name="grad_hr_policy" register={register} />
                <Field label="Provided Book" name="grad_book" register={register} />
            </td>
            
            <td className="p-2 text-center align-middle">
                <div className="flex flex-col gap-2 px-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 text-xs w-full">Comment</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Comment & Details for {dayData.day_name}</DialogTitle>
                            </DialogHeader>
                            <Textarea {...register('comment')} className="min-h-[120px]" placeholder="Enter daily notes here..." />
                            <Button onClick={handleSubmit(onSubmit)} className="w-full">Save Day Data</Button>
                        </DialogContent>
                    </Dialog>
                    
                    {/* The Save Button is now right on the grid! */}
                    <Button 
                        onClick={handleSubmit(onSubmit)} 
                        size="sm" 
                        className="h-7 text-xs w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Save Row
                    </Button>
                </div>
            </td>
        </tr>
    );
};