import { useState } from 'react';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import Swal from 'sweetalert2';

export const useTelegramExport = () => {
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const sendToTelegram = async (componentRef, planData, type = 'weekly', scale = 2) => {
    const node = componentRef.current;
    if (!node) return;

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not fully logged in. Please sign out and sign back in.',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    setIsSendingTelegram(true);
    try {
      // 1. Ensure all inner images (like logo) are completely loaded before rasterizing
      const images = Array.from(node.querySelectorAll("img"));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // 2. Stabilization delay for layout settlement
      await new Promise((resolve) => setTimeout(resolve, 200));

      // 3. Configure canvas (allowTaint must be FALSE to avoid corrupted canvas exports)
      const canvasOptions = {
        scale: scale, // 2 provides crisp text without ballooning payload past server limits
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: node.scrollWidth,
        windowHeight: node.scrollHeight,
      };

      if (type === 'daily') {
        canvasOptions.onclone = (clonedDoc) => {
          const footer = clonedDoc.getElementById("weekly-footer-container");
          if (footer) {
            footer.style.display = "none";
          }
        };
      }

      const rawCanvas = await html2canvas(node, canvasOptions);

      // 4. Convert to Blob with safety validation
      const blob = await new Promise((resolve) => {
        rawCanvas.toBlob(resolve, "image/png", 0.92);
      });

      if (!blob || blob.size === 0) {
        throw new Error("Generated image blob is empty.");
      }

      // 5. Prepare form data
      const formData = new FormData();
      const fileName = type === 'daily'
        ? `Daily_Action_Plan_Week_${planData?.week_number || "1"}.png`
        : `Weekly_Action_Plan_Week_${planData?.week_number || "1"}.png`;

      formData.append("image", blob, fileName);
      formData.append("type", type);
      formData.append("week_number", planData?.week_number || 1);

      // 6. Send to Laravel API
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

      if (response.data?.success || response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Successfully sent ${type === 'daily' ? 'Daily' : 'Weekly'} Plan to your Telegram!`,
          showConfirmButton: false,
          timer: 1500
        });
      }

    } catch (error) {
      console.error("Failed to send to Telegram", error);

      // Print the exact Laravel validation errors in DevTools console
      if (error.response?.data?.errors) {
        console.error("Backend Validation Details:", error.response.data.errors);
      }

      if (error.response?.status === 403 && error.response?.data?.needs_linking) {
        setShowConnectModal(true);
      } else if (error.response?.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Your session has expired. Please sign out and log back in.',
          confirmButtonColor: '#ef4444'
        });
      } else if (error.response?.status === 422) {
        const serverMsg = error.response?.data?.message || "Image validation failed.";
        Swal.fire({
          icon: 'error',
          title: 'Validation Failed',
          text: serverMsg,
          confirmButtonColor: '#ef4444'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Send Failed',
          text: 'Failed to send to Telegram. Please try again.',
          confirmButtonColor: '#ef4444'
        });
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