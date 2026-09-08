import React, { useState } from 'react';
import axios from 'axios';

export default function TelegramConnectButton() {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      // Call your Laravel API (ensure auth token/cookies are attached)
      const res = await axios.get('/api/telegram/link');
      
      if (res.data.link) {
        // Open Telegram directly to the bot with the start token attached
        window.open(res.data.link, '_blank');
      }
    } catch (error) {
      console.error('Failed to generate Telegram link:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
    >
      {loading ? 'Generating link...' : 'Connect Telegram Alerts'}
    </button>
  );
}