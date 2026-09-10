import { useState } from 'react';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';

export const useTelegramExport = () => {
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const sendToTelegram = async (componentRef, planData, type = 'weekly', scale = 3) => {
    const node = componentRef.current;
    if (!node) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("❌ You are not fully logged in. Please sign out and sign back in.");
      return;
    }

    setIsSendingTelegram(true);
    try {
      // Brief pause to stabilize DOM elements on initial render
      await new Promise((resolve) => setTimeout(resolve, 150));

      // 1. Configure canvas options based on Daily vs Weekly
      const canvasOptions = {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: node.scrollWidth,
        windowHeight: node.scrollHeight,
      };

      // If daily, hide the footer just like your daily PNG export
      if (type === 'daily') {
        canvasOptions.onclone = (clonedDoc) => {
          const footer = clonedDoc.getElementById("weekly-footer-container");
          if (footer) {
            footer.style.display = "none";
          }
        };
      }

      const rawCanvas = await html2canvas(node, canvasOptions);

      // 2. Convert canvas to a File (Blob)
      const blob = await new Promise((resolve) => {
        rawCanvas.toBlob(resolve, "image/png", 1.0);
      });

      if (!blob || blob.size === 0) {
        throw new Error("Generated image blob is empty.");
      }

      // 3. Prepare form data with dynamic naming
      const formData = new FormData();
      const fileName = type === 'daily' 
        ? `Daily_Action_Plan_${planData?.week_number || "01"}.png` 
        : `Weekly_Action_Plan_${planData?.week_number || "01"}.png`;
        
      formData.append("image", blob, fileName);

      // 4. Send to Laravel API
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
        alert(`✅ Successfully sent ${type === 'daily' ? 'Daily' : 'Weekly'} Plan to your Telegram!`);
      }

    } catch (error) {
      console.error("Failed to send to Telegram", error);
      
      if (error.response?.status === 403 && error.response?.data?.needs_linking) {
        setShowConnectModal(true);
      } else if (error.response?.status === 401) {
        alert("❌ Your session has expired. Please sign out and log back in.");
      } else if (error.response?.status === 422) {
        alert("❌ Image validation failed. Please try clicking the button again.");
      } else {
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