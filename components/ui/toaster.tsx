import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"

export { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport }

export const Toaster = () => {
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  )
}

