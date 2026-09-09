import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TelegramConnect = () => {
  const [loading, setLoading] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [telegramUrl, setTelegramUrl] = useState('');
  const [error, setError] = useState('');

  // 1. Fetch link & current status when component mounts
  const fetchTelegramLink = async () => {
    setLoading(true);
    setError('');

    try {
      // Assumes your Axios instance attaches Bearer token automatically
      // or retrieve it from localStorage:
      const token = localStorage.getItem('token'); 

      const response = await axios.get('https://checkinme-api.onrender.com/api/telegram/link', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      setTelegramUrl(response.data.link);
      setIsLinked(response.data.is_linked);
    } catch (err) {
      console.error('Failed to generate Telegram link:', err);
      setError('Could not connect to Telegram service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelegramLink();
  }, []);

  // 2. Open Telegram deep-link in new tab
  const handleConnect = () => {
    if (telegramUrl) {
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-md w-full">
      <div className="flex items-center space-x-3 mb-4">
        {/* Telegram Icon */}
        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-500">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .34z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Telegram Notifications</h3>
          <p className="text-sm text-gray-500">Receive instant project alerts directly in Telegram</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {isLinked ? (
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center space-x-2 text-emerald-700 font-medium text-sm">
            <span> Connected</span>
          </div>
          <button
            onClick={fetchTelegramLink}
            className="text-xs text-emerald-600 hover:text-emerald-800 underline"
          >
            Refresh Status
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Click below to open Telegram and press <strong>Start</strong> to link your account.
          </p>

          <button
            onClick={handleConnect}
            disabled={loading || !telegramUrl}
            className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white font-medium text-sm rounded-xl transition shadow-sm"
          >
            {loading ? 'Generating Link...' : 'Connect to Telegram'}
          </button>

          <button
            type="button"
            onClick={fetchTelegramLink}
            className="w-full text-center text-xs text-gray-500 hover:text-gray-700 mt-2"
          >
            I already clicked Start (Check Status)
          </button>
        </div>
      )}
    </div>
  );
};

export default TelegramConnect;