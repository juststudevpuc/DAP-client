import { useState } from 'react';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';

export const useTelegramExport = () => {
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const sendToTelegram = async (componentRef, planData, scale = 3) => {
    const node = componentRef.current;
    if (!node) return;

    // 1. Token Safety Check (Prevents 401 Unauthorized errors)
    // ⚠️ IMPORTANT: If your app uses a different key for the token (like 'access_token'), change it here!
    const token = localStorage.getItem('token'); 
    
    if (!token) {
      alert("❌ You are not fully logged in. Please sign out and sign back in to generate a fresh token.");
      return;
    }

    setIsSendingTelegram(true);
    try {
      // 2. Capture the component to a canvas
      const rawCanvas = await html2canvas(node, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: node.scrollWidth,
        windowHeight: node.scrollHeight,
      });

      // 3. Convert canvas to a File (Blob)
      const blob = await new Promise((resolve) => {
        rawCanvas.toBlob(resolve, "image/png", 1.0);
      });

      // 4. Prepare form data
      const formData = new FormData();
      formData.append("image", blob, `Weekly_Plan_${planData?.week_number || "01"}.png`);

      // 5. Send to Laravel API
      const response = await axios.post(
        'https://checkinme-api.onrender.com/api/telegram/send-image',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data.success) {
        alert("✅ Successfully sent to your Telegram!");
      }

    } catch (error) {
      console.error("Failed to send to Telegram", error);
      
      // If backend says user isn't linked (403), open the Modal
      if (error.response?.status === 403 && error.response?.data?.needs_linking) {
        setShowConnectModal(true);
      } 
      // Handle the 401 Unauthorized Error specifically
      else if (error.response?.status === 401) {
        alert("❌ Your session has expired. Please sign out and log back in.");
      } 
      else {
        alert("❌ Failed to send to Telegram. Please try again.");
      }
    } finally {
      setIsSendingTelegram(false);
    }
  };

  return {
    isSendingTelegram,
    sendToTelegram,
    showConnectModal,
    setShowConnectModal
  };
};