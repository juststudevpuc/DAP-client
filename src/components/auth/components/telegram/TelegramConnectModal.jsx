import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

export const TelegramConnectModal = ({ isOpen, onClose, onLinked }) => {
  const [loading, setLoading] = useState(false);
  const [telegramUrl, setTelegramUrl] = useState('');
  const [error, setError] = useState('');
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTelegramLink();
    }
  }, [isOpen]);

  // Fetch the deep link URL from your Laravel backend
  const fetchTelegramLink = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://checkinme-api.onrender.com/api/telegram/link', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTelegramUrl(response.data.link);
      setIsLinked(response.data.is_linked);
      
      if (response.data.is_linked) {
        onLinked(); // Notify parent if already linked
      }
    } catch (err) {
      setError('Could not connect to Telegram service.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (telegramUrl) {
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
        <h3 className="text-xl font-bold mb-2">Connect Telegram</h3>
        
        {isLinked ? (
          <div className="text-center py-4">
            <div className="text-emerald-500 mb-2 text-4xl">✅</div>
            <p className="font-medium">Account Linked!</p>
            <Button onClick={onClose} className="mt-4 w-full">Close</Button>
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-sm mb-4">
              To send reports directly to your phone, please link your Telegram account.
            </p>
            
            {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
            
            <div className="space-y-3">
              <Button 
                onClick={handleConnect} 
                disabled={loading || !telegramUrl}
                className="w-full bg-sky-500 hover:bg-sky-600"
              >
                {loading ? 'Loading...' : 'Open Telegram & Start'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={fetchTelegramLink}
                className="w-full text-xs"
              >
                I already clicked Start (Refresh)
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="w-full text-gray-500"
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};