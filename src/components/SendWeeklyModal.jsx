import { useState } from "react";
import { RingLoader } from "react-spinners";
import Swal from "sweetalert2";

export const SendWeeklyModal = ({ isOpen, onClose, onSend }) => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(9); // Default to September (9)
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const getMonthName = (monthNum) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNum - 1] || "September";
  };

  const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

 const handleConfirmSend = async () => {
    setLoading(true);
    try {
      const monthName = getMonthName(Number(selectedMonth));
      const ordinalWeek = getOrdinalSuffix(Number(selectedWeek));
      const customCaption = `${ordinalWeek} weekly action plan in ${monthName}`;

      await onSend({
        week_number: Number(selectedWeek),
        month: Number(selectedMonth),
        caption: customCaption,
      });

      // NEW: Success Alert
      Swal.fire({
        icon: 'success',
        title: 'Sent!',
        text: 'Weekly plan sent to Telegram successfully.',
        showConfirmButton: false,
        timer: 1800
      });

      onClose();
    } catch (err) {
      console.error("Failed to send weekly telegram image", err);
      
      // NEW: Error Alert
      Swal.fire({
        icon: 'error',
        title: 'Send Failed',
        text: 'Failed to send image to Telegram. Please try again.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <span>📤</span> Send Weekly Plan to Telegram
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold px-2 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Week Selection */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Select Week Number
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>(1st) Week 1</option>
              <option value={2}>(2nd) Week 2</option>
              <option value={3}>(3rd) Week 3</option>
              <option value={4}>(4th) Week 4</option>
              <option value={5}>(5th) Week 5</option>
            </select>
          </div>

          {/* Month Selection */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Select Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>January</option>
              <option value={2}>February</option>
              <option value={3}>March</option>
              <option value={4}>April</option>
              <option value={5}>May</option>
              <option value={6}>June</option>
              <option value={7}>July</option>
              <option value={8}>August</option>
              <option value={9}>September</option>
              <option value={10}>October</option>
              <option value={11}>November</option>
              <option value={12}>December</option>
            </select>
          </div>

          {/* Preview Caption Box */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-blue-900">
            <span className="font-bold block text-[10px] text-blue-500 uppercase tracking-wider mb-0.5">
              Generated Telegram Caption Preview:
            </span>
            <span className="font-semibold text-xs">
              "{getOrdinalSuffix(Number(selectedWeek))} weekly action plan in {getMonthName(Number(selectedMonth))}"
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
         <button
            type="button"
            onClick={handleConfirmSend}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <RingLoader color="#ffffff" size={16} />
                Sending...
              </>
            ) : (
              "🚀 Send to Telegram"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
