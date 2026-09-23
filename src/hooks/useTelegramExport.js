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

    // 1. Style-verification loading popup with 1.5s visual buffer
    Swal.fire({
      title: "Verifying Styles...",
      text: "Checking template fonts and rendering snapshot...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setIsSendingTelegram(true);
    try {
      await document.fonts.ready;
      await new Promise((resolve) => setTimeout(resolve, 1500));

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

      const canvasOptions = {
        scale: scale,
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

      const blob = await new Promise((resolve) => {
        rawCanvas.toBlob(resolve, "image/png", 0.92);
      });

      if (!blob || blob.size === 0) {
        throw new Error("Generated image blob is empty.");
      }

      // 2. Smoothly update modal for upload state
      Swal.update({
        title: "Sending to Telegram...",
        text: "Uploading fully-styled report to your channel.",
      });

      // 3. Prepare form data (Including all required parameters for daily/weekly)
      const formData = new FormData();
      const fileName = type === 'daily'
        ? `Daily_Action_Plan_Week_${planData?.week_number || "1"}.png`
        : `Weekly_Action_Plan_Week_${planData?.week_number || "1"}.png`;

      formData.append("image", blob, fileName);
      formData.append("type", type);
      formData.append("week_number", planData?.week_number || 1);

      // 💡 Appending missing fields so backend gets month, year, and days correctly!
      if (planData?.month) {
        formData.append("month", planData.month);
      }
      if (planData?.year) {
        formData.append("year", planData.year);
      }
      if (planData?.days) {
        formData.append("days", JSON.stringify(planData.days));
      }
      if (planData?.caption) {
        formData.append("caption", planData.caption);
      }

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
          title: 'Sent Successfully!',
          text: `Successfully sent ${type === 'daily' ? 'Daily' : 'Weekly'} Plan to Telegram with full styles!`,
          showConfirmButton: false,
          timer: 1800
        });
      }

    } catch (error) {
      console.error("Failed to send to Telegram", error);

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
          text: err?.response?.data?.message || 'Failed to send to Telegram. Please try again.',
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