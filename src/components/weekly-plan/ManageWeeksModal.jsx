import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiService } from "../../services/api";
import Swal from "sweetalert2";

export const ManageWeeksModal = ({ isOpen, onClose, history, onDeleted }) => {
  const [deletingId, setDeletingId] = useState(null);

  if (!isOpen) return null;

 const handleDelete = async (id, weekNumber) => {
    // 1. The SweetAlert Confirmation Popup
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to permanently delete Week ${weekNumber}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Tailwind red-500 for delete
      cancelButtonColor: '#6b7280',  // Tailwind gray-500 for cancel
      confirmButtonText: 'Yes, delete it!'
    });

    // Stop execution if they click Cancel or click outside the box
    if (!result.isConfirmed) {
      return;
    }

    setDeletingId(id);
    try {
      await apiService.deleteWeeklyPlan(id);
      
      // 2. The Success Popup
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `Week ${weekNumber} deleted successfully.`,
        showConfirmButton: false,
        timer: 1500
      });
      
      onDeleted(); 
    } catch (error) {
      console.error("Failed to delete plan", error);
      
      // 3. The Error Popup
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Failed to delete weekly plan. Please check your connection.',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="text-sm font-bold text-gray-800">Manage & Delete Weekly Plans</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xs font-semibold px-2 py-1"
          >
            ✕ Close
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {history.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6">No historical weekly plans found.</p>
          ) : (
            history.map((plan) => (
              <div 
                key={plan.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    Week {plan.week_number}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {plan.start_date} to {plan.end_date}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={deletingId === plan.id}
                  onClick={() => handleDelete(plan.id, plan.week_number)}
                  className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  {deletingId === plan.id ? "Deleting..." : "🗑️ Delete"}
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 text-xs"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};