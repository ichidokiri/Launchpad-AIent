import toast from "react-hot-toast"

export { toast }

// For compatibility with any code expecting useToast
export const useToast = () => {
  return {
    toast,
  }
}

