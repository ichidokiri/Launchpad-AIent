"use client"

import { cn } from "@/lib/utils"
import { forwardRef, useRef, useEffect, useCallback, type TextareaHTMLAttributes } from "react"

interface AutoResizeTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
    value: string
    onChange: (value: string) => void
}

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
    ({ className, value, onChange, ...props }, ref) => {
        const textareaRef = useRef<HTMLTextAreaElement>(null)

        const resizeTextarea = useCallback(() => {
            const textarea = textareaRef.current
            if (textarea) {
                textarea.style.height = "auto"
                textarea.style.height = `${textarea.scrollHeight}px`
            }
        }, [])

        useEffect(() => {
            resizeTextarea()
        }, [resizeTextarea])

        return (
            <textarea
                {...props}
                ref={(node) => {
                    // Forward the ref
                    if (typeof ref === "function") {
                        ref(node)
                    } else if (ref) {
                        ref.current = node
                    }
                    // Keep our internal ref
                    textareaRef.current = node
                }}
                value={value}
                rows={1}
                onChange={(e) => {
                    onChange(e.target.value)
                    resizeTextarea()
                }}
                className={cn("resize-none min-h-4 max-h-80", className)}
            />
        )
    },
)

AutoResizeTextarea.displayName = "AutoResizeTextarea"

