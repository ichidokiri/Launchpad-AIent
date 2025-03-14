// This is a simplified version that just re-exports react-hot-toast
import toast from "react-hot-toast"

// For compatibility with any code expecting useToast
export const useToast = () => {
  return {
    toast,
  }
}

// Export toast directly for convenience
export { toast }

