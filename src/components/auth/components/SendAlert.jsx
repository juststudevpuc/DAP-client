import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SendAlert = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  // 1. Fetch connected users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://checkinme-api.onrender.com/api/telegram/users', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setStatus({ type: 'error', text: 'Could not load connected users.' });
      }
    };

    fetchUsers();
  }, []);

  // 2. Handle form submission to send the alert
  const handleSendAlert = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://checkinme-api.onrender.com/api/telegram/send-alert',
        {
          user_id: selectedUserId,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setStatus({ type: 'success', text: 'Alert sent successfully!' });
        setMessage(''); // Clear the message input
      }
    } catch (error) {
      console.error('Failed to send alert:', error);
      setStatus({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to send alert. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-md w-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Send Telegram Alert</h3>
          <p className="text-sm text-gray-500">Push a direct message to a linked user</p>
        </div>
      </div>

      {status.text && (
        <div className={`mb-4 p-3 text-sm rounded-lg ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {status.text}
        </div>
      )}

      <form onSubmit={handleSendAlert} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
          <select 
            value={selectedUserId} 
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          >
            <option value="" disabled>-- Choose a connected user --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} 
              </option>
            ))}
          </select>
          {users.length === 0 && (
            <p className="mt-1 text-xs text-amber-600">No users have linked their Telegram accounts yet.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message (Supports HTML)</label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows="3"
            placeholder="🚨 <b>New Order!</b> Check the dashboard."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedUserId || !message}
          className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white font-medium text-sm rounded-xl transition shadow-sm"
        >
          {loading ? 'Sending...' : 'Send Alert'}
        </button>
      </form>
    </div>
  );
};

export default SendAlert;