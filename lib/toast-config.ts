/**
 * Configuration for toast notifications
 */
import toast, { type ToastPosition } from "react-hot-toast"

// Define the correct position type
const position: ToastPosition = "top-right"

// Default toast configuration
const toastConfig = {
  style: {
    background: "#1F1F1F", // Dark background
    color: "#FFFFFF", // White text
    border: "1px solid #444",
  },
  duration: 4000,
  position,
}

// Success toast configuration
const successToastConfig = {
  style: {
    background: "#0F3A1F", // Darker green background
    color: "#FFFFFF", // White text
    border: "1px solid #2A9D8F",
  },
  duration: 4000,
  position,
  icon: "🎉",
}

// Error toast configuration
const errorToastConfig = {
  style: {
    background: "#3A0F0F", // Darker red background
    color: "#FFFFFF", // White text
    border: "1px solid #E76F51",
  },
  duration: 5000,
  position,
  icon: "❌",
}

// Info toast configuration (for custom info toast)
const infoToastConfig = {
  style: {
    background: "#0F1F3A", // Darker blue background
    color: "#FFFFFF", // White text
    border: "1px solid #457B9D",
  },
  duration: 4000,
  position,
  icon: "ℹ️",
}

export const showToast = {
  success: (message: string) => toast.success(message, successToastConfig),
  error: (message: string) => toast.error(message, errorToastConfig),
  // Use custom toast for info since toast.info might not exist
  info: (message: string) => toast(message, infoToastConfig),
  default: (message: string) => toast(message, toastConfig),
}

