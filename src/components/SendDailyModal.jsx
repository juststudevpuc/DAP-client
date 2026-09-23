import { useState } from "react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";

export const SendDailyModal = ({ isOpen, onClose, onSend }) => {
  const [selectedDays, setSelectedDays] = useState({
    Mon: true,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggleDay = (day) => {
    setSelectedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  // 💡 Step definitions for the spotlight sequence (Added a 3rd Success/Done state representation if needed, or kept clean at 2 steps)
  const STEPS = [
    {
      icon: "🎨",
      title: "Verifying Styles...",
      desc: "Checking template fonts and layout styling before capture",
    },
    {
      icon: "📤",
      title: "Sending to Telegram...",
      desc: "Uploading fully-styled daily snapshot to your channel",
    },
  ];

  // 💡 Builds the spotlight card HTML for a given step index (0 or 1)
  const renderSpotlight = (stepIndex) => {
    const step = STEPS[stepIndex];
    const progressPct = ((stepIndex + 1) / STEPS.length) * 100;

    const dots = STEPS.map((_, i) => {
      const state =
        i < stepIndex ? "done" : i === stepIndex ? "active" : "upcoming";
      const dotClass =
        state === "done"
          ? "bg-blue-600"
          : state === "active"
          ? "bg-blue-600 scale-125 ring-4 ring-blue-100"
          : "bg-gray-200";
      return `<span class="inline-block w-2 h-2 rounded-full transition-all duration-500 ${dotClass}"></span>`;
    }).join('<span class="w-5 h-0.5 bg-gray-200 mx-1.5 rounded-full overflow-hidden"><span class="block h-full bg-blue-600 rounded-full transition-all duration-500" style="width: ' + (stepIndex > 0 ? "100%" : "0%") + '"></span></span>');

    return `
      <div class="flex flex-col items-center text-center px-2 pt-3 pb-1 animate-in fade-in slide-in-from-bottom-1 duration-300">
        <div class="relative flex items-center justify-center w-20 h-20 mb-4">
          <span class="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-sky-50 animate-ping opacity-60"></span>
          <span class="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50 to-white shadow-inner"></span>
          <span class="absolute inset-0 rounded-full border-2 border-blue-200 animate-spin [animation-duration:3s] [border-top-color:transparent] [border-right-color:transparent]"></span>
          <span class="relative text-3xl drop-shadow-sm animate-in zoom-in-50 duration-300">${step.icon}</span>
        </div>

        <div class="flex items-center justify-center mb-3.5">${dots}</div>

        <div class="text-gray-900 font-bold text-[15px] tracking-tight">${step.title}</div>
        <div class="text-xs text-gray-500 mt-1.5 max-w-[230px] leading-relaxed">${step.desc}</div>

        <div class="w-full h-1.5 bg-gray-100 rounded-full mt-5 overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style="width: ${progressPct}%"
          >
            <span class="absolute inset-0 bg-white/30 animate-pulse"></span>
          </div>
        </div>

        <div class="text-[10px] text-gray-400 font-medium mt-2 tabular-nums">
          Step ${stepIndex + 1} of ${STEPS.length}
        </div>
      </div>
    `;
  };

  const handleConfirm = async () => {
    const daysArray = Object.keys(selectedDays).filter(
      (day) => selectedDays[day],
    );

    if (daysArray.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Days Selected",
        text: "Please select at least one day to send.",
        confirmButtonColor: "#f59e0b",
        customClass: {
          popup: "rounded-2xl shadow-xl border border-gray-100",
        },
      });
      return;
    }

    setLoading(true);

    // 💡 Step 1: Render initial Verifying Styles spotlight card
    Swal.fire({
      html: renderSpotlight(0),
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: "#ffffff",
      width: 320,
      padding: "1.5rem",
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-gray-100",
      },
    });

    try {
      // Hold verification step for styling paint buffer
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 💡 Step 2: Smoothly update to Sending to Telegram spotlight card
      Swal.update({
        html: renderSpotlight(1),
      });

      // Execute the actual export & upload payload process
      const result = await onSend(daysArray);

      if (result && result.success === false) {
        throw new Error(result.message || "Telegram did not confirm delivery.");
      }

      

      onClose();
    } catch (error) {
      console.error("Failed to send daily telegram image", error);

      Swal.fire({
        icon: "error",
        title: "Send Failed",
        text: error.response?.data?.message || error.message || "Failed to send images to Telegram. Please try again.",
        confirmButtonColor: "#ef4444",
        customClass: {
          popup: "rounded-2xl shadow-xl border border-gray-100",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Select Days to Send
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Choose which days you want to snapshot and send to Telegram.
            Multi-selection is supported!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {Object.keys(selectedDays).map((day) => (
            <label
              key={day}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                selectedDays[day]
                  ? "bg-blue-50/80 border-blue-500 text-blue-900 font-semibold"
                  : "bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedDays[day]}
                onChange={() => toggleDay(day)}
                disabled={loading}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-55"
              />
              <span className="text-xs">📅 {day}</span>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose} 
            disabled={loading}
            className="text-xs"
          >
            Cancel
          </Button>
          
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={loading}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 flex items-center gap-2"
          >
            {loading ? (
              <>
                <RingLoader color="#ffffff" size={16} />
                Sending...
              </>
            ) : (
              "🚀 Send to Telegram"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};