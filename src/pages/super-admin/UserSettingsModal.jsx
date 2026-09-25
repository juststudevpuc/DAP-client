import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api'; // Use your central api service
import Swal from 'sweetalert2';

const swalStyle = { customClass: { popup: "rounded-2xl shadow-xl border border-gray-100" } };

export default function UserSettingsModal({ user, isOpen, onClose, onSaved }) {
    const [telegramEnabled, setTelegramEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setTelegramEnabled(user.telegram_notifications_enabled === 1 || user.telegram_notifications_enabled === true);
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Use apiService so cookies and CSRF headers match your app setup
            const response = await apiService.toggleUserTelegramNotification(user.id, {
                telegram_notifications_enabled: telegramEnabled ? 1 : 0
            });

            if (response.success || response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Saved!',
                    text: `Settings updated successfully for ${user.name}.`,
                    timer: 1500,
                    showConfirmButton: false,
                    ...swalStyle
                });
                onSaved(); // Refresh parent list
                onClose(); // Close modal
            }
        } catch (error) {
            console.error("Failed to save settings:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to save settings.',
                ...swalStyle
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Account Settings</h3>
                        <p className="text-xs text-gray-500">{user.name} ({user.email})</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSave} className="py-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <span className="font-medium text-gray-800 block text-xs">Telegram Daily Reminders</span>
                            <span className="text-[11px] text-gray-400">Automatically ping user on Telegram if metrics are missing.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={telegramEnabled} 
                                onChange={(e) => setTelegramEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}