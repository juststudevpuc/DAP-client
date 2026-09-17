import { useState } from "react";
import { Button } from "@/components/ui/button";

export const SendDailyModal = ({ isOpen, onClose, onSend }) => {
  const [selectedDays, setSelectedDays] = useState({
    Mon: true,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
  });

  if (!isOpen) return null;

  const toggleDay = (day) => {
    setSelectedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleConfirm = () => {
    const daysArray = Object.keys(selectedDays).filter((day) => selectedDays[day]);
    onSend(daysArray);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Select Days to Send</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Choose which days you want to snapshot and send to Telegram. Multi-selection is supported!
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
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-xs">📅 {day}</span>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4"
          >
            🚀 Send to Telegram
          </Button>
        </div>
      </div>
    </div>
  );
};